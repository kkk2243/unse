// 사주 계산 결과와 풀이 문장을 엮어서 화면에 보여줄 운세 한 편을 만듭니다.
import { Solar } from 'lunar-javascript';
import {
  type Saju,
  type Cat,
  type Group,
  type Rel,
  type TenGod,
  readPeriod,
  catStars,
  AFF,
  dayPillar,
  yearPillar,
  monthPillar,
  tenGod,
  TEN_GOD_GROUP,
  favor,
  hashString,
  samjae,
  branchRels,
  mainRel,
} from './saju';
import { STEMS, BRANCHES, ELEMENTS, type Element } from '../data/saju';
import * as R from '../data/reading';
import * as M from '../data/reading-more';
import { josa } from './hangul';
import { DAY_MASTER, DOMAINS } from '../data/saju';

export type PeriodKind = 'today' | 'tomorrow' | 'date' | 'year' | 'month';
const TOK: Record<PeriodKind, { T: string; 은: string; 의: string }> = {
  today: { T: '오늘', 은: '오늘은', 의: '오늘의' },
  tomorrow: { T: '내일', 은: '내일은', 의: '내일의' },
  date: { T: '이날', 은: '이날은', 의: '이날의' },
  year: { T: '올해', 은: '올해는', 의: '올해의' },
  month: { T: '이번 달', 은: '이번 달은', 의: '이번 달의' },
};
export function fillT(text: string, kind: PeriodKind) {
  const t = TOK[kind];
  return text.replaceAll('{T은}', t.은).replaceAll('{T의}', t.의).replaceAll('{T}', t.T);
}
const pick = <T,>(list: T[], seed: string) => list[hashString(seed) % list.length];
const tipOf = (cat: Cat, stars: number, seed: string) => M.CAT_TIP[cat][tierOf(stars)][hashString(seed + cat + 'tip') % 2];
const pickN = (list: string[], n: number, seed: string) => {
  const a = [...list];
  const out: string[] = [];
  let h = hashString(seed);
  while (out.length < n && a.length) {
    out.push(a.splice(h % a.length, 1)[0]);
    h = Math.floor(h / 7) + 13;
  }
  return out;
};
const tierOf = (stars: number) => (stars >= 4 ? 'high' : stars >= 3 ? 'mid' : 'low') as 'high' | 'mid' | 'low';

const GEN: Record<Element, Element> = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
const GEN_BY: Record<Element, Element> = { fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal', wood: 'water' };

// 나에게 도움이 되는 기운(행운의 오행)
export function luckyElements(s: Saju): Element[] {
  const me = STEMS[s.dayStem].el;
  const primary = s.strength === 'strong' ? GEN[me] : s.strength === 'weak' ? GEN_BY[me] : s.weakest;
  const second = s.weakest !== primary ? s.weakest : s.strength === 'weak' ? me : GEN[me];
  return [primary, second];
}

function luckyItems(el: Element, seed: string) {
  const e = ELEMENTS[el];
  const colors = e.colorName.split(', ');
  const nums = e.numbers.split(', ');
  return {
    element: el,
    color: pick(colors, seed + 'c'),
    number: pick(nums, seed + 'n'),
    direction: e.direction,
    food: e.food,
  };
}

export interface CatReading {
  key: Cat;
  name: string;
  stars: number;
  text: string;
  tip: string;
}

// ---------- 하루 운세 (오늘, 내일, 지정일) ----------
export function dayReading(s: Saju, ymd: string, kind: 'today' | 'tomorrow' | 'date', who = '') {
  const [y, m, d] = ymd.split('-').map(Number);
  const gz = dayPillar(y, m, d);
  const seed = `${who}|${s.dayStem}${s.dayBranch}${s.yearBranch}|${ymd}`;
  const p = readPeriod(s, gz, seed);
  const cats: CatReading[] = R.CAT_ORDER.map((cat) => {
    const stars = catStars(p, cat, seed);
    const c = R.CAT_TEXT[cat];
    return { key: cat, name: R.CAT_NAME[cat], stars, text: `${fillT(c.reason[p.group], kind)} ${pickN(c.tier[tierOf(stars)], 2, seed + cat).join(' ')}`, tip: tipOf(cat, stars, seed) };
  });
  const times = [
    { label: '오전', range: '9시~12시', h: 10 },
    { label: '오후', range: '13시~17시', h: 15 },
    { label: '저녁', range: '18시~21시', h: 19 },
  ].map((t) => {
    const tgz = Solar.fromYmdHms(y, m, d, t.h, 0, 0).getLunar().getTimeInGanZhi() as string;
    const g = TEN_GOD_GROUP[tenGod(s.dayStem, tgz[0])];
    const good = favor(s, g) >= 0;
    return { label: t.label, range: t.range, good, text: good ? R.TIME_LINE[g].good : R.TIME_LINE[g].bad };
  });
  const els = luckyElements(s);
  const lucky = luckyItems(els[hashString(seed + 'el') % 2], seed);
  const fv = favor(s, p.group);
  const when = kind === 'today' ? '오늘' : kind === 'tomorrow' ? '내일' : '이날';
  const gzKo = STEMS[gz[0]].ko + BRANCHES[gz[1]].ko;
  const total = [
    fillT(R.DAY_THEME[p.group][p.tone], kind),
    `${when}의 일진은 ${gzKo}(${gz})일이에요. 하늘의 기운 ${STEMS[gz[0]].ko}(${gz[0]})${josa(STEMS[gz[0]].ko, '은', '는')} 나에게 '${p.stemGod}'에 해당하는데, ${R.DAY_GOD[p.stemGod]} ${R.DAY_FIT[fv >= 0.5 ? 'good' : fv >= -0.5 ? 'mid' : 'bad']}`,
    fillT(R.REL_TEXT[p.rel], kind),
  ];
  return {
    ymd,
    gz,
    score: p.score,
    tone: p.tone,
    group: p.group,
    stemGod: p.stemGod,
    rel: p.rel,
    headline: pick(R.DAY_HEADLINE[p.tone], seed + 'h'),
    total,
    keywords: pickN(M.KEYWORDS[p.group], 3, seed + 'k'),
    dos: pickN(M.DAY_DO[p.group], 3, seed + 'do'),
    donts: pickN(M.DAY_DONT[p.group], 2, seed + 'dont'),
    cats,
    times,
    lucky,
    advice: pick(R.ADVICE, seed + 'a'),
  };
}
export type DayReading = ReturnType<typeof dayReading>;

// ---------- 신년운세 ----------
export function yearReading(s: Saju, year: number, who = '') {
  const gz = yearPillar(year);
  const seed = `${who}|${s.dayStem}${s.dayBranch}${s.yearBranch}|Y${year}`;
  const p = readPeriod(s, gz, seed);
  const months = Array.from({ length: 12 }, (_, i) => {
    const mgz = monthPillar(year, i + 1);
    const mp = readPeriod(s, mgz, `${seed}|M${i + 1}`);
    return { month: i + 1, gz: mgz, score: mp.score, tone: mp.tone, group: mp.group, text: R.MONTH_LINE[mp.group][mp.tone], detail: `${M.MONTH_DETAIL[mp.group][mp.tone]} ${M.SEASON_LINE[i]}`, p: mp };
  });
  const avg = months.reduce((a, x) => a + x.score, 0) / 12;
  const score = Math.round(p.score * 0.6 + avg * 0.4);
  const sorted = [...months].sort((a, b) => b.score - a.score);
  const cats: CatReading[] = R.CAT_ORDER.map((cat) => {
    const stars = catStars(p, cat, seed);
    const c = R.CAT_TEXT[cat];
    const t = tierOf(stars);
    const goodMonths = [...months]
      // 분야와 잘 맞는 기운(십신)이 들어오는 달을 먼저 고르고, 같은 조건이면 점수가 높은 달
      .map((x) => ({ m: x.month, v: x.score / 9 + AFF[cat][x.group] * 2.6 + ((cat === 'love' || cat === 'marriage') && /육합|삼합/.test(x.p.rels.join()) ? 1 : 0) }))
      .sort((a, b) => b.v - a.v)
      .slice(0, 2)
      .sort((a, b) => a.m - b.m)
      .map((x) => `${x.m}월`);
    const extra = t === 'low' ? ` 그래도 ${goodMonths.join('과 ')}에는 숨통이 트여요.` : ` 특히 ${goodMonths.join('과 ')}에 기운이 가장 좋아요.`;
    return {
      key: cat,
      name: R.CAT_NAME[cat],
      stars,
      text: `${fillT(c.reason[p.group], 'year')} ${c.tier[t][0]} ${c.tier[t][1]}${extra}`,
      tip: tipOf(cat, stars, seed),
    };
  });
  const first = months.slice(0, 6).reduce((a, x) => a + x.score, 0) / 6;
  const second = months.slice(6).reduce((a, x) => a + x.score, 0) / 6;
  const half = Math.abs(first - second) < 3 ? M.HALF_TEXT.even : first > second ? M.HALF_TEXT.first : M.HALF_TEXT.second;
  const curD = s.daeun.find((d) => d.current);
  const dGood = curD ? favor(s, TEN_GOD_GROUP[curD.god]) > 0 : false;
  const yGood = favor(s, p.group) > 0;
  const daeunMeet = curD
    ? `지금은 ${curD.startAge}세부터 이어지는 ${curD.stem}${curD.branch} 대운을 지나고 있어요. ${M.DAEUN_MEET[dGood && yGood ? 'both' : dGood ? 'daeunOnly' : yGood ? 'yearOnly' : 'neither']}`
    : '';
  const sj = samjae(s.yearBranch, gz[1]);
  const zodiacRel = mainRel(branchRels(s.yearBranch, gz[1]));
  const els = luckyElements(s);
  return {
    year,
    gz,
    info: R.YEAR_INFO[year],
    score,
    grade: R.YEAR_GRADE(score),
    stemGod: p.stemGod,
    group: p.group,
    theme: `${year}년은 ${R.YEAR_GOD[p.stemGod]}`,
    relText: fillT(R.REL_TEXT[p.rel], 'year'),
    zodiacText: R.ZODIAC_REL[zodiacRel].total,
    samjae: sj,
    samjaeText: sj ? R.SAMJAE_TEXT[sj] : '',
    months: months.map(({ p: _p, ...rest }) => rest),
    half,
    daeunMeet,
    keywords: pickN(M.KEYWORDS[p.group], 3, seed + 'k'),
    dos: M.YEAR_DO[p.group],
    donts: M.YEAR_DONT[p.group],
    best: sorted.slice(0, 2).map((x) => x.month),
    worst: sorted.slice(-2).map((x) => x.month).reverse(),
    cats,
    lucky: luckyItems(els[0], seed),
    lucky2: luckyItems(els[1], seed + '2'),
  };
}
export type YearReading = ReturnType<typeof yearReading>;

// ---------- 정통 사주 (타고난 운) ----------
const tier3 = (n: number, a = 1, b = 3) => (n === 0 ? 'none' : n < b ? 'some' : 'many') as 'none' | 'some' | 'many';

export function natalReading(s: Saju, gender?: 'M' | 'F') {
  const dm = DAY_MASTER[s.dayStem];
  const me = STEMS[s.dayStem].el;
  const G = s.groups;
  const order = (['self', 'output', 'wealth', 'power', 'resource'] as Group[]).sort((a, b) => G[b] - G[a]);
  const dominant = order[0];
  const lacking = (['self', 'output', 'wealth', 'power', 'resource'] as Group[]).filter((g) => G[g] === 0);
  const spouseCount = gender === 'M' ? G.wealth : gender === 'F' ? G.power : Math.max(G.wealth, G.power);
  const palaceGroup = TEN_GOD_GROUP[s.pillars.find((p) => p.label === '일')!.branchGod];
  const biz = G.wealth + G.output;
  const bizTier = biz <= 1 ? 'low' : biz <= 3 ? 'mid' : 'high';
  const strongEl = s.strongest;
  const DOM = DOMAINS_TEXT[me];

  const byLabel = (l: string) => s.pillars.find((p) => p.label === l);
  const stageGroup = (l: string, useBranch = false) => {
    const p = byLabel(l);
    if (!p) return null;
    const god = useBranch || p.stemGod === '일간' ? p.branchGod : p.stemGod;
    return TEN_GOD_GROUP[god as TenGod];
  };
  const stages = (
    [
      ['early', stageGroup('년')],
      ['young', stageGroup('월')],
      ['middle', stageGroup('일', true)],
      ['late', stageGroup('시')],
    ] as const
  ).filter((x) => x[1]) as unknown as ['early' | 'young' | 'middle' | 'late', Group][];
  // 사주에 들어 있는 십신과 개수
  const godCount = new Map<TenGod, number>();
  for (const p of s.pillars) {
    for (const g of [p.stemGod, p.branchGod]) if (g !== '일간') godCount.set(g as TenGod, (godCount.get(g as TenGod) ?? 0) + 1);
  }
  const gods = [...godCount.entries()].sort((x, y) => y[1] - x[1]);
  const plus = M.PLUS[dominant];
  const minus = M.MINUS[dominant];

  const sections: { key: string; title: string; paras: string[]; list?: { label: string; items: string[] }[] }[] = [
    { key: 'me', title: `${dm.image}${josaE(dm.image)} 닮은 사람`, paras: dm.about },
    {
      key: 'ilju',
      title: `${STEMS[s.dayStem].ko}${BRANCHES[s.dayBranch].ko}(${s.dayStem}${s.dayBranch}) 일주로 보는 나`,
      paras: [
        `태어난 날의 기둥, 일주는 사주에서 '나 자신'을 가장 잘 보여 주는 자리예요. 위 글자 ${s.dayStem}${josaE(STEMS[s.dayStem].ko) === '을' ? '은' : '는'} 겉으로 드러나는 나, 아래 글자 ${s.dayBranch}${josaE(BRANCHES[s.dayBranch].ko) === '을' ? '은' : '는'} 속마음과 배우자 자리를 뜻해요.`,
        M.BRANCH_SEAT[s.dayBranch],
        M.SEAT_GROUP[palaceGroup],
      ],
    },
    { key: 'strength', title: R.STRENGTH_TEXT[s.strength].name, paras: [R.STRENGTH_TEXT[s.strength].text] },
    {
      key: 'groups',
      title: '타고난 기질',
      paras: [R.GROUP_STRONG[dominant], ...(lacking.length ? [`반대로 사주에 ${lacking.map((g) => R.GROUP_LACK[g]).join(' ')}`] : [])],
      list: [
        { label: '이런 점이 강해요', items: plus },
        { label: '이런 점은 챙겨 주세요', items: minus },
      ],
    },
    {
      key: 'gods',
      title: '내 사주 속 십신',
      paras: [
        '십신은 나(일간)를 기준으로 다른 글자들이 어떤 관계인지 열 가지로 나눈 거예요. 많이 가진 십신일수록 내 성격과 삶에 크게 드러나요.',
        ...gods.slice(0, 4).map(([g, n]) => `${g} ${n}개: ${M.TEN_GOD_DESC[g]}`),
      ],
    },
    {
      key: 'stages',
      title: '인생 시기별 흐름',
      paras: [
        '사주의 네 기둥은 각각 인생의 시기를 뜻해요. 태어난 해는 초년, 달은 청년, 날은 중년, 시간은 말년을 보여 줘요.',
        ...stages.map(([k, g]) => `${M.STAGE[k].label} (${M.STAGE[k].age}): ${M.STAGE[k].text[g]}`),
        ...(s.hasTime ? [] : ['태어난 시간을 모르면 말년운은 보지 않아요. 시간을 넣으면 더 자세한 풀이가 나와요.']),
      ],
    },
    { key: 'love', title: '연애운', paras: [DOM.love, R.LOVE_NATAL[dominant], M.GOOD_MATCH[me]] },
    { key: 'marriage', title: '결혼운', paras: [R.SPOUSE_STAR[tier3(spouseCount)], R.MARRIAGE_PALACE[palaceGroup]] },
    { key: 'money', title: '재물운', paras: [DOM.money, R.WEALTH_NATAL[tier3(G.wealth)], M.MONEY_TIP[dominant]] },
    { key: 'work', title: '직업·직장운', paras: [DOM.work, R.CAREER[dominant], M.JOBS[me]] },
    { key: 'business', title: '사업운', paras: [R.BUSINESS[bizTier], ...(G.self >= 3 ? [R.BUSINESS_PARTNER] : [])] },
    {
      key: 'health',
      title: '건강운',
      paras: [R.HEALTH_WEAK[s.weakest], ...(s.counts[strongEl] >= 4 ? [R.HEALTH_STRONG[strongEl]] : []), M.HEALTH_HABIT[s.weakest], '건강 풀이는 재미로 보는 생활 팁이에요. 몸이 불편하면 꼭 병원에서 진료를 받으세요.'],
    },
    { key: 'study', title: '학업운', paras: [R.STUDY_NATAL[tier3(G.resource, 1, 2)]] },
    { key: 'people', title: '대인관계운', paras: [R.PEOPLE_NATAL[tier3(G.self)], M.PEOPLE_TIP[dominant]] },
  ];
  const daeun = s.daeun.map((d) => {
    const g = TEN_GOD_GROUP[d.god];
    const good = favor(s, g) > 0;
    return { ...d, group: g, line: `${R.DAEUN_LINE[g]} ${good ? M.DAEUN_DETAIL[g].good : M.DAEUN_DETAIL[g].bad}`, good };
  });
  return { dm, dominant, lacking, sections, daeun, lucky: luckyItems(luckyElements(s)[0], s.dayStem + s.dayBranch) };
}

function josaE(word: string) {
  const c = word.charCodeAt(word.length - 1) - 0xac00;
  return c >= 0 && c <= 11171 && c % 28 !== 0 ? '을' : '를';
}

// 일간 오행별 기본 풀이 (재물, 연애, 일)
const DOMAINS_TEXT = DOMAINS;

// ---------- 사주 궁합 ----------
const CTRL: Record<Element, Element> = { wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood' };
const REL_PT: Record<Rel, number> = { 육합: 14, 삼합: 10, 같음: 6, 평: 3, 형: -4, 원진: -6, 충: -10 };
const ZREL_PT: Record<Rel, number> = { 육합: 8, 삼합: 7, 같음: 4, 평: 2, 형: -3, 원진: -5, 충: -6 };

export function gunghapReading(a: Saju, b: Saju, rawA: string, rawB: string) {
  // 이름 뒤에 '님'을 붙여 조사(이/은/을)를 일정하게 씁니다
  const nameA = `${rawA}님`;
  const nameB = `${rawB}님`;
  const ea = STEMS[a.dayStem].el;
  const eb = STEMS[b.dayStem].el;
  const elName = (e: Element) => `${ELEMENTS[e].name}(${ELEMENTS[e].hanja})`;
  let elText: string;
  let elPt: number;
  const fill = (t: string, A: string, B: string, x: Element, y: Element) =>
    t.replaceAll('{A}', A).replaceAll('{B}', B).replaceAll('{elA}', elName(x)).replaceAll('{elB}', elName(y)).replaceAll('{el}', elName(x));
  if (ea === eb) {
    elText = fill(R.GH_ELEMENT.same, nameA, nameB, ea, eb);
    elPt = 10;
  } else if (GEN[ea] === eb) {
    elText = fill(R.GH_ELEMENT.gen, nameA, nameB, ea, eb);
    elPt = 14;
  } else if (GEN[eb] === ea) {
    elText = fill(R.GH_ELEMENT.gen, nameB, nameA, eb, ea);
    elPt = 14;
  } else if (CTRL[ea] === eb) {
    elText = fill(R.GH_ELEMENT.ctrl, nameA, nameB, ea, eb);
    elPt = 4;
  } else {
    elText = fill(R.GH_ELEMENT.ctrl, nameB, nameA, eb, ea);
    elPt = 4;
  }
  const palaceRel = mainRel(branchRels(a.dayBranch, b.dayBranch));
  const zRel = mainRel(branchRels(a.yearBranch, b.yearBranch));
  const za = BRANCHES[a.yearBranch].animal;
  const zb = BRANCHES[b.yearBranch].animal;
  const comp = (a.weakest === b.strongest ? 1 : 0) + (b.weakest === a.strongest ? 1 : 0);
  const compPt = comp * 5;
  const raw = 58 + elPt + REL_PT[palaceRel] + ZREL_PT[zRel] + compPt + ((hashString([a.dayStem + a.dayBranch, b.dayStem + b.dayBranch].sort().join('')) % 7) - 3);
  const score = Math.max(55, Math.min(98, Math.round(raw)));
  const tier = R.GH_TIER(score);
  const pct = (v: number, lo: number, hi: number) => Math.round(40 + ((v - lo) / (hi - lo)) * 60);
  const compText =
    comp === 2
      ? `${nameA}에게 부족한 ${ELEMENTS[a.weakest].name} 기운을 ${nameB}이 넉넉히 가졌고, ${nameB}에게 부족한 ${ELEMENTS[b.weakest].name} 기운은 ${nameA}이 채워 줘요. 서로의 빈칸을 메워 주는 보기 드문 조합이에요.`
      : comp === 1
        ? a.weakest === b.strongest
          ? `${nameA}에게 부족한 ${ELEMENTS[a.weakest].name} 기운을 ${nameB}이 넉넉히 갖고 있어요. 함께 있으면 ${nameA}의 마음이 한결 든든해져요.`
          : `${nameB}에게 부족한 ${ELEMENTS[b.weakest].name} 기운을 ${nameA}이 넉넉히 갖고 있어요. 함께 있으면 ${nameB}의 마음이 한결 든든해져요.`
        : a.weakest === b.weakest
          ? `두 사람 모두 ${ELEMENTS[a.weakest].name} 기운이 약한 편이에요. 함께 ${ELEMENTS[a.weakest].fill[0]}처럼 부족한 기운을 채우는 습관을 만들면 좋아요.`
          : '두 사람의 오행은 서로 크게 겹치지도 비지도 않아서, 각자의 색을 지키며 어울리는 사이예요.';
  return {
    score,
    tier,
    bars: [
      { label: '성격 궁합', value: pct(elPt, 4, 14) },
      { label: '결혼 궁합', value: pct(REL_PT[palaceRel], -10, 14) },
      { label: '띠 궁합', value: pct(ZREL_PT[zRel], -6, 8) },
      { label: '보완 궁합', value: pct(comp, 0, 2) },
    ],
    sections: [
      {
        title: '두 사람의 기질',
        text: `${nameA}은 ${DAY_MASTER[a.dayStem].image}처럼 ${DAY_MASTER[a.dayStem].line}이에요. ${nameB}은 ${DAY_MASTER[b.dayStem].image}처럼 ${DAY_MASTER[b.dayStem].line}이에요.`,
      },
      { title: '성격 궁합', text: elText },
      { title: '연애 스타일', text: `${nameA}은 ${R.LOVE_STYLE[ea]}, ${nameB}은 ${R.LOVE_STYLE[eb]}이에요. ${ea === eb ? '연애 방식이 닮아서 서로의 마음을 금방 알아채요.' : '연애 방식이 달라서 처음엔 낯설어도, 서로의 방식을 배워 가는 재미가 있어요.'}` },
      {
        title: '서로에게 바라는 것',
        text: `${nameA}은 ${M.GH_WANT[ea]} ${nameB}은 ${M.GH_WANT[eb]} ${nameA}에게는 ${M.GH_SAY[ea]}, ${nameB}에게는 ${M.GH_SAY[eb]} 같은 한마디가 큰 힘이 돼요.`,
      },
      { title: '다툼 패턴과 화해법', text: M.GH_FIGHT[ea === eb ? 'same' : GEN[ea] === eb || GEN[eb] === ea ? 'gen' : 'ctrl'] },
      { title: '결혼 궁합', text: `${R.GH_PALACE[palaceRel]} ${M.GH_LIFE[palaceRel]}` },
      { title: '띠 궁합', text: R.GH_ZODIAC[zRel].replaceAll('{za}', za).replaceAll('{zb}', zb) },
      { title: '서로 채워 주는 기운', text: compText },
      { title: '함께하면 좋은 데이트', text: M.GH_DATE[a.weakest === b.weakest ? a.weakest : GEN[ea] === eb ? eb : GEN[eb] === ea ? ea : a.weakest] },
      { title: '연구원의 조언', text: tier.advice },
    ],
    palaceRel,
    zRel,
    za,
    zb,
  };
}
export type GunghapReading = ReturnType<typeof gunghapReading>;

// ---------- 띠별 신년운세 ----------
export function zodiacYearReading(branch: string, year: number) {
  const gz = yearPillar(year);
  const rel = mainRel(branchRels(branch, gz[1]));
  const sj = samjae(branch, gz[1]);
  const z = R.ZODIAC_REL[rel];
  const bEl = BRANCHES[branch].el;
  const score = z.score - (sj ? 4 : 0);
  return {
    year,
    gz,
    rel,
    samjae: sj,
    score,
    grade: R.YEAR_GRADE(score),
    trait: R.ZODIAC_TRAIT[branch],
    ...z,
    lucky: luckyItems(GEN_BY[bEl], branch + year),
  };
}

// ---------- 오늘의 띠별 운세 랭킹 ----------
export function zodiacDayRanking(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  const gz = dayPillar(y, m, d);
  const sEl = STEMS[gz[0]].el;
  const list = R.ZODIAC_BRANCHES.map((b) => {
    const rel = mainRel(branchRels(b, gz[1]));
    const bEl = BRANCHES[b].el;
    const elPt = GEN[sEl] === bEl ? 6 : GEN[bEl] === sEl ? 2 : CTRL[sEl] === bEl ? -5 : CTRL[bEl] === sEl ? 1 : 3;
    const score = Math.max(48, Math.min(99, Math.round(72 + REL_PT[rel] * 0.9 + elPt + ((hashString(ymd + b) % 9) - 4))));
    return {
      branch: b,
      animal: BRANCHES[b].animal,
      slug: R.ZODIAC_SLUG[b],
      rel,
      score,
      line: pick(M.RANK_LINE[rel], ymd + b),
      color: pick(M.RANK_COLORS, ymd + b + 'c'),
      number: (hashString(ymd + b + 'n') % 9) + 1,
    };
  });
  list.sort((a, b) => b.score - a.score || hashString(ymd + a.branch) - hashString(ymd + b.branch));
  return { gz, list: list.map((x, i) => ({ ...x, rank: i + 1 })) };
}
