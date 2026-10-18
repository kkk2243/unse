import { toast, track } from './ui';
import { renderTalisman, type TalismanData } from './talisman-image';

interface ShareData {
  title: string;
  text: string;
  url: string; // pathname
  cta: string; // pathname
  image: string; // absolute
  campaign: string;
  talisman: TalismanData | null;
}

type KakaoSDK = {
  isInitialized(): boolean;
  init(key: string): void;
  Share: { sendDefault(opts: unknown): void };
};

function kakao(): KakaoSDK | null {
  const w = window as unknown as { Kakao?: KakaoSDK };
  const script = document.getElementById('kakao-sdk') as HTMLScriptElement | null;
  if (!w.Kakao || !script) return null;
  try {
    if (!w.Kakao.isInitialized()) w.Kakao.init(script.dataset.kakaoKey!);
    return w.Kakao;
  } catch {
    return null;
  }
}

function withUtm(path: string, source: string, campaign: string) {
  const u = new URL(path, location.origin);
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'share');
  u.searchParams.set('utm_campaign', campaign);
  return u.href;
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 인앱 브라우저 대비
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {}
    ta.remove();
    return ok;
  }
}

export function readShare(el: HTMLElement): ShareData {
  return JSON.parse(el.dataset.share!);
}

// 결과가 화면에서 계산되는 페이지(운세, 이름 궁합 등)는 이 함수로 공유 내용을 바꿉니다.
export function updateShare(el: HTMLElement, patch: Partial<ShareData>) {
  const next = { ...readShare(el), ...patch };
  el.dataset.share = JSON.stringify(next);
  const imgBtn = el.querySelector<HTMLButtonElement>('[data-act="image"]');
  if (imgBtn) imgBtn.disabled = !next.talisman;
}

let currentBlobUrl = '';

async function openImage(d: ShareData) {
  if (!d.talisman) return;
  const dialog = document.querySelector<HTMLDialogElement>('.img-dialog');
  if (!dialog) return;
  const img = dialog.querySelector('img')!;
  const loading = dialog.querySelector<HTMLElement>('.img-loading')!;
  const dl = dialog.querySelector<HTMLAnchorElement>('.img-download')!;
  const shareBtn = dialog.querySelector<HTMLButtonElement>('.img-share')!;
  img.hidden = true;
  loading.hidden = false;
  dialog.showModal();

  const canvas = await renderTalisman(d.talisman);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.92));
  if (currentBlobUrl) URL.revokeObjectURL(currentBlobUrl);
  currentBlobUrl = URL.createObjectURL(blob);
  img.src = currentBlobUrl;
  img.hidden = false;
  loading.hidden = true;
  dl.href = currentBlobUrl;
  dl.download = `saju-${d.campaign}.jpg`;
  const file = new File([blob], `saju-${d.campaign}.jpg`, { type: 'image/jpeg' });
  const canShareFile = !!navigator.canShare?.({ files: [file] });
  shareBtn.hidden = !canShareFile;
  shareBtn.onclick = async () => {
    try {
      await navigator.share({ files: [file], title: d.title });
      track('share', { method: 'image_file', content_type: d.campaign });
    } catch {}
  };
  dl.onclick = () => track('share', { method: 'image_save', content_type: d.campaign });
  track('talisman_render', { content_type: d.campaign });
}

export function initShareBars() {
  document.querySelectorAll<HTMLElement>('.share-bar').forEach((bar) => {
    if (bar.dataset.ready) return;
    bar.dataset.ready = '1';
    bar.addEventListener('click', async (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-act]');
      if (!btn || btn.disabled) return;
      const d = readShare(bar);
      const act = btn.dataset.act;

      if (act === 'kakao') {
        const K = kakao();
        const url = withUtm(d.url, 'kakao', d.campaign);
        const cta = withUtm(d.cta, 'kakao', d.campaign);
        if (K) {
          K.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: d.title,
              description: d.text,
              imageUrl: d.image,
              link: { mobileWebUrl: url, webUrl: url },
            },
            buttons: [
              { title: '결과 보기', link: { mobileWebUrl: url, webUrl: url } },
              { title: '나도 해보기', link: { mobileWebUrl: cta, webUrl: cta } },
            ],
          });
          track('share', { method: 'kakao', content_type: d.campaign });
          return;
        }
        // 카카오 키가 없거나 SDK를 못 불러온 경우
        if (await copy(`${d.title}\n${url}`)) toast('링크를 복사했어요. 카톡 대화창에 붙여넣어 주세요');
        track('share', { method: 'kakao_fallback', content_type: d.campaign });
        return;
      }

      if (act === 'copy') {
        const url = withUtm(d.url, 'link', d.campaign);
        if (await copy(url)) toast('링크를 복사했어요');
        else toast('복사가 안 되는 브라우저예요. 주소창의 링크를 길게 눌러 복사해 주세요');
        track('share', { method: 'copy', content_type: d.campaign });
        return;
      }

      if (act === 'image') {
        openImage(d);
        return;
      }

      if (act === 'more') {
        const url = withUtm(d.url, 'webshare', d.campaign);
        if (navigator.share) {
          try {
            await navigator.share({ title: d.title, text: d.text, url });
            track('share', { method: 'webshare', content_type: d.campaign });
          } catch {}
        } else if (await copy(url)) {
          toast('링크를 복사했어요');
        }
      }
    });
  });

  const dialog = document.querySelector<HTMLDialogElement>('.img-dialog');
  if (dialog && !dialog.dataset.ready) {
    dialog.dataset.ready = '1';
    dialog.querySelector('.img-close')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }
}
