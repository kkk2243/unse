// 이름 궁합: 한글 자모 획수로 계산하는 전통 방식 (어릴 때 공책에 쓰던 그 방법)
// 1) 두 이름을 한 글자씩 번갈아 적고  2) 글자마다 획수를 세서 일의 자리만 남긴 뒤
// 3) 이웃한 두 숫자를 더해 일의 자리만 남기는 걸 두 숫자가 남을 때까지 반복합니다.

const CHO = [2, 4, 2, 3, 6, 5, 4, 4, 8, 2, 4, 1, 3, 6, 4, 3, 4, 4, 3];
// ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
const JUNG = [2, 3, 3, 4, 2, 3, 3, 4, 2, 4, 5, 3, 3, 2, 4, 5, 3, 3, 1, 2, 1];
// ㅏ ㅐ ㅑ ㅒ ㅓ ㅔ ㅕ ㅖ ㅗ ㅘ ㅙ ㅚ ㅛ ㅜ ㅝ ㅞ ㅟ ㅠ ㅡ ㅢ ㅣ
const JONG = [0, 2, 4, 4, 2, 5, 5, 3, 5, 7, 9, 9, 7, 9, 9, 8, 4, 4, 6, 2, 4, 1, 3, 4, 3, 4, 4, 3];
// (없음) ㄱ ㄲ ㄳ ㄴ ㄵ ㄶ ㄷ ㄹ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅁ ㅂ ㅄ ㅅ ㅆ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ

export function isHangulName(s: string) {
  return /^[가-힣]{1,6}$/.test(s);
}

export function strokes(ch: string) {
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return 0;
  const cho = Math.floor(code / 588);
  const jung = Math.floor((code % 588) / 28);
  const jong = code % 28;
  return CHO[cho] + JUNG[jung] + JONG[jong];
}

export function interleave(a: string, b: string) {
  const A = [...a];
  const B = [...b];
  const out: string[] = [];
  const n = Math.max(A.length, B.length);
  for (let i = 0; i < n; i++) {
    if (A[i]) out.push(A[i]);
    if (B[i]) out.push(B[i]);
  }
  return out;
}

// 계산 과정 전체(피라미드)를 돌려줍니다. 마지막 줄의 두 숫자가 궁합 %입니다.
export function namePyramid(a: string, b: string) {
  const letters = interleave(a, b);
  const rows: number[][] = [letters.map((c) => strokes(c) % 10)];
  while (rows[rows.length - 1].length > 2) {
    const prev = rows[rows.length - 1];
    const next: number[] = [];
    for (let i = 0; i < prev.length - 1; i++) next.push((prev[i] + prev[i + 1]) % 10);
    rows.push(next);
  }
  const last = rows[rows.length - 1];
  let percent = last.length === 2 ? last[0] * 10 + last[1] : last[0] * 10;
  if (percent === 0) percent = 100; // 00은 100%로 보는 게 국룰
  return { letters, rows, percent };
}

export function nameTier(p: number) {
  if (p >= 90) return { name: '운명 확정', line: '이 숫자는 공책에 적어서 간직해야 해요' };
  if (p >= 75) return { name: '꽤 잘 맞음', line: '이름부터 서로를 끌어당기는 사이' };
  if (p >= 55) return { name: '무난한 사이', line: '숫자보다 함께한 시간이 더 중요한 사이' };
  if (p >= 35) return { name: '노력이 필요함', line: '이름이 좀 삐걱대도 마음은 다를 수 있어요' };
  return { name: '이름만 안 맞음', line: '반대로 계산해 보면 다를지도 몰라요' };
}

// 이름에 조사 붙이기: 받침 있는 이름은 '이'를 넣어 부르는 말투로 (서연 → 서연이가, 지수 → 지수가)
export function callName(name: string, particle: '가' | '를' | '는' | '와' | '의' | '') {
  const c = name.charCodeAt(name.length - 1) - 0xac00;
  const batchim = c >= 0 && c <= 11171 && c % 28 !== 0;
  return name + (batchim ? '이' : '') + particle;
}

// 받침 유무로 조사 고르기: josa('태양', '을', '를') → '을'
export function josa(word: string, withBatchim: string, without: string) {
  const c = word.charCodeAt(word.length - 1) - 0xac00;
  return c >= 0 && c <= 11171 && c % 28 !== 0 ? withBatchim : without;
}
