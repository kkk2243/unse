// 60갑자 일주 도감: 일주 이름(색 + 동물), 특징, 궁합 일주를 계산합니다.
import { STEMS, BRANCHES, DAY_MASTER, ELEMENTS, DOMAINS } from '../data/saju';
import { TEN_GOD_GROUP, tenGodOfBranch } from './saju';
import * as R from '../data/reading';
import * as M from '../data/reading-more';
import { josa } from './hangul';
import { ZODIAC_SLUG } from '../data/reading';

export const STEM_ORDER = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const BRANCH_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ROMA: Record<string, string> = { 甲: 'gap', 乙: 'eul', 丙: 'byeong', 丁: 'jeong', 戊: 'mu', 己: 'gi', 庚: 'gyeong', 辛: 'sin', 壬: 'im', 癸: 'gye' };
const BRANCH_ROMA: Record<string, string> = { 子: 'ja', 丑: 'chuk', 寅: 'in', 卯: 'myo', 辰: 'jin', 巳: 'sa', 午: 'o', 未: 'mi', 申: 'sin', 酉: 'yu', 戌: 'sul', 亥: 'hae' };
export const STEM_COLOR: Record<string, string> = { 甲: '푸른', 乙: '푸른', 丙: '붉은', 丁: '붉은', 戊: '노란', 己: '노란', 庚: '흰', 辛: '흰', 壬: '검은', 癸: '검은' };
const STEM_HAP: Record<string, string> = { 甲: '己', 己: '甲', 乙: '庚', 庚: '乙', 丙: '辛', 辛: '丙', 丁: '壬', 壬: '丁', 戊: '癸', 癸: '戊' };
const BRANCH_HAP: Record<string, string> = { 子: '丑', 丑: '子', 寅: '亥', 亥: '寅', 卯: '戌', 戌: '卯', 辰: '酉', 酉: '辰', 巳: '申', 申: '巳', 午: '未', 未: '午' };
const BRANCH_CHUNG: Record<string, string> = { 子: '午', 午: '子', 丑: '未', 未: '丑', 寅: '申', 申: '寅', 卯: '酉', 酉: '卯', 辰: '戌', 戌: '辰', 巳: '亥', 亥: '巳' };
const CTRL_BY: Record<string, string> = { wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth' };

const GOEGANG = ['庚辰', '庚戌', '壬辰', '壬戌', '戊戌'];
const BAEKHO = ['甲辰', '乙未', '丙戌', '丁丑', '戊辰', '壬戌', '癸丑'];

export const ILJU_LIST = Array.from({ length: 60 }, (_, i) => STEM_ORDER[i % 10] + BRANCH_ORDER[i % 12]);

export const iljuSlug = (gz: string) => STEM_ROMA[gz[0]] + BRANCH_ROMA[gz[1]];
export const iljuBySlug = (slug: string) => ILJU_LIST.find((g) => iljuSlug(g) === slug);
export const iljuKo = (gz: string) => STEMS[gz[0]].ko + BRANCHES[gz[1]].ko;
export const iljuName = (gz: string) => `${STEM_COLOR[gz[0]]} ${BRANCHES[gz[1]].animal}`;

function partnerStemControl(stem: string) {
  // 나를 누르는(편관) 천간: 같은 음양, 나를 극하는 오행
  const el = STEMS[stem].el;
  return STEM_ORDER.find((s) => STEMS[s].el === CTRL_BY[el] && STEMS[s].yang === STEMS[stem].yang)!;
}

export function iljuInfo(gz: string) {
  const stem = gz[0];
  const branch = gz[1];
  const dm = DAY_MASTER[stem];
  const el = STEMS[stem].el;
  const br = BRANCHES[branch];
  const group = TEN_GOD_GROUP[tenGodOfBranch(stem, branch)];
  const flags = [
    ...(GOEGANG.includes(gz) ? [M.ILJU_FLAG.goegang] : []),
    ...(BAEKHO.includes(gz) ? [M.ILJU_FLAG.baekho] : []),
    ...(STEMS[stem].el === br.el ? [M.ILJU_FLAG.ganyeo] : []),
  ];
  const kind = '子午卯酉'.includes(branch) ? 'dohwa' : '寅申巳亥'.includes(branch) ? 'yeokma' : 'hwagae';
  const best = STEM_HAP[stem] + BRANCH_HAP[branch];
  const clash = partnerStemControl(stem) + BRANCH_CHUNG[branch];
  const name = iljuName(gz);
  const ko = iljuKo(gz);
  const picture = `${dm.image}${josa(dm.image, '이', '가')} ${br.animal}${josa(br.animal, '을', '를')} 품은 모습`;
  return {
    gz,
    slug: iljuSlug(gz),
    ko,
    name,
    stem,
    branch,
    el,
    elName: ELEMENTS[el].name,
    animalSlug: ZODIAC_SLUG[branch],
    picture,
    dm,
    group,
    flags,
    kind: M.BRANCH_KIND[kind],
    best: { gz: best, ko: iljuKo(best), name: iljuName(best), slug: iljuSlug(best) },
    clash: { gz: clash, ko: iljuKo(clash), name: iljuName(clash), slug: iljuSlug(clash) },
    keys: [...dm.keys.slice(0, 2), M.BRANCH_KIND[kind].name, ...flags.map((f) => f.name)].slice(0, 4),
    sections: [
      {
        key: 'me',
        title: `${ko}일주는 이런 사람`,
        paras: [
          `${ko}(${gz})일주는 ${picture}이에요. 위 글자 ${stem}(${STEMS[stem].ko})${josa(STEMS[stem].ko, '은', '는')} ${dm.image}처럼 ${dm.line}${josa(dm.line, '을', '를')} 뜻하고, 아래 글자 ${branch}(${br.ko})${josa(br.ko, '은', '는')} ${br.animal}의 기운을 담은 속마음 자리예요. 천간의 색과 띠 동물을 합쳐 "${name}" 일주라고도 불러요.`,
          ...dm.about,
        ],
      },
      { key: 'inner', title: '속마음과 생활 방식', paras: [M.BRANCH_SEAT[branch], M.SEAT_GROUP[group], M.BRANCH_KIND[kind].text] },
      ...(flags.length ? [{ key: 'flag', title: `${flags.map((f) => f.name).join(', ')}이 있는 일주`, paras: flags.map((f) => f.text) }] : []),
      {
        key: 'love',
        title: '연애와 결혼',
        paras: [
          DOMAINS[el].love,
          R.MARRIAGE_PALACE[group],
          M.GOOD_MATCH[el],
        ],
      },
      { key: 'work', title: '일과 직업', paras: [R.CAREER[group], M.JOBS[el]] },
      { key: 'money', title: '재물을 다루는 방식', paras: [M.MONEY_TIP[group]] },
      { key: 'people', title: '사람 관계', paras: [M.PEOPLE_TIP[group]] },
    ],
    plus: [...M.PLUS[group]],
    minus: [...M.MINUS[group]],
  };
}
export type IljuInfo = ReturnType<typeof iljuInfo>;
