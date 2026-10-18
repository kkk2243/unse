// 계산 로직 점검: npm run test:calc
import assert from 'node:assert/strict';
import { namePyramid, strokes, callName, josa } from '../src/lib/hangul';
import { calcSaju, yearPillar, samjae } from '../src/lib/saju';
import { dayReading, yearReading, gunghapReading } from '../src/lib/reading';
import { mbtiScore } from '../src/data/mbti/compat';

let ok = 0;
const t = (name: string, fn: () => void) => {
  fn();
  ok++;
  console.log('통과', name);
};

t('한글 획수', () => {
  assert.equal(strokes('가'), 4); // ㄱ2 + ㅏ2
  assert.equal(strokes('철'), 11); // ㅊ4 + ㅓ2 + ㄹ5
  assert.equal(strokes('희'), 5); // ㅎ3 + ㅢ2
  assert.equal(strokes('닭'), 12); // ㄷ3 + ㅏ2 + ㄺ7
});

t('이름 궁합 피라미드', () => {
  // 철수-영희: 철(1) 영(5) 수(4) 희(5) → 6 9 9 → 5 8 → 58%
  const r = namePyramid('철수', '영희');
  assert.deepEqual(r.rows[0], [1, 5, 4, 5]);
  assert.equal(r.percent, 58);
  assert.equal(namePyramid('철수', '영희').percent, namePyramid('철수', '영희').percent);
});

t('조사', () => {
  assert.equal(callName('서연', '가'), '서연이가');
  assert.equal(callName('지수', '를'), '지수를');
  assert.equal(josa('태양', '을', '를'), '을');
  assert.equal(josa('바다', '을', '를'), '를');
});

t('사주 간지 (양력)', () => {
  const s = calcSaju({ y: 2000, m: 1, d: 1, cal: 'solar', leap: false, t: 6 });
  if (typeof s === 'string') throw new Error(s);
  // 2000-01-01 오시: 己卯년 丙子월 戊午일 戊午시
  assert.deepEqual(
    s.pillars.map((p) => p.stem + p.branch),
    ['戊午', '戊午', '丙子', '己卯'],
  );
  assert.equal(s.zodiac, '토끼'); // 입춘 전이라 기묘년
});

t('사주 간지 (음력)', () => {
  const s = calcSaju({ y: 1990, m: 4, d: 21, cal: 'lunar', leap: false, t: -1 });
  if (typeof s === 'string') throw new Error(s);
  assert.equal(s.solarText, '1990년 5월 15일');
  assert.deepEqual(s.pillars.map((p) => p.stem + p.branch), ['庚辰', '辛巳', '庚午']);
});

t('없는 윤달은 막기', () => {
  const s = calcSaju({ y: 2021, m: 3, d: 1, cal: 'lunar', leap: true, t: -1 });
  assert.equal(typeof s, 'string');
  const ok2 = calcSaju({ y: 2020, m: 4, d: 10, cal: 'lunar', leap: true, t: -1 });
  assert.notEqual(typeof ok2, 'string');
});

const me = calcSaju({ y: 1995, m: 3, d: 2, cal: 'solar', leap: false, t: 4, gender: 'F' }, 2026);
const you = calcSaju({ y: 1993, m: 11, d: 20, cal: 'solar', leap: false, t: -1, gender: 'M' }, 2026);
if (typeof me === 'string' || typeof you === 'string') throw new Error('사주 계산 실패');

t('신년 간지', () => {
  assert.equal(yearPillar(2027), '丁未');
  assert.equal(yearPillar(2028), '戊申');
});

t('삼재', () => {
  // 원숭이(申), 쥐(子), 용(辰)띠는 寅卯辰년이 삼재
  assert.ok(samjae('申', '寅'));
  assert.ok(!samjae('申', '申'));
});

t('오늘의 운세는 같은 날 같은 결과', () => {
  const a = dayReading(me, '2026-10-17', 'today', '지민');
  const b = dayReading(me, '2026-10-17', 'today', '지민');
  const c = dayReading(me, '2026-10-18', 'today', '지민');
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.ok(a.score >= 40 && a.score <= 100);
  assert.equal(a.cats.length, 8);
  assert.ok(a.total.join('').length > 150, '총운 풀이가 충분히 길어야 해요');
});

t('신년운세 12달', () => {
  for (const y of [2027, 2028]) {
    const r = yearReading(me, y, '지민');
    assert.equal(r.months.length, 12);
    assert.ok(r.score >= 40 && r.score <= 100);
  }
});

t('사주 궁합은 순서를 바꿔도 같은 점수', () => {
  assert.equal(gunghapReading(me, you, '지민', '현우').score, gunghapReading(you, me, '현우', '지민').score);
});

t('MBTI 궁합 대칭', () => {
  assert.equal(mbtiScore('ENFP', 'INTJ'), mbtiScore('INTJ', 'ENFP'));
  assert.equal(mbtiScore('ENFP', 'INFJ'), 95);
});

console.log(`\n모두 ${ok}개 통과`);
