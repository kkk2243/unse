export interface Birth {
  y: number;
  m: number;
  d: number;
  cal: 'solar' | 'lunar';
  leap: boolean;
  t: number; // 시진 0~11, 모름 -1
}

export function readBirth(form: HTMLFormElement, prefix: string): Birth | string {
  const get = (n: string) => (form.elements.namedItem(`${prefix}-${n}`) as HTMLInputElement | RadioNodeList | null);
  const val = (n: string) => {
    const el = get(n);
    return el ? String((el as HTMLInputElement).value ?? '') : '';
  };
  const y = Number(val('y'));
  const m = Number(val('m'));
  const d = Number(val('d'));
  if (!y || !m || !d) return '태어난 해, 달, 날을 모두 골라 주세요';
  const calEl = get('cal') as RadioNodeList | null;
  const cal = (calEl?.value as 'solar' | 'lunar') || 'solar';
  const leapEl = get('leap') as HTMLInputElement | null;
  const leap = cal === 'lunar' && !!leapEl?.checked;
  const tVal = val('t');
  const t = tVal === '' ? -1 : Number(tVal);
  if (cal === 'solar' && !isValidSolar(y, m, d)) return `${y}년 ${m}월에는 ${d}일이 없어요`;
  if (cal === 'lunar' && d > 30) return '음력 날짜는 30일까지만 있어요';
  return { y, m, d, cal, leap, t };
}

export function isValidSolar(y: number, m: number, d: number) {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function ymd(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function setBirth(form: HTMLFormElement, prefix: string, b: { y: number; m: number; d: number }) {
  const set = (n: string, v: number) => {
    const el = form.elements.namedItem(`${prefix}-${n}`) as HTMLSelectElement | null;
    if (el) el.value = String(v);
  };
  set('y', b.y);
  set('m', b.m);
  set('d', b.d);
}
