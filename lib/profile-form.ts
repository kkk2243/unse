import { readBirth } from './birth';
import type { Profile } from './profile';

export function readProfileForm(form: HTMLFormElement, prefix: string): (Omit<Profile, 'id'> & { save: boolean }) | string {
  const name = String((form.elements.namedItem(`${prefix}-name`) as HTMLInputElement | null)?.value ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  if (!name) return '이름이나 별명을 적어 주세요';
  const g = (form.elements.namedItem(`${prefix}-gender`) as RadioNodeList | null)?.value;
  const b = readBirth(form, prefix);
  if (typeof b === 'string') return b;
  const save = !!(form.elements.namedItem(`${prefix}-save`) as HTMLInputElement | null)?.checked;
  return { ...b, name, gender: g === 'M' ? 'M' : 'F', save };
}

export function fillProfileForm(form: HTMLFormElement, prefix: string, p: Omit<Profile, 'id'>) {
  const set = (n: string, v: string) => {
    const el = form.elements.namedItem(`${prefix}-${n}`) as HTMLInputElement | RadioNodeList | null;
    if (!el) return;
    if (el instanceof RadioNodeList) {
      el.value = v;
      // 라디오 change 이벤트로 윤달 칸 보이기
      el.forEach((r) => (r as HTMLInputElement).checked && r.dispatchEvent(new Event('change', { bubbles: true })));
    } else el.value = v;
  };
  set('name', p.name);
  set('gender', p.gender);
  set('cal', p.cal);
  set('y', String(p.y));
  set('m', String(p.m));
  set('d', String(p.d));
  set('t', String(p.t));
  const leap = form.elements.namedItem(`${prefix}-leap`) as HTMLInputElement | null;
  if (leap) leap.checked = !!p.leap;
}
