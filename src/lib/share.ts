import { toast, track } from './ui';
import { renderTalisman, renderShareCard, type TalismanData } from './talisman-image';

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
  Share: {
    sendDefault(opts: unknown): void;
    uploadImage(opts: { file: FileList | File[] }): Promise<{ infos: { original: { url: string } } }>;
  };
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

// 결과가 브라우저에서 계산되는 페이지(/…/result/)는 주소만 보내면 받은 사람에게 결과가 안 보여요.
// 그래서 이런 페이지는 '나도 해보기' 주소로 보내고, 내 결과는 이미지로 보여 줍니다.
function isPersonal(d: ShareData) {
  return /\/result\/$/.test(d.url);
}

function shortHead(d: ShareData) {
  return (d.talisman?.head ?? '').replace(/^사주 연구원\s*/, '').trim();
}

// '나는 81점 나왔어! 너는 몇 점일까?' 같은 공유 문구
export function brag(d: ShareData) {
  const t = d.talisman;
  if (!t) return { title: d.title, ask: '너도 해볼래?' };
  const tag = shortHead(d) ? `[${shortHead(d)}] ` : '';
  if (t.big && /점$/.test(t.big)) return { title: `${tag}나는 ${t.big} 나왔어! 너는 몇 점일까?`, ask: '너는 몇 점일까? 나도 해보기' };
  return { title: `${tag}나는 '${t.name}' 나왔어! 너는 뭐 나올까?`, ask: '너는 뭐 나올까? 나도 해보기' };
}

const cardCache = new Map<string, Promise<File | null>>();
// 같은 결과 카드는 한 번만 그립니다. 결과가 나오면 미리 그려 두어서, 공유 버튼을 누르면 바로 보낼 수 있어요.
function cardFile(d: ShareData): Promise<File | null> {
  if (!d.talisman) return Promise.resolve(null);
  const key = JSON.stringify(d.talisman);
  if (!cardCache.has(key)) cardCache.set(key, drawCard(d));
  return cardCache.get(key)!;
}

function warmCard(d: ShareData) {
  if (!d.talisman) return;
  const run = () => void cardFile(d);
  const w = window as unknown as { requestIdleCallback?: (f: () => void) => void };
  if (w.requestIdleCallback) w.requestIdleCallback(run);
  else setTimeout(run, 800);
}

async function drawCard(d: ShareData): Promise<File | null> {
  try {
    const canvas = await renderShareCard(d.talisman, brag(d).ask);
    const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), 'image/jpeg', 0.9));
    return new File([blob], `saju-${d.campaign}.jpg`, { type: 'image/jpeg' });
  } catch {
    return null;
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
  warmCard(next);
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
    warmCard(readShare(bar));
    bar.addEventListener('click', async (e) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-act]');
      if (!btn || btn.disabled) return;
      const d = readShare(bar);
      const act = btn.dataset.act;

      if (act === 'kakao') {
        const K = kakao();
        const personal = isPersonal(d);
        const url = withUtm(personal ? d.cta : d.url, 'kakao', d.campaign);
        const cta = withUtm(d.cta, 'kakao', d.campaign);
        const b = brag(d);
        if (K) {
          let imageUrl = d.image;
          let size: { imageWidth?: number; imageHeight?: number } = {};
          // 내 결과 카드를 그려서 카카오 서버에 올린 뒤 메시지 이미지로 씁니다.
          if (d.talisman) {
            toast('내 결과 카드를 만들고 있어요');
            const file = await cardFile(d);
            if (file) {
              try {
                const dt = new DataTransfer();
                dt.items.add(file);
                const r = await K.Share.uploadImage({ file: dt.files });
                imageUrl = r.infos.original.url;
                size = { imageWidth: 800, imageHeight: 800 };
              } catch {
                /* 업로드 실패 시 미리 만든 공유 이미지 사용 */
              }
            }
          }
          K.Share.sendDefault({
            objectType: 'feed',
            content: {
              title: b.title,
              description: d.text,
              imageUrl,
              ...size,
              link: { mobileWebUrl: url, webUrl: url },
            },
            buttons: personal
              ? [{ title: '나도 해보기', link: { mobileWebUrl: cta, webUrl: cta } }]
              : [
                  { title: '결과 보기', link: { mobileWebUrl: url, webUrl: url } },
                  { title: '나도 해보기', link: { mobileWebUrl: cta, webUrl: cta } },
                ],
          });
          track('share', { method: 'kakao', content_type: d.campaign });
          return;
        }
        // 카카오 키가 없거나 SDK를 못 불러온 경우: 문구 + 링크 복사
        if (await copy(`${b.title}\n${url}`)) toast('공유 문구를 복사했어요. 카톡 대화창에 붙여넣어 주세요');
        track('share', { method: 'kakao_fallback', content_type: d.campaign });
        return;
      }

      if (act === 'copy') {
        const url = withUtm(isPersonal(d) ? d.cta : d.url, 'link', d.campaign);
        const text = d.talisman ? `${brag(d).title}\n${url}` : url;
        if (await copy(text)) toast(d.talisman ? '공유 문구와 링크를 복사했어요' : '링크를 복사했어요');
        else toast('복사가 안 되는 브라우저예요. 주소창의 링크를 길게 눌러 복사해 주세요');
        track('share', { method: 'copy', content_type: d.campaign });
        return;
      }

      if (act === 'image') {
        openImage(d);
        return;
      }

      if (act === 'more') {
        const url = withUtm(isPersonal(d) ? d.cta : d.url, 'webshare', d.campaign);
        const b = brag(d);
        if (navigator.share) {
          // 휴대폰 공유 창: 내 결과 카드 이미지 + 문구 + 링크 (인스타, 카톡, 문자 등)
          const file = await cardFile(d);
          try {
            if (file && navigator.canShare?.({ files: [file] })) {
              await navigator.share({ files: [file], title: b.title, text: `${b.title}\n${url}` });
              track('share', { method: 'webshare_image', content_type: d.campaign });
            } else {
              await navigator.share({ title: b.title, text: b.title, url });
              track('share', { method: 'webshare', content_type: d.campaign });
            }
          } catch {}
        } else if (await copy(`${b.title}\n${url}`)) {
          toast('이 브라우저는 앱 공유를 지원하지 않아 문구와 링크를 복사했어요');
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
