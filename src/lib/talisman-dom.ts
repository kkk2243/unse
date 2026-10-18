import type { TalismanData } from './talisman-image';
import { sceneSvg } from '../art/characters';

// 화면의 부적 카드를 새 결과로 채웁니다. (사주, 운세, 궁합처럼 화면에서 계산하는 페이지용)
export function fillTalisman(root: HTMLElement, d: Partial<TalismanData>) {
  const set = (k: string, v?: string) => {
    const el = root.querySelector<HTMLElement>(`[data-t="${k}"]`);
    if (el && v !== undefined) el.textContent = v;
  };
  set('kicker', d.kicker ?? '');
  set('name', d.name ?? '');
  set('big', d.big ?? '');
  set('line', d.line ?? '');
  const keys = root.querySelector<HTMLElement>('[data-t="keys"]');
  if (keys) {
    keys.innerHTML = '';
    (d.keys ?? []).forEach((k) => {
      const li = document.createElement('li');
      li.textContent = k;
      keys.appendChild(li);
    });
  }
  const rows = root.querySelector<HTMLElement>('[data-t="rows"]');
  if (rows) {
    rows.innerHTML = '';
    (d.rows ?? []).forEach(([k, v]) => {
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      rows.append(dt, dd);
    });
  }
  if (d.scene) {
    const art = root.querySelector<HTMLElement>('[data-t="art"]');
    const old = art?.querySelector(':scope > svg');
    if (art && old) {
      const tmp = document.createElement('div');
      tmp.innerHTML = sceneSvg(d.scene);
      old.replaceWith(tmp.firstElementChild!);
    }
  }
  if (d.seal !== undefined) {
    const seal = root.querySelector<HTMLElement>('[data-t="seal"] .seal');
    if (seal) setSeal(seal, d.seal);
  }
}

export function setSeal(seal: HTMLElement, text: string) {
  const chars = [...text];
  const kind = chars.length >= 4 ? 4 : chars.length >= 2 ? 2 : 1;
  seal.classList.remove('seal-1', 'seal-2', 'seal-4');
  seal.classList.add(`seal-${kind}`);
  if (kind === 4) {
    seal.innerHTML = '';
    chars.slice(0, 4).forEach((c) => {
      const s = document.createElement('span');
      s.textContent = c;
      seal.appendChild(s);
    });
  } else {
    seal.textContent = text;
  }
}

export function replayReveal(wrapper: HTMLElement) {
  wrapper.classList.remove('reveal');
  void wrapper.offsetWidth;
  wrapper.classList.add('reveal');
}
