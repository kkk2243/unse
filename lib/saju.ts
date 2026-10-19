// 사주 계산: 만세력 라이브러리(lunar-javascript)로 생년월일시를 간지로 바꾸고,
// 십신, 신강·신약, 대운, 일진·세운·월운과의 관계를 계산합니다.
import { Solar, Lunar } from 'lunar-javascript';
import { STEMS, BRANCHES, ELEMENT_ORDER, type Element } from '../data/saju';
import type { Birth } from './birth';

export type Group = 'self' | 'output' | 'wealth' | 'power' | 'resource';
// 비겁, 식상, 재성, 관성, 인성
export const GROUP_KO: Record<Group, string> = { self: '비겁', output: '식상', wealth: '재성', power: '관성', resource: '인성' };
export const GROUP_PLAIN: Record<Group, string> = {
  self: '나와 같은 기운',
  output: '표현하는 기운',
  wealth: '재물의 기운',
  power: '책임과 명예의 기운',
  resource: '배움과 도움의 기운',
};
export const GROUP_ORDER: Group[] = ['self', 'output', 'wealth', 'power', 'resource'];

export type TenGod = '비견' | '겁재' | '식신' | '상관' | '편재' | '정재' | '편관' | '정관' | '편인' | '정인';
export const TEN_GOD_GROUP: Record<TenGod, Group> = {
  비견: 'self',
  겁재: 'self',
  식신: 'output',
  상관: 'output',
  편재: 'wealth',
  정재: 'wealth',
  편관: 'power',
  정관: 'power',
  편인: 'resource',
  정인: 'resource',
};

const GEN: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const CTRL: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };

// 지지의 대표 천간 (본기)
export const BRANCH_MAIN: Record<string, string> = {
  子: '癸',
  丑: '己',
  寅: '甲',
  卯: '乙',
  辰: '戊',
  巳: '丙',
  午: '丁',
  未: '己',
  申: '庚',
  酉: '辛',
  戌: '戊',
  亥: '壬',
};

export function tenGod(dayStem: string, other: string): TenGod {
  const a = STEMS[dayStem];
  const b = STEMS[other];
  const same = a.yang === b.yang;
  if (a.el === b.el) return same ? '비견' : '겁재';
  if (GEN[a.el] === b.el) return same ? '식신' : '상관';
  if (CTRL[a.el] === b.el) return same ? '편재' : '정재';
  if (CTRL[b.el] === a.el) return same ? '편관' : '정관';
  return same ? '편인' : '정인';
}
export const tenGodOfBranch = (dayStem: string, branch: string) => tenGod(dayStem, BRANCH_MAIN[branch]);

// ---------- 지지 관계 ----------
export type Rel = '육합' | '삼합' | '충' | '원진' | '형' | '같음' | '평';
const pairKey = (a: string, b: string) => [a, b].sort().join('');
const YUKHAP = new Set(['子丑', '寅亥', '卯戌', '辰酉', '巳申', '午未'].map((p) => pairKey(p[0], p[1])));
const CHUNG = new Set(['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'].map((p) => pairKey(p[0], p[1])));
const WONJIN = new Set(['子未', '丑午', '寅酉', '卯申', '辰亥', '巳戌'].map((p) => pairKey(p[0], p[1])));
const HYUNG = new Set(['寅巳', '巳申', '寅申', '丑戌', '戌未', '丑未', '子卯'].map((p) => pairKey(p[0], p[1])));
const SELF_HYUNG = new Set(['辰', '午', '酉', '亥']);
const SAMHAP = ['申子辰', '亥卯未', '寅午戌', '巳酉丑'];

export function branchRels(a: string, b: string): Rel[] {
  const k = pairKey(a, b);
  const out: Rel[] = [];
  if (a === b) {
    out.push('같음');
    if (SELF_HYUNG.has(a)) out.push('형');
    return out;
  }
  if (CHUNG.has(k)) out.push('충');
  if (WONJIN.has(k)) out.push('원진');
  if (YUKHAP.has(k)) out.push('육합');
  if (SAMHAP.some((g) => g.includes(a) && g.includes(b))) out.push('삼합');
  if (HYUNG.has(k)) out.push('형');
  return out.length ? out : ['평'];
}
const REL_SCORE: Record<Rel, number> = { 육합: 8, 삼합: 6, 충: -10, 원진: -6, 형: -5, 같음: 2, 평: 0 };
const REL_PRIORITY: Rel[] = ['충', '원진', '육합', '삼합', '형', '같음', '평'];
export function mainRel(rels: Rel[]): Rel {
  return REL_PRIORITY.find((r) => rels.includes(r)) ?? '평';
}
export function relScore(rels: Rel[]) {
  return rels.reduce((s, r) => s + REL_SCORE[r], 0);
}

// ---------- 삼재 ----------
const SAMJAE: Record<string, string> = { 申子辰: '寅卯辰', 巳酉丑: '亥子丑', 寅午戌: '申酉戌', 亥卯未: '巳午未' };
export function samjae(birthBranch: string, yearBranch: string): '들삼재' | '눌삼재' | '날삼재' | null {
  const g = Object.keys(SAMJAE).find((k) => k.includes(birthBranch))!;
  const i = SAMJAE[g].indexOf(yearBranch);
  return i < 0 ? null : (['들삼재', '눌삼재', '날삼재'] as const)[i];
}
export function samjaeAnimals(yearBranch: string) {
  return Object.entries(SAMJAE)
    .filter(([, years]) => years.includes(yearBranch))
    .flatMap(([g]) => [...g])
    .map((b) => ({ branch: b, kind: samjae(b, yearBranch)! }));
}

// ---------- 사주 원국 ----------
export interface Pillar {
  label: string;
  stem: string;
  branch: string;
  stemGod: TenGod | '일간';
  branchGod: TenGod;
}
export interface Daeun {
  startAge: number;
  startYear: number;
  endYear: number;
  stem: string;
  branch: string;
  god: TenGod;
  current: boolean;
}
export interface Saju {
  pillars: Pillar[]; // 시, 일, 월, 년 순서 (전통 표기)
  dayStem: string;
  dayBranch: string;
  yearBranch: string;
  counts: Record<Element, number>;
  total: number;
  strongest: Element;
  weakest: Element;
  missing: Element[];
  groups: Record<Group, number>;
  strength: 'strong' | 'balanced' | 'weak';
  strengthRatio: number;
  solarText: string;
  lunarText: string;
  zodiac: string;
  hasTime: boolean;
  birthYear: number;
  daeun: Daeun[];
}

const SIJIN_HOUR = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

export function calcSaju(b: Birth & { gender?: 'M' | 'F' }, nowYear = new Date().getFullYear()): Saju | string {
  const hasTime = b.t >= 0;
  const hour = hasTime ? SIJIN_HOUR[b.t] : 12;
  let solar;
  try {
    if (b.cal === 'lunar') {
      const lunar = Lunar.fromYmdHms(b.y, b.leap ? -b.m : b.m, b.d, hour, 30, 0);
      solar = lunar.getSolar();
      const back = solar.getLunar();
      if (back.getYear() !== b.y || Math.abs(back.getMonth()) !== b.m || back.getDay() !== b.d || (back.getMonth() < 0) !== b.leap) {
        return b.leap ? `${b.y}년 음력 ${b.m}월에는 윤달이 없어요` : `음력 ${b.y}년 ${b.m}월 ${b.d}일은 없는 날짜예요`;
      }
    } else {
      solar = Solar.fromYmdHms(b.y, b.m, b.d, hour, 30, 0);
    }
  } catch {
    return b.leap ? `${b.y}년 음력 ${b.m}월에는 윤달이 없어요` : '날짜를 다시 확인해 주세요';
  }

  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const y = ec.getYear() as string;
  const m = ec.getMonth() as string;
  const d = ec.getDay() as string;
  const t = ec.getTime() as string;
  const ds = d[0];

  const mk = (label: string, gz: string): Pillar => ({
    label,
    stem: gz[0],
    branch: gz[1],
    stemGod: label === '일' ? '일간' : tenGod(ds, gz[0]),
    branchGod: tenGodOfBranch(ds, gz[1]),
  });
  const pillars: Pillar[] = [];
  if (hasTime) pillars.push(mk('시', t));
  pillars.push(mk('일', d), mk('월', m), mk('년', y));

  const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 } as Record<Element, number>;
  const groups = { self: 0, output: 0, wealth: 0, power: 0, resource: 0 } as Record<Group, number>;
  for (const p of pillars) {
    counts[STEMS[p.stem].el]++;
    counts[BRANCHES[p.branch].el]++;
    if (p.stemGod !== '일간') groups[TEN_GOD_GROUP[p.stemGod]]++;
    groups[TEN_GOD_GROUP[p.branchGod]]++;
  }
  const total = pillars.length * 2;
  const dayEl = STEMS[ds].el;
  const ordered = [...ELEMENT_ORDER].sort((a, b2) => counts[b2] - counts[a] || (b2 === dayEl ? 1 : 0) - (a === dayEl ? 1 : 0));
  const strongest = ordered[0];
  const weakest = [...ELEMENT_ORDER].sort((a, b2) => counts[a] - counts[b2] || ELEMENT_ORDER.indexOf(a) - ELEMENT_ORDER.indexOf(b2))[0];
  const missing = ELEMENT_ORDER.filter((e) => counts[e] === 0);

  // 신강·신약: 나를 돕는 글자(비겁, 인성)의 비중. 월지는 3배, 일지는 1.5배로 봄
  let support = 0;
  let weight = 0;
  for (const p of pillars) {
    if (p.stemGod !== '일간') {
      weight += 1;
      if (['self', 'resource'].includes(TEN_GOD_GROUP[p.stemGod])) support += 1;
    }
    const w = p.label === '월' ? 3 : p.label === '일' ? 1.5 : 1;
    weight += w;
    if (['self', 'resource'].includes(TEN_GOD_GROUP[p.branchGod])) support += w;
  }
  const ratio = support / weight;
  const strength = ratio >= 0.52 ? 'strong' : ratio <= 0.33 ? 'weak' : 'balanced';

  // 대운 (성별이 있을 때만)
  let daeun: Daeun[] = [];
  if (b.gender) {
    try {
      const yun = ec.getYun(b.gender === 'M' ? 1 : 0);
      daeun = (yun.getDaYun() as { getGanZhi(): string; getStartAge(): number; getStartYear(): number; getEndYear(): number }[])
        .filter((x) => x.getGanZhi())
        .slice(0, 9)
        .map((x) => {
          const gz = x.getGanZhi();
          return {
            startAge: x.getStartAge(),
            startYear: x.getStartYear(),
            endYear: x.getEndYear(),
            stem: gz[0],
            branch: gz[1],
            god: tenGod(ds, gz[0]),
            current: nowYear >= x.getStartYear() && nowYear <= x.getEndYear(),
          };
        });
    } catch {
      daeun = [];
    }
  }

  const lm = lunar.getMonth() as number;
  return {
    pillars,
    dayStem: ds,
    dayBranch: d[1],
    yearBranch: y[1],
    counts,
    total,
    strongest,
    weakest,
    missing,
    groups,
    strength,
    strengthRatio: ratio,
    solarText: `${solar.getYear()}년 ${solar.getMonth()}월 ${solar.getDay()}일`,
    lunarText: `음력 ${lunar.getYear()}년 ${lm < 0 ? '윤' : ''}${Math.abs(lm)}월 ${lunar.getDay()}일`,
    zodiac: BRANCHES[y[1]].animal,
    hasTime,
    birthYear: solar.getYear(),
    daeun,
  };
}

// ---------- 시기(날·달·해)의 기운 ----------
export function dayPillar(y: number, m: number, d: number) {
  return Solar.fromYmd(y, m, d).getLunar().getDayInGanZhi() as string;
}
export function yearPillar(y: number) {
  return Solar.fromYmd(y, 6, 1).getLunar().getYearInGanZhiExact() as string;
}
export function monthPillar(y: number, m: number) {
  return Solar.fromYmd(y, m, 15).getLunar().getMonthInGanZhiExact() as string;
}

// 신강·신약에 따라 도움이 되는 기운(억부)
export function favor(s: Saju, g: Group): number {
  const table: Record<Saju['strength'], Record<Group, number>> = {
    strong: { self: -1, resource: -0.7, output: 1, wealth: 1, power: 0.7 },
    weak: { self: 1, resource: 1, output: -0.5, wealth: -0.8, power: -1 },
    balanced: { self: 0, resource: 0.4, output: 0.5, wealth: 0.4, power: 0.2 },
  };
  return table[s.strength][g];
}

export function hashString(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface PeriodReading {
  gz: string;
  stemGod: TenGod;
  branchGod: TenGod;
  group: Group;
  rels: Rel[];
  rel: Rel;
  yearRels: Rel[];
  score: number;
  tone: 'good' | 'mid' | 'bad';
  helpsWeak: boolean;
}

export function readPeriod(s: Saju, gz: string, seed: string): PeriodReading {
  const stemGod = tenGod(s.dayStem, gz[0]);
  const branchGod = tenGodOfBranch(s.dayStem, gz[1]);
  const group = TEN_GOD_GROUP[stemGod];
  const rels = branchRels(s.dayBranch, gz[1]);
  const yearRels = branchRels(s.yearBranch, gz[1]);
  const el = STEMS[gz[0]].el;
  const helpsWeak = el === s.weakest || BRANCHES[gz[1]].el === s.weakest;
  let score = 70 + 11 * favor(s, group) + 6 * favor(s, TEN_GOD_GROUP[branchGod]);
  if (helpsWeak) score += 4;
  if (el === s.strongest && s.counts[s.strongest] >= 3) score -= 3;
  score += relScore(rels) + relScore(yearRels) * 0.4;
  score += (hashString(seed) % 13) - 6;
  score = Math.round(Math.max(42, Math.min(97, score)));
  return {
    gz,
    stemGod,
    branchGod,
    group,
    rels,
    rel: mainRel(rels),
    yearRels,
    score,
    tone: score >= 78 ? 'good' : score >= 63 ? 'mid' : 'bad',
    helpsWeak,
  };
}

export type Cat = 'love' | 'marriage' | 'money' | 'work' | 'business' | 'health' | 'study' | 'people';
export const AFF: Record<Cat, Record<Group, number>> = {
  love: { output: 1, wealth: 0.5, power: 0.5, self: -0.5, resource: 0 },
  marriage: { power: 1, wealth: 1, resource: 0.5, output: 0, self: -1 },
  money: { wealth: 1.2, output: 0.8, self: -1, power: 0, resource: -0.3 },
  work: { power: 1.2, resource: 0.6, wealth: 0.3, output: -0.5, self: 0 },
  business: { output: 1, wealth: 1, self: -0.5, power: 0, resource: -0.3 },
  health: { resource: 0.8, self: 0.5, power: -0.8, wealth: -0.3, output: 0 },
  study: { resource: 1.2, power: 0.5, output: 0.3, wealth: -0.8, self: 0 },
  people: { self: 1, resource: 0.5, output: 0.3, power: -0.5, wealth: 0 },
};
export function catStars(p: PeriodReading, cat: Cat, seed: string) {
  let v = 1 + ((p.score - 42) / 55) * 4 + AFF[cat][p.group] * 0.9;
  if (cat === 'love' || cat === 'marriage') {
    if (p.rels.includes('육합') || p.rels.includes('삼합')) v += 0.7;
    if (p.rels.includes('충') || p.rels.includes('원진')) v -= 0.8;
  }
  if (cat === 'health' && p.helpsWeak) v += 0.5;
  v += ((hashString(seed + cat) % 5) - 2) * 0.2;
  return Math.max(1, Math.min(5, Math.round(v)));
}
