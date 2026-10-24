// 아기 이름 추천: 소리오행(첫소리) 조화 + 사주에 부족한 오행을 채우는 한자 고르기
import { HANJA, HANJA_NAMES, PURE_NAMES, COMMON_SURNAMES, type Hanja, type Gender } from '../data/baby-names';
import { ELEMENTS, type Element } from '../data/saju';
import { hashString } from './saju';

const GEN: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const CTRL: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

// 첫소리로 보는 소리오행 (작명에서 널리 쓰는 기준)
const CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const CHO_EL: Record<string, Element> = {
  ㄱ: 'wood', ㄲ: 'wood', ㅋ: 'wood',
  ㄴ: 'fire', ㄷ: 'fire', ㄸ: 'fire', ㄹ: 'fire', ㅌ: 'fire',
  ㅇ: 'earth', ㅎ: 'earth',
  ㅅ: 'metal', ㅆ: 'metal', ㅈ: 'metal', ㅉ: 'metal', ㅊ: 'metal',
  ㅁ: 'water', ㅂ: 'water', ㅃ: 'water', ㅍ: 'water',
};
export const choOf = (syl: string) => CHO[Math.floor((syl.charCodeAt(0) - 0xac00) / 588)];
export const soundEl = (syl: string) => CHO_EL[choOf(syl)];
export const isHangulSyllable = (s: string) => /^[가-힣]+$/.test(s);

const elShort = (e: Element) => `${ELEMENTS[e].name}(${ELEMENTS[e].hanja})`;

function pairRel(a: Element, b: Element): 'gen' | 'back' | 'same' | 'ctrl' {
  if (GEN[a] === b) return 'gen';
  if (GEN[b] === a) return 'back';
  if (a === b) return 'same';
  return 'ctrl';
}
const PAIR_PT = { gen: 12, back: 8, same: 5, ctrl: -6 };

export function soundHarmony(full: string) {
  const sy = [...full];
  const els = sy.map(soundEl);
  const rels = els.slice(1).map((e, i) => pairRel(els[i], e));
  const pt = rels.reduce((a, r) => a + PAIR_PT[r], 0);
  const good = rels.filter((r) => r === 'gen' || r === 'back').length;
  const bad = rels.filter((r) => r === 'ctrl').length;
  const text =
    bad === 0 && good === rels.length
      ? '첫소리의 오행이 차례로 서로를 살려 주는 상생 흐름이라 부르기 편하고 듣기 좋은 이름이에요.'
      : bad === 0
        ? '첫소리의 오행이 부딪히지 않고 무난하게 이어져서 부르기 편한 이름이에요.'
        : good > 0
          ? '첫소리 오행 중 한 군데가 서로 누르는 관계지만, 다른 쪽이 살려 주어 전체 흐름은 괜찮은 편이에요.'
          : '첫소리 오행이 서로 누르는 관계가 있어요. 소리오행은 참고용이니, 뜻과 느낌이 마음에 들면 충분히 좋은 이름이에요.';
  return { els, rels, pt, text, flow: sy.map((s, i) => `${s}(${ELEMENTS[els[i]].hanja})`).join(' → ') };
}

function josaWa(w: string) {
  const c = w.charCodeAt(w.length - 1) - 0xac00;
  return c >= 0 && c % 28 !== 0 ? '과' : '와';
}
function josaEul(w: string) {
  const c = w.charCodeAt(w.length - 1) - 0xac00;
  return c >= 0 && c % 28 !== 0 ? '을' : '를';
}
function josaRo(w: string) {
  const c = w.charCodeAt(w.length - 1) - 0xac00;
  const f = c >= 0 ? c % 28 : 0;
  return f === 0 || f === 8 ? '로' : '으로';
}

export function meaningOf(h1: Hanja, h2: Hanja) {
  return `${h1.idea}${josaWa(h1.idea)} ${h2.idea}${josaEul(h2.idea)} 함께 담아, ${h2.person}${josaRo(h2.person)} 자라길 바라는 이름이에요.`;
}

export interface Need {
  first: Element;
  second: Element;
  over: Element;
}

function pickHanja(syl: string, need: Need | null, seed: string): Hanja {
  const list = HANJA[syl];
  if (!need) return list[hashString(seed + syl) % list.length];
  const sc = (h: Hanja) => (h.el === need.first ? 3 : h.el === need.second ? 2 : h.el === need.over ? -1 : 0);
  return [...list].sort((a, b) => sc(b) - sc(a) || list.indexOf(a) - list.indexOf(b))[0];
}

export interface HanjaRec {
  kind: 'hanja';
  given: string;
  full: string;
  hanja: [Hanja, Hanja];
  meaning: string;
  sound: ReturnType<typeof soundHarmony>;
  sajuText: string;
  score: number;
  slug: string;
}
export interface PureRec {
  kind: 'pure';
  given: string;
  full: string;
  pure: (typeof PURE_NAMES)[number];
  sound: ReturnType<typeof soundHarmony>;
  score: number;
  slug: string;
}
export type Rec = HanjaRec | PureRec;

const fits = (g: Gender, want: 'M' | 'F') => g === 'U' || g === want;

export function recommend(surname: string, gender: 'M' | 'F', need: Need | null, style: 'all' | 'hanja' | 'pure'): Rec[] {
  const out: Rec[] = [];
  const first = surname[surname.length - 1];
  if (style !== 'pure') {
    for (const [given, g] of HANJA_NAMES) {
      if (!fits(g, gender) || given[0] === first) continue;
      const full = surname + given;
      const h1 = pickHanja(given[0], need, surname + given);
      const h2 = pickHanja(given[1], need, surname + given + '2');
      const sound = soundHarmony(full);
      let sajuPt = 0;
      let sajuText = '';
      if (need) {
        const pairs: [Hanja, string][] = [[h1, given[0]], [h2, given[1]]];
        const list = (el: Element) => pairs.filter(([h]) => h.el === el);
        const say = (xs: [Hanja, string][]) => {
          const last = xs[xs.length - 1][1];
          const c = last.charCodeAt(0) - 0xac00;
          return `${xs.map(([h, syl]) => `${h.h}(${syl})`).join(', ')}${c % 28 !== 0 ? '이' : '가'}`;
        };
        const a = list(need.first);
        const b = list(need.second);
        sajuPt = a.length * 7 + b.length * 4 - list(need.over).length * 4;
        sajuText = a.length
          ? `아기 사주에 부족한 ${elShort(need.first)} 기운을 ${say(a)} 채워 줘요.`
          : b.length
            ? `아기 사주를 돕는 ${elShort(need.second)} 기운을 ${say(b)} 보태 줘요.`
            : '사주 보완보다는 뜻과 소리의 아름다움을 살린 이름이에요.';
      }
      const score = Math.max(62, Math.min(99, Math.round(60 + sound.pt + sajuPt + ((hashString(full) % 5) - 2))));
      out.push({ kind: 'hanja', given, full, hanja: [h1, h2], meaning: meaningOf(h1, h2), sound, sajuText, score, slug: romanize(given) });
    }
  }
  if (style !== 'hanja') {
    for (const p of PURE_NAMES) {
      if (!fits(p.g, gender) || p.name[0] === first) continue;
      const full = surname + p.name;
      const sound = soundHarmony(full);
      const score = Math.max(62, Math.min(97, Math.round(63 + sound.pt + (need ? 2 : 0) + ((hashString(full) % 5) - 2))));
      out.push({ kind: 'pure', given: p.name, full, pure: p, sound, score, slug: romanize(p.name) });
    }
  }
  return out.sort((a, b) => b.score - a.score || hashString(a.full) - hashString(b.full));
}

// 이름 하나에 대한 한자 조합들 (이름 뜻 페이지용)
export function hanjaCombos(given: string) {
  const a = HANJA[given[0]] ?? [];
  const b = HANJA[given[1]] ?? [];
  const out: { h1: Hanja; h2: Hanja; meaning: string }[] = [];
  for (const h1 of a) for (const h2 of b) out.push({ h1, h2, meaning: meaningOf(h1, h2) });
  return out;
}

export function bestSurnames(given: string, n = 5) {
  return COMMON_SURNAMES.filter((s) => s !== given[0])
    .map((s) => ({ s, pt: soundHarmony(s + given).pt }))
    .sort((x, y) => y.pt - x.pt || COMMON_SURNAMES.indexOf(x.s) - COMMON_SURNAMES.indexOf(y.s))
    .slice(0, n)
    .map((x) => x.s);
}

// 국어의 로마자 표기법을 단순하게 따른 주소용 영문 이름
const R_CHO = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const R_JUNG = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const R_JONG = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];
export function romanize(word: string) {
  return [...word]
    .map((ch, i) => {
      const c = ch.charCodeAt(0) - 0xac00;
      if (c < 0 || c > 11171) return '';
      const cho = Math.floor(c / 588);
      const jung = Math.floor((c % 588) / 28);
      const jong = c % 28;
      const first = i === 0 && cho === 5 ? 'r' : R_CHO[cho];
      return first + R_JUNG[jung] + R_JONG[jong];
    })
    .join('');
}

export const ALL_NAME_PAGES = [
  ...HANJA_NAMES.map(([given, g]) => ({ given, g, kind: 'hanja' as const })),
  ...PURE_NAMES.map((p) => ({ given: p.name, g: p.g, kind: 'pure' as const })),
].map((x) => ({ ...x, slug: romanize(x.given) }));
