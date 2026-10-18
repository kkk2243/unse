// 운세 결과를 화면용 HTML로 그립니다 (브라우저에서 실행)
import { escapeHtml as e } from './ui';
import { iconSvg, CAT_ICON } from '../art/icons';
import { STEMS, BRANCHES, ELEMENTS, ELEMENT_ORDER } from '../data/saju';
import type { Saju } from './saju';
import { GROUP_KO, GROUP_PLAIN, GROUP_ORDER } from './saju';
import type { CatReading } from './reading';

export const starsHtml = (n: number) =>
  `<span class="stars" aria-label="5점 중 ${n}점">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}</span>`;

export function block(title: string, body: string, icon?: string, right = '') {
  return `<section class="card reading-block">
    <div class="reading-head">${icon ? `<span class="ico">${iconSvg(icon, 28)}</span>` : ''}<h3 class="flex-1">${e(title)}</h3>${right}</div>
    <div class="reading-text">${body}</div>
  </section>`;
}

export const paras = (list: string[]) => list.map((p) => `<p class="mt-2 first:mt-0">${e(p)}</p>`).join('');

export function catBlocks(cats: CatReading[]) {
  return cats.map((c) => block(c.name, paras([c.text]), CAT_ICON[c.key], starsHtml(c.stars))).join('');
}

// 분야별 별점 요약표
export function catSummary(cats: CatReading[]) {
  return `<section class="card reading-block"><h3 class="card-title">분야별 한눈에 보기</h3>
    <ul class="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">${cats
      .map((c) => `<li class="flex items-center justify-between gap-2 text-[15px]"><span class="font-semibold whitespace-nowrap">${e(c.name)}</span>${starsHtml(c.stars)}</li>`)
      .join('')}</ul></section>`;
}

export function luckyHtml(l: { color: string; number: string; direction: string; food: string; element: string }, extra: [string, string][] = []) {
  const el = ELEMENTS[l.element as keyof typeof ELEMENTS];
  const rows: [string, string][] = [
    ['행운의 색', l.color],
    ['행운의 숫자', l.number],
    ['좋은 방향', l.direction],
    ['챙길 음식', l.food],
    ...extra,
  ];
  return `<div class="flex items-start gap-4">
    <span class="lk-dot" style="background:${el.color}">${el.hanja}</span>
    <dl class="grid flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[15px]">${rows
      .map(([k, v]) => `<dt class="text-ink-2">${e(k)}</dt><dd class="font-semibold">${e(v)}</dd>`)
      .join('')}</dl></div>`;
}

// 사주 원국표 (십신 표시)
export function pillarTable(s: Saju) {
  const cell = (h: string, ko: string, el: keyof typeof ELEMENTS, god: string, me = false) =>
    `<div class="pc ${me ? 'me' : ''}" style="--e:${ELEMENTS[el].color}">
      <span class="pc-g">${e(god)}</span>
      <span class="pc-h">${h}</span>
      <span class="pc-k">${ko} <i>${ELEMENTS[el].ko}</i></span>
    </div>`;
  const cols = s.pillars
    .map((p) => {
      const st = STEMS[p.stem];
      const br = BRANCHES[p.branch];
      const me = p.label === '일';
      return `<div class="pcol">
        <div class="pc-label">${p.label}주${me ? ' <b>나</b>' : ''}</div>
        ${cell(p.stem, st.ko, st.el, me ? '나' : p.stemGod, me)}
        ${cell(p.branch, br.ko, br.el, p.branchGod)}
      </div>`;
    })
    .join('');
  return `<div class="pillars" style="--n:${s.pillars.length}">${cols}</div>`;
}

export function elementBars(s: Saju) {
  return `<ul class="ebars">${ELEMENT_ORDER.map((k) => {
    const el = ELEMENTS[k];
    const n = s.counts[k];
    return `<li>
      <span class="eb-name"><span class="eb-h" style="color:${el.color}">${el.hanja}</span> ${el.name}</span>
      <span class="bar" style="--bar-c:${el.color}"><i style="width:${Math.max(n ? 6 : 0, (n / s.total) * 100)}%"></i></span>
      <span class="eb-n">${n}개</span>
    </li>`;
  }).join('')}</ul>`;
}

export function groupBars(s: Saju) {
  const total = Object.values(s.groups).reduce((a, b) => a + b, 0) || 1;
  return `<ul class="ebars">${GROUP_ORDER.map((g) => {
    const n = s.groups[g];
    return `<li>
      <span class="eb-name">${GROUP_KO[g]}</span>
      <span class="bar" style="--bar-c:var(--cheong)"><i style="width:${Math.max(n ? 6 : 0, (n / total) * 100)}%"></i></span>
      <span class="eb-n">${n}개</span>
    </li>`;
  }).join('')}</ul>
  <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[13.5px] text-ink-3">${GROUP_ORDER.map((g) => `<dt class="font-semibold">${GROUP_KO[g]}</dt><dd>${GROUP_PLAIN[g]}</dd>`).join('')}</dl>`;
}

// 월별 운세 막대 그래프 (한 가지 값 → 막대 하나 색, 가장 좋은 달만 진하게)
export function monthChart(months: { month: number; score: number; text: string }[], best: number[]) {
  const W = 340;
  const H = 170;
  const pad = { l: 8, r: 8, t: 30, b: 26 };
  const bw = (W - pad.l - pad.r) / 12;
  const min = 40;
  const max = 100;
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
  const bars = months
    .map((m, i) => {
      const x = pad.l + i * bw + 4;
      const w = bw - 8;
      const top = y(m.score);
      const isBest = best.includes(m.month);
      const fill = isBest ? 'var(--jusa)' : 'color-mix(in srgb, var(--jusa) 32%, var(--card))';
      const label = isBest ? `<text x="${x + w / 2}" y="${top - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--ink)">${m.score}</text>` : '';
      return `<g class="mbar"><title>${m.month}월 ${m.score}점: ${e(m.text)}</title>
        <rect x="${x - 3}" y="${pad.t}" width="${w + 6}" height="${H - pad.t - pad.b}" fill="transparent"/>
        <path d="M${x} ${H - pad.b} V${top + 4} q0 -4 4 -4 h${w - 8} q4 0 4 4 V${H - pad.b} z" fill="${fill}"/>${label}
        <text x="${x + w / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--ink-3)">${m.month}</text></g>`;
    })
    .join('');
  const base = `<line x1="${pad.l}" x2="${W - pad.r}" y1="${H - pad.b}" y2="${H - pad.b}" stroke="var(--line)"/>`;
  const mid = `<line x1="${pad.l}" x2="${W - pad.r}" y1="${y(70)}" y2="${y(70)}" stroke="var(--line)" stroke-dasharray="3 4"/><text x="${pad.l}" y="${y(70) - 4}" text-anchor="start" font-size="10" fill="var(--ink-3)">70점</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="mchart" role="img" aria-label="월별 운세 점수">${mid}${base}${bars}</svg>`;
}
