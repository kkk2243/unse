// 메뉴 아이콘 (48×48, 선 + 포인트 색). 직접 그린 그림입니다.
const INK = '#3b2f3f';
const ST = `stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
const L = `fill="none" ${ST}`;
const Y = '#ffd23f';
const R = '#ff8a7a';
const B = '#9cc3ff';
const G = '#8fd39a';
const P = '#ffb3c7';

export const ICONS: Record<string, string> = {
  newyear: `<rect x="9" y="12" width="30" height="27" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.2"/><path d="M9 20 h30 v-4 a4 4 0 0 0 -4 -4 h-22 a4 4 0 0 0 -4 4 z" fill="${R}" ${ST}/><path d="M16 8 v7 M32 8 v7" ${L}/><path d="M24 23 l2.2 4.4 4.8 .7 -3.5 3.4 .8 4.8 -4.3 -2.3 -4.3 2.3 .8 -4.8 -3.5 -3.4 4.8 -.7 z" fill="${Y}" ${ST}/>`,
  today: `<circle cx="24" cy="24" r="9" fill="${Y}" ${ST}/><path d="M24 7 v4 M24 37 v4 M7 24 h4 M37 24 h4 M12 12 l3 3 M33 33 l3 3 M36 12 l-3 3 M15 33 l-3 3" ${L}/>`,
  tomorrow: `<path d="M30 9 a15 15 0 1 0 9 22 a12 12 0 0 1 -9 -22 z" fill="${Y}" ${ST}/><path d="M36 10 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 z" fill="${INK}"/><path d="M40 21 l.7 1.6 1.6 .7 -1.6 .7 -.7 1.6 -.7 -1.6 -1.6 -.7 1.6 -.7 z" fill="${INK}"/>`,
  date: `<rect x="9" y="12" width="30" height="27" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.2"/><path d="M9 20 h30" ${L}/><path d="M16 8 v7 M32 8 v7" ${L}/><circle cx="24" cy="29.5" r="6.5" fill="${G}" ${ST}/><path d="M21 29.5 l2.2 2.2 4 -4" ${L}/>`,
  saju: `<path d="M13 10 h22 a4 4 0 0 1 4 4 v20 a4 4 0 0 1 -4 4 h-22 z" fill="#fff6dd" ${ST}/><rect x="9" y="8" width="7" height="32" rx="3.5" fill="${R}" ${ST}/><path d="M22 17 h11 M22 23 h11 M22 29 h7" ${L}/><rect x="28" y="28" width="7" height="7" rx="1.5" fill="#c9301e"/>`,
  ohaeng: `<circle cx="24" cy="11" r="5.5" fill="${G}" ${ST}/><circle cx="37" cy="20.5" r="5.5" fill="${R}" ${ST}/><circle cx="32" cy="36" r="5.5" fill="${Y}" ${ST}/><circle cx="16" cy="36" r="5.5" fill="#e1e3ea" ${ST}/><circle cx="11" cy="20.5" r="5.5" fill="${B}" ${ST}/>`,
  gunghap: `<path d="M18 16 c0 -5 -7 -6 -9 -1 c-2 6 5 10 9 14 c4 -4 11 -8 9 -14 c-2 -5 -9 -4 -9 1 z" fill="${P}" ${ST}/><path d="M30 22 c0 -5 -7 -6 -9 -1 c-2 6 5 10 9 14 c4 -4 11 -8 9 -14 c-2 -5 -9 -4 -9 1 z" fill="#ff6f8f" ${ST}/>`,
  name: `<rect x="8" y="13" width="32" height="24" rx="4" fill="#fff" ${ST}/><path d="M8 20 h32" ${L}/><path d="M8 17 a4 4 0 0 1 4 -4 h24 a4 4 0 0 1 4 4 v3 h-32 z" fill="${B}" ${ST}/><path d="M14 27 h10 M14 32 h7" ${L}/><path d="M33 26 c0 -2.4 -3.4 -2.9 -4.3 -.5 c-1 2.9 2.4 4.8 4.3 6.7 c1.9 -1.9 5.3 -3.8 4.3 -6.7 c-.9 -2.4 -4.3 -1.9 -4.3 .5 z" fill="#ff6f8f" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`,
  mbtimatch: `<path d="M8 14 h12 v4 a3 3 0 0 0 6 0 v-4 h4 v12 h-4 a3 3 0 0 0 0 6 h4 v4 h-22 z" fill="${B}" ${ST}/><path d="M30 14 h10 v22 h-10 v-4 a3 3 0 0 1 0 -6 v-12" fill="${Y}" ${ST}/>`,
  group: `<circle cx="16" cy="20" r="6" fill="${Y}" ${ST}/><circle cx="32" cy="20" r="6" fill="${P}" ${ST}/><circle cx="24" cy="15" r="6" fill="${B}" ${ST}/><path d="M8 38 c0 -7 4 -11 8 -11 c4 0 8 4 8 11 M24 38 c0 -7 4 -11 8 -11 c4 0 8 4 8 11" ${L}/>`,
  animal: `<ellipse cx="24" cy="31" rx="8.5" ry="7" fill="${Y}" ${ST}/><circle cx="13" cy="22" r="4" fill="${Y}" ${ST}/><circle cx="20" cy="14" r="4" fill="${Y}" ${ST}/><circle cx="28" cy="14" r="4" fill="${Y}" ${ST}/><circle cx="35" cy="22" r="4" fill="${Y}" ${ST}/>`,
  mbti: `<rect x="11" y="10" width="26" height="30" rx="4" fill="#fff" ${ST}/><rect x="18" y="7" width="12" height="6" rx="2" fill="${B}" ${ST}/><path d="M17 21 l2 2 3.5 -3.5 M26 21 h5 M17 30 l2 2 3.5 -3.5 M26 30 h5" ${L}/>`,
  types: `<path d="M24 14 c-5 -4 -11 -4 -16 -2 v24 c5 -2 11 -2 16 2 c5 -4 11 -4 16 -2 v-24 c-5 -2 -11 -2 -16 2 z" fill="#fff" ${ST}/><path d="M24 14 v24" ${L}/><path d="M12 18 c3 -1 6 -1 8 0 M12 24 c3 -1 6 -1 8 0 M28 18 c3 -1 6 -1 8 0" ${L}/><path d="M30 26 h6 v8 l-3 -2 -3 2 z" fill="${R}" ${ST}/>`,
  zodiac: `<circle cx="24" cy="24" r="15" fill="#fff6dd" ${ST}/><circle cx="24" cy="24" r="6" fill="${Y}" ${ST}/>${Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return `<circle cx="${(24 + Math.cos(a) * 11).toFixed(1)}" cy="${(24 + Math.sin(a) * 11).toFixed(1)}" r="1.5" fill="${INK}"/>`;
  }).join('')}`,
  me: `<circle cx="24" cy="17" r="7" fill="${Y}" ${ST}/><path d="M10 40 c0 -9 6 -14 14 -14 c8 0 14 5 14 14 z" fill="${B}" ${ST}/>`,
  ring: `<circle cx="19" cy="28" r="10" fill="none" stroke="${INK}" stroke-width="3"/><circle cx="29" cy="28" r="10" fill="none" stroke="${INK}" stroke-width="3"/><path d="M19 18 l-3 -6 h6 z" fill="#bfe6f5" ${ST}/><path d="M29 18 l-3 -6 h6 z" fill="${Y}" ${ST}/>`,
  coin: `<circle cx="20" cy="22" r="11" fill="${Y}" ${ST}/><rect x="16.5" y="18.5" width="7" height="7" fill="none" stroke="#b8860b" stroke-width="2"/><circle cx="30" cy="30" r="11" fill="${Y}" ${ST}/><rect x="26.5" y="26.5" width="7" height="7" fill="none" stroke="#b8860b" stroke-width="2"/>`,
  briefcase: `<rect x="8" y="16" width="32" height="22" rx="4" fill="${B}" ${ST}/><path d="M18 16 v-4 a2 2 0 0 1 2 -2 h8 a2 2 0 0 1 2 2 v4 M8 25 h32" ${L}/><rect x="21" y="22.5" width="6" height="5" rx="1" fill="#fff" ${ST}/>`,
  shop: `<path d="M9 20 h30 v18 h-30 z" fill="#fff" ${ST}/><path d="M7 20 l4 -9 h26 l4 9 q-2 4 -6 4 q-4 0 -5 -4 q-1 4 -6 4 q-5 0 -6 -4 q-1 4 -5 4 q-4 0 -6 -4 z" fill="${R}" ${ST}/><rect x="20" y="28" width="8" height="10" fill="${Y}" ${ST}/>`,
  health: `<path d="M24 38 c-8 -6 -15 -11 -15 -19 c0 -5 4 -8 8 -8 c3 0 5 2 7 4 c2 -2 4 -4 7 -4 c4 0 8 3 8 8 c0 8 -7 13 -15 19 z" fill="${G}" ${ST}/><path d="M13 24 h7 l2 -4 l4 8 l2 -4 h7" ${L}/>`,
  book: `<path d="M24 14 c-5 -4 -11 -4 -16 -2 v24 c5 -2 11 -2 16 2 c5 -4 11 -4 16 -2 v-24 c-5 -2 -11 -2 -16 2 z" fill="#fff" ${ST}/><path d="M24 14 v24" ${L}/><path d="M12 18 c3 -1 6 -1 8 0 M12 24 c3 -1 6 -1 8 0 M28 18 c3 -1 6 -1 8 0 M28 24 c3 -1 6 -1 8 0" ${L}/>`,
  heart: `<path d="M24 38 c-8 -6 -15 -11 -15 -19 c0 -5 4 -8 8 -8 c3 0 5 2 7 4 c2 -2 4 -4 7 -4 c4 0 8 3 8 8 c0 8 -7 13 -15 19 z" fill="#ff6f8f" ${ST}/>`,
  clock: `<circle cx="24" cy="24" r="15" fill="#fff" ${ST}/><path d="M24 15 v9 l6 4" ${L}/><circle cx="24" cy="24" r="2" fill="${R}"/>`,
  clover: `<g fill="${G}" ${ST}><circle cx="18" cy="18" r="7"/><circle cx="30" cy="18" r="7"/><circle cx="18" cy="30" r="7"/><circle cx="30" cy="30" r="7"/></g><path d="M24 24 q4 8 10 14" ${L}/>`,
  wave: `<path d="M6 30 q6 -6 12 0 t12 0 t12 0" ${L}/><path d="M6 22 q6 -6 12 0 t12 0 t12 0" ${L}/><path d="M24 8 v8 M18 11 l6 -3 6 3" ${L}/>`,
};


export const CAT_ICON: Record<string, string> = {
  love: 'heart',
  marriage: 'ring',
  money: 'coin',
  work: 'briefcase',
  business: 'shop',
  health: 'health',
  study: 'book',
  people: 'group',
};

export function iconSvg(id: string, size = 40) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${ICONS[id] ?? ''}</svg>`;
}

// 하단 탭바 아이콘 (24×24 선)
const T = `fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"`;
export const TAB_ICONS: Record<string, string> = {
  home: `<path d="M4 11 l8 -7 l8 7 v8.5 a1.5 1.5 0 0 1 -1.5 1.5 h-4 v-6 h-5 v6 h-4 a1.5 1.5 0 0 1 -1.5 -1.5 z" ${T}/>`,
  year: `<rect x="4" y="5.5" width="16" height="15" rx="2.5" ${T}/><path d="M4 10 h16 M8.5 3.5 v4 M15.5 3.5 v4" ${T}/><path d="M12 12.5 l1.2 2.3 2.5 .4 -1.8 1.8 .4 2.5 -2.3 -1.2 -2.3 1.2 .4 -2.5 -1.8 -1.8 2.5 -.4 z" ${T}/>`,
  love: `<path d="M12 7.5 c0 -3 -4.5 -4 -6.2 -.8 c-1.6 3.2 2.4 7 6.2 10.3 c3.8 -3.3 7.8 -7.1 6.2 -10.3 c-1.7 -3.2 -6.2 -2.2 -6.2 .8 z" ${T}/>`,
  test: `<path d="M12 3.5 l2.4 5 5.4 .8 -3.9 3.8 .9 5.4 -4.8 -2.6 -4.8 2.6 .9 -5.4 -3.9 -3.8 5.4 -.8 z" ${T}/>`,
  me: `<circle cx="12" cy="8.5" r="4" ${T}/><path d="M4.5 20.5 c0 -4.5 3.3 -7 7.5 -7 c4.2 0 7.5 2.5 7.5 7" ${T}/>`,
};
