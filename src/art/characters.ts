// 사주 연구원 캐릭터 그림 (직접 그린 SVG). 화면, 저장 이미지, 카톡 미리보기에서 함께 씁니다.
// 모든 그림은 120×120 좌표계이고, id를 쓰지 않아서 한 페이지에 여러 번 넣어도 안전합니다.

export type Mood = 'normal' | 'happy';

const INK = '#3b2f3f';
const SW = 2.4;
const S = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
const CHEEK = '#ff8fa3';

function eyes(y: number, dx = 13, mood: Mood = 'normal', cx = 60) {
  if (mood === 'happy') {
    return [cx - dx, cx + dx]
      .map((x) => `<path d="M${x - 4.6} ${y + 1.5} q4.6 -6.5 9.2 0" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/>`)
      .join('');
  }
  return [cx - dx, cx + dx]
    .map((x) => `<ellipse cx="${x}" cy="${y}" rx="3.9" ry="4.7" fill="${INK}"/><circle cx="${x + 1.4}" cy="${y - 1.8}" r="1.5" fill="#fff"/>`)
    .join('');
}
function cheeks(y: number, dx = 22, cx = 60, r = 5.5) {
  return `<ellipse cx="${cx - dx}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="${CHEEK}" opacity=".6"/><ellipse cx="${cx + dx}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="${CHEEK}" opacity=".6"/>`;
}
function mouth(kind: 'w' | 'smile' | 'open' | 'small', y: number, cx = 60) {
  const st = `fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;
  if (kind === 'w') return `<path d="M${cx - 6} ${y} q3 3.6 6 0 q3 3.6 6 0" ${st}/>`;
  if (kind === 'smile') return `<path d="M${cx - 5} ${y} q5 5 10 0" ${st}/>`;
  if (kind === 'small') return `<path d="M${cx - 3} ${y} q3 2.6 6 0" ${st}/>`;
  return `<path d="M${cx - 5.5} ${y} q5.5 8 11 0 z" fill="#e8566b" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
}
const happyMouth = (m: Mood, normal: 'w' | 'smile' | 'small', y: number, cx = 60) => mouth(m === 'happy' ? 'open' : normal, y, cx);

type Draw = (m: Mood) => string;

export const CHARACTERS: Record<string, { name: string; draw: Draw }> = {
  rat: {
    name: '쥐',
    draw: (m) => `
      <circle cx="30" cy="38" r="17" fill="#cfc9dc" ${S}/><circle cx="30" cy="38" r="9.5" fill="#f6b9c8"/>
      <circle cx="90" cy="38" r="17" fill="#cfc9dc" ${S}/><circle cx="90" cy="38" r="9.5" fill="#f6b9c8"/>
      <circle cx="60" cy="68" r="36" fill="#ddd8e7" ${S}/>
      ${eyes(64, 14, m)}${cheeks(76, 23)}
      <path d="M56 75 h8 l-4 5 z" fill="#f08aa2" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>
      ${happyMouth(m, 'w', 82)}
      <path d="M38 78 l-16 -4 M38 82 l-16 2 M82 78 l16 -4 M82 82 l16 2" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
  },
  ox: {
    name: '소',
    draw: (m) => `
      <path d="M36 40 q-12 -4 -14 -22 q10 6 20 14 z" fill="#f4d58c" ${S}/>
      <path d="M84 40 q12 -4 14 -22 q-10 6 -20 14 z" fill="#f4d58c" ${S}/>
      <ellipse cx="22" cy="58" rx="13" ry="7" transform="rotate(-18 22 58)" fill="#f7efe2" ${S}/>
      <ellipse cx="98" cy="58" rx="13" ry="7" transform="rotate(18 98 58)" fill="#f7efe2" ${S}/>
      <ellipse cx="60" cy="66" rx="37" ry="35" fill="#f7efe2" ${S}/>
      <path d="M33 50 q4 -16 24 -18 q-2 12 -12 20 q-8 6 -12 -2 z" fill="#8a6447"/>
      <path d="M78 36 q10 2 12 12 q-8 2 -12 -4 z" fill="#8a6447"/>
      ${eyes(60, 14, m)}
      <ellipse cx="60" cy="84" rx="23" ry="14" fill="#f6c3b6" ${S}/>
      <ellipse cx="51" cy="83" rx="3.2" ry="4" fill="#9a5b54"/><ellipse cx="69" cy="83" rx="3.2" ry="4" fill="#9a5b54"/>
      ${m === 'happy' ? mouth('smile', 92) : ''}
      ${cheeks(70, 27, 60, 4.5)}`,
  },
  tiger: {
    name: '호랑이',
    draw: (m) => `
      <circle cx="31" cy="36" r="12" fill="#f7a24b" ${S}/><circle cx="31" cy="36" r="6" fill="#fde3c6"/>
      <circle cx="89" cy="36" r="12" fill="#f7a24b" ${S}/><circle cx="89" cy="36" r="6" fill="#fde3c6"/>
      <circle cx="60" cy="66" r="38" fill="#f7a24b" ${S}/>
      <ellipse cx="60" cy="81" rx="20" ry="13" fill="#fff6ea"/>
      <path d="M60 29 v10 M50 31 q3 6 0 11 M70 31 q-3 6 0 11 M23 62 h9 M24 71 h8 M97 62 h-9 M96 71 h-8" stroke="${INK}" stroke-width="3" stroke-linecap="round" fill="none"/>
      ${eyes(61, 14, m)}${cheeks(73, 24)}
      <path d="M55 73 h10 l-5 5 z" fill="#5a3a3a" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      ${happyMouth(m, 'w', 81)}`,
  },
  rabbit: {
    name: '토끼',
    draw: (m) => `
      <ellipse cx="44" cy="28" rx="10" ry="25" transform="rotate(-9 44 28)" fill="#fbf8f4" ${S}/>
      <ellipse cx="44" cy="29" rx="4.6" ry="17" transform="rotate(-9 44 29)" fill="#f7b6c6"/>
      <ellipse cx="76" cy="28" rx="10" ry="25" transform="rotate(9 76 28)" fill="#fbf8f4" ${S}/>
      <ellipse cx="76" cy="29" rx="4.6" ry="17" transform="rotate(9 76 29)" fill="#f7b6c6"/>
      <circle cx="60" cy="72" r="34" fill="#fbf8f4" ${S}/>
      ${eyes(70, 13, m)}${cheeks(80, 21)}
      <ellipse cx="60" cy="79" rx="3.6" ry="2.6" fill="#f08aa2"/>
      ${happyMouth(m, 'w', 84)}`,
  },
  dragon: {
    name: '용',
    draw: (m) => `
      <path d="M40 38 q-4 -14 -14 -20 q12 0 18 8 q0 -10 6 -14 q2 12 -2 24 z" fill="#ffd25e" ${S}/>
      <path d="M80 38 q4 -14 14 -20 q-12 0 -18 8 q0 -10 -6 -14 q-2 12 2 24 z" fill="#ffd25e" ${S}/>
      <path d="M26 56 l-14 -8 l6 16 z" fill="#6fc29e" ${S}/><path d="M94 56 l14 -8 l-6 16 z" fill="#6fc29e" ${S}/>
      <circle cx="60" cy="66" r="36" fill="#8fd6b4" ${S}/>
      <path d="M50 38 q5 -4 10 0 q5 -4 10 0" fill="none" stroke="#5fae8b" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="60" cy="82" rx="22" ry="13" fill="#c9f0dc" ${S}/>
      <circle cx="53" cy="80" r="2" fill="${INK}"/><circle cx="67" cy="80" r="2" fill="${INK}"/>
      <path d="M38 84 q-14 -2 -18 10 M82 84 q14 -2 18 10" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
      ${eyes(60, 14, m)}${cheeks(70, 26, 60, 4.5)}
      ${m === 'happy' ? mouth('smile', 87) : mouth('small', 87)}`,
  },
  snake: {
    name: '뱀',
    draw: (m) => `
      <ellipse cx="60" cy="100" rx="34" ry="13" fill="#9fcf63" ${S}/>
      <path d="M40 98 q10 -6 20 0 q10 6 20 0" fill="none" stroke="#7fb348" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="60" cy="60" rx="36" ry="31" fill="#b9e07f" ${S}/>
      <circle cx="44" cy="40" r="4" fill="#94c45a"/><circle cx="60" cy="35" r="4.5" fill="#94c45a"/><circle cx="76" cy="40" r="4" fill="#94c45a"/>
      ${eyes(58, 15, m)}${cheeks(70, 25)}
      ${happyMouth(m, 'smile', 72)}
      <path d="M60 ${m === 'happy' ? 80 : 77} v8 l-4 5 M60 ${m === 'happy' ? 88 : 85} l4 5" fill="none" stroke="#e8566b" stroke-width="2.4" stroke-linecap="round"/>`,
  },
  horse: {
    name: '말',
    draw: (m) => `
      <path d="M36 42 l2 -24 l14 16 z" fill="#c98d5d" ${S}/><path d="M84 42 l-2 -24 l-14 16 z" fill="#c98d5d" ${S}/>
      <ellipse cx="60" cy="66" rx="33" ry="38" fill="#c98d5d" ${S}/>
      <path d="M42 34 q4 -10 14 -8 q2 -8 12 -6 q8 0 10 8 q8 2 4 12 q-6 -6 -12 -4 q-6 -6 -14 -2 q-8 -4 -14 0 z" fill="#7a4a2e" ${S}/>
      ${eyes(60, 14, m)}
      <ellipse cx="60" cy="88" rx="22" ry="15" fill="#efc39d" ${S}/>
      <ellipse cx="52" cy="85" rx="2.8" ry="3.6" fill="#7a4a2e"/><ellipse cx="68" cy="85" rx="2.8" ry="3.6" fill="#7a4a2e"/>
      ${happyMouth(m, 'smile', 93)}${cheeks(72, 26, 60, 4.5)}`,
  },
  sheep: {
    name: '양',
    draw: (m) => {
      const puffs = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return `<circle cx="${(60 + Math.cos(a) * 36).toFixed(1)}" cy="${(62 + Math.sin(a) * 34).toFixed(1)}" r="13" fill="#fff" ${S}/>`;
      }).join('');
      return `
      ${puffs}<ellipse cx="60" cy="62" rx="38" ry="36" fill="#fff"/>
      <path d="M26 58 q-14 -6 -12 8 q4 10 14 4" fill="#e9cf96" ${S}/><path d="M94 58 q14 -6 12 8 q-4 10 -14 4" fill="#e9cf96" ${S}/>
      <ellipse cx="60" cy="72" rx="25" ry="27" fill="#f4dcc6" ${S}/>
      <circle cx="52" cy="47" r="7" fill="#fff" ${S}/><circle cx="60" cy="44" r="8" fill="#fff" ${S}/><circle cx="68" cy="47" r="7" fill="#fff" ${S}/>
      ${eyes(70, 11, m)}${cheeks(80, 17, 60, 4.5)}
      ${happyMouth(m, 'w', 86)}`;
    },
  },
  monkey: {
    name: '원숭이',
    draw: (m) => `
      <circle cx="22" cy="64" r="13" fill="#b77e55" ${S}/><circle cx="22" cy="64" r="7" fill="#f6d4b4"/>
      <circle cx="98" cy="64" r="13" fill="#b77e55" ${S}/><circle cx="98" cy="64" r="7" fill="#f6d4b4"/>
      <circle cx="60" cy="62" r="37" fill="#b77e55" ${S}/>
      <path d="M52 26 q8 -8 14 2" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M60 50 q-8 -10 -18 -6 q-12 6 -8 22 q-2 14 12 22 q14 8 28 0 q14 -8 12 -22 q4 -16 -8 -22 q-10 -4 -18 6 z" fill="#f6d4b4" ${S}/>
      ${eyes(62, 11, m)}${cheeks(74, 19, 60, 4.5)}
      <circle cx="57" cy="73" r="1.6" fill="${INK}"/><circle cx="63" cy="73" r="1.6" fill="${INK}"/>
      ${happyMouth(m, 'smile', 81)}`,
  },
  rooster: {
    name: '닭',
    draw: (m) => `
      <path d="M44 38 q-4 -16 8 -16 q2 -10 12 -6 q8 -6 12 6 q10 0 6 16 z" fill="#ec4d4d" ${S}/>
      <circle cx="60" cy="68" r="35" fill="#fffaf1" ${S}/>
      <path d="M30 80 q-10 6 -6 16 q8 -2 12 -10" fill="#fffaf1" ${S}/><path d="M90 80 q10 6 6 16 q-8 -2 -12 -10" fill="#fffaf1" ${S}/>
      ${eyes(62, 15, m)}${cheeks(72, 24)}
      <path d="M52 70 l8 -5 l8 5 l-8 6 z" fill="#ffb43c" ${S}/>
      ${m === 'happy' ? `<path d="M52 70 l8 9 l8 -9" fill="#ff9a2a" ${S}/>` : ''}
      <path d="M57 ${m === 'happy' ? 80 : 77} q3 10 6 0 z" fill="#ec4d4d" ${S}/>`,
  },
  dog: {
    name: '개',
    draw: (m) => `
      <circle cx="60" cy="64" r="35" fill="#f2c27d" ${S}/>
      <ellipse cx="27" cy="64" rx="12" ry="23" transform="rotate(14 27 64)" fill="#d99e58" ${S}/>
      <ellipse cx="93" cy="64" rx="12" ry="23" transform="rotate(-14 93 64)" fill="#d99e58" ${S}/>
      <ellipse cx="60" cy="80" rx="18" ry="13" fill="#fbe5c2"/>
      ${eyes(60, 13, m)}${cheeks(74, 22)}
      <ellipse cx="60" cy="74" rx="5.5" ry="4" fill="${INK}"/>
      ${m === 'happy' ? `<path d="M54 81 q6 6 12 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="M57 83 q3 8 6 0 z" fill="#f07c94" stroke="${INK}" stroke-width="1.8"/>` : mouth('w', 81)}`,
  },
  pig: {
    name: '돼지',
    draw: (m) => `
      <path d="M30 44 l2 -20 l18 12 z" fill="#f39fb4" ${S}/><path d="M90 44 l-2 -20 l-18 12 z" fill="#f39fb4" ${S}/>
      <circle cx="60" cy="66" r="36" fill="#f9c1ce" ${S}/>
      ${eyes(58, 15, m)}${cheeks(72, 26)}
      <ellipse cx="60" cy="76" rx="14" ry="10" fill="#f39fb4" ${S}/>
      <ellipse cx="55" cy="76" rx="2.4" ry="3.6" fill="#b85a74"/><ellipse cx="65" cy="76" rx="2.4" ry="3.6" fill="#b85a74"/>
      ${happyMouth(m, 'small', 91)}`,
  },
  fox: {
    name: '여우',
    draw: (m) => `
      <path d="M26 54 l2 -36 l26 18 z" fill="#f28a3c" ${S}/><path d="M28 30 l1 -12 l9 6 z" fill="${INK}"/><path d="M31 46 l1 -16 l11 8 z" fill="#fff1de"/>
      <path d="M94 54 l-2 -36 l-26 18 z" fill="#f28a3c" ${S}/><path d="M92 30 l-1 -12 l-9 6 z" fill="${INK}"/><path d="M89 46 l-1 -16 l-11 8 z" fill="#fff1de"/>
      <path d="M60 30 q34 0 36 34 l8 6 q-10 2 -12 6 q-10 22 -32 22 q-22 0 -32 -22 q-2 -4 -12 -6 l8 -6 q2 -34 36 -34 z" fill="#f28a3c" ${S}/>
      <path d="M28 74 q16 -6 32 8 q16 -14 32 -8 q-8 22 -32 24 q-24 -2 -32 -24 z" fill="#fff8ef"/>
      ${eyes(62, 15, m)}${cheeks(74, 24)}
      <ellipse cx="60" cy="81" rx="4.4" ry="3.2" fill="${INK}"/>
      ${happyMouth(m, 'smile', 87)}`,
  },
  cat: {
    name: '고양이',
    draw: (m) => `
      <path d="M28 52 l4 -32 l22 18 z" fill="#e9e5f0" ${S}/><path d="M33 44 l2 -16 l12 10 z" fill="#f7b6c6"/>
      <path d="M92 52 l-4 -32 l-22 18 z" fill="#e9e5f0" ${S}/><path d="M87 44 l-2 -16 l-12 10 z" fill="#f7b6c6"/>
      <circle cx="60" cy="68" r="35" fill="#e9e5f0" ${S}/>
      <path d="M60 34 v9 M51 36 q2 4 0 8 M69 36 q-2 4 0 8" stroke="#aaa3bb" stroke-width="3" stroke-linecap="round" fill="none"/>
      ${eyes(65, 14, m)}${cheeks(76, 23)}
      <path d="M56.5 74 h7 l-3.5 4 z" fill="#f08aa2" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>
      ${happyMouth(m, 'w', 81)}
      <path d="M36 76 l-16 -3 M36 81 l-16 3 M84 76 l16 -3 M84 81 l16 3" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`,
  },
  bear: {
    name: '곰',
    draw: (m) => `
      <circle cx="31" cy="35" r="13" fill="#a8714f" ${S}/><circle cx="31" cy="35" r="7" fill="#dca985"/>
      <circle cx="89" cy="35" r="13" fill="#a8714f" ${S}/><circle cx="89" cy="35" r="7" fill="#dca985"/>
      <circle cx="60" cy="66" r="37" fill="#a8714f" ${S}/>
      <ellipse cx="60" cy="80" rx="17" ry="13" fill="#e9c6a3" ${S}/>
      <ellipse cx="60" cy="75" rx="6" ry="4.2" fill="${INK}"/>
      ${eyes(60, 14, m)}${cheeks(72, 25)}
      ${happyMouth(m, 'w', 84)}`,
  },
  wolf: {
    name: '늑대',
    draw: (m) => `
      <path d="M28 52 l0 -36 l24 20 z" fill="#8f9bb4" ${S}/><path d="M32 44 l0 -18 l13 11 z" fill="#e1e6f0"/>
      <path d="M92 52 l0 -36 l-24 20 z" fill="#8f9bb4" ${S}/><path d="M88 44 l0 -18 l-13 11 z" fill="#e1e6f0"/>
      <path d="M60 30 q34 0 36 32 l8 4 l-8 4 l6 6 q-10 2 -12 2 q-10 20 -30 20 q-20 0 -30 -20 q-2 0 -12 -2 l6 -6 l-8 -4 l8 -4 q2 -32 36 -32 z" fill="#8f9bb4" ${S}/>
      <path d="M32 74 q14 -6 28 6 q14 -12 28 -6 q-6 20 -28 22 q-22 -2 -28 -22 z" fill="#f2f4f8"/>
      <path d="M41 53 l10 3 M79 53 l-10 3" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      ${eyes(61, 14, m)}${cheeks(72, 22)}
      <ellipse cx="60" cy="79" rx="4.6" ry="3.3" fill="${INK}"/>
      ${happyMouth(m, 'smile', 85)}`,
  },
  deer: {
    name: '사슴',
    draw: (m) => `
      <path d="M44 36 q-6 -14 -2 -26 M43 24 q-8 -2 -12 -8 M44 30 q6 -6 6 -12 M76 36 q6 -14 2 -26 M77 24 q8 -2 12 -8 M76 30 q-6 -6 -6 -12" fill="none" stroke="#a77447" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="24" cy="52" rx="14" ry="7" transform="rotate(-24 24 52)" fill="#d9a06b" ${S}/><ellipse cx="25" cy="52" rx="7" ry="3" transform="rotate(-24 25 52)" fill="#f7b6c6"/>
      <ellipse cx="96" cy="52" rx="14" ry="7" transform="rotate(24 96 52)" fill="#d9a06b" ${S}/><ellipse cx="95" cy="52" rx="7" ry="3" transform="rotate(24 95 52)" fill="#f7b6c6"/>
      <ellipse cx="60" cy="68" rx="33" ry="35" fill="#d9a06b" ${S}/>
      <circle cx="50" cy="44" r="3" fill="#fff4e3"/><circle cx="62" cy="40" r="3.4" fill="#fff4e3"/><circle cx="72" cy="46" r="2.6" fill="#fff4e3"/>
      <ellipse cx="60" cy="86" rx="15" ry="11" fill="#f4d6b3"/>
      ${eyes(64, 14, m)}${cheeks(76, 24)}
      <ellipse cx="60" cy="82" rx="4.6" ry="3.2" fill="${INK}"/>
      ${happyMouth(m, 'small', 89)}`,
  },
  turtle: {
    name: '거북이',
    draw: (m) => `
      <ellipse cx="26" cy="100" rx="9" ry="6" fill="#b9e08f" ${S}/><ellipse cx="94" cy="100" rx="9" ry="6" fill="#b9e08f" ${S}/>
      <path d="M14 98 q0 -40 46 -42 q46 2 46 42 z" fill="#7fbb63" ${S}/>
      <path d="M44 72 l16 -8 l16 8 l0 16 l-32 0 z M44 72 l-16 10 M76 72 l16 10 M60 64 v-8 M44 88 l-12 10 M76 88 l12 10" fill="none" stroke="#56913f" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M14 98 h92" stroke="${INK}" stroke-width="${SW}" stroke-linecap="round"/>
      <circle cx="60" cy="40" r="26" fill="#b9e08f" ${S}/>
      ${eyes(38, 10, m)}${cheeks(47, 17, 60, 4.2)}
      ${happyMouth(m, 'smile', 50)}`,
  },
  hawk: {
    name: '매',
    draw: (m) => `
      <path d="M48 34 q4 -14 12 -16 q8 2 12 16" fill="#7c5236" ${S}/>
      <circle cx="60" cy="64" r="36" fill="#9b6b4a" ${S}/>
      <path d="M26 70 q-10 6 -8 20 q10 -2 14 -12 M94 70 q10 6 8 20 q-10 -2 -14 -12" fill="#7c5236" ${S}/>
      <ellipse cx="60" cy="70" rx="25" ry="23" fill="#fff6ea"/>
      <path d="M38 54 l14 4 M82 54 l-14 4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      ${eyes(63, 12, m)}${cheeks(74, 21, 60, 4.2)}
      <path d="M53 70 q7 -5 14 0 q-1 10 -7 15 q-6 -5 -7 -15 z" fill="#ffbf3c" ${S}/>`,
  },
  whale: {
    name: '고래',
    draw: (m) => `
      <path d="M60 30 q-2 -10 -10 -14 M60 30 q2 -10 10 -14 M60 30 v-14" fill="none" stroke="#5ba7e8" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="49" cy="14" r="3" fill="#5ba7e8"/><circle cx="71" cy="14" r="3" fill="#5ba7e8"/>
      <path d="M18 74 q-8 -18 0 -24 q6 4 6 14 M102 74 q8 -18 0 -24 q-6 4 -6 14" fill="#5f9fdb" ${S}/>
      <ellipse cx="60" cy="70" rx="44" ry="36" fill="#7fb6ea" ${S}/>
      <path d="M26 86 q34 24 68 0 q-6 16 -34 18 q-28 -2 -34 -18 z" fill="#e2f1ff"/>
      ${eyes(64, 16, m)}${cheeks(75, 27)}
      ${happyMouth(m, 'smile', 79)}`,
  },
  owl: {
    name: '부엉이 연구원',
    draw: (m) => `
      <path d="M30 42 l-4 -26 l18 14 z" fill="#3d4a7a" ${S}/><path d="M90 42 l4 -26 l-18 14 z" fill="#3d4a7a" ${S}/>
      <ellipse cx="60" cy="68" rx="40" ry="42" fill="#3d4a7a" ${S}/>
      <path d="M22 70 q-8 16 2 30 q8 -6 8 -20 M98 70 q8 16 -2 30 q-8 -6 -8 -20" fill="#2f3a66" ${S}/>
      <ellipse cx="60" cy="96" rx="22" ry="12" fill="#f6e7c8"/>
      <path d="M50 92 q3 3 6 0 M58 96 q3 3 6 0 M66 92 q3 3 6 0" fill="none" stroke="#c9a96c" stroke-width="2" stroke-linecap="round"/>
      <circle cx="45" cy="58" r="16" fill="#f6e7c8"/><circle cx="75" cy="58" r="16" fill="#f6e7c8"/>
      ${eyes(58, 15, m)}
      <circle cx="45" cy="58" r="12" fill="none" stroke="#f1cc45" stroke-width="3"/><circle cx="75" cy="58" r="12" fill="none" stroke="#f1cc45" stroke-width="3"/>
      <path d="M57 58 q3 -3 6 0" fill="none" stroke="#f1cc45" stroke-width="3" stroke-linecap="round"/>
      <path d="M55 70 l5 7 l5 -7 z" fill="#ffb43c" ${S}/>
      <rect x="52" y="81" width="16" height="16" rx="3" fill="#c9301e" stroke="#fff" stroke-width="1.6" transform="rotate(-6 60 89)"/>
      <path d="M56 86 v6 M60 85 v8 M64 86 v6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" transform="rotate(-6 60 89)"/>`,
  },

  // ----- 일간(태어난 날의 기운) 자연물 -----
  tree: {
    name: '큰 나무',
    draw: (m) => `
      <path d="M52 112 l2 -40 h12 l2 40 z" fill="#a8714f" ${S}/>
      <path d="M60 14 q22 0 26 18 q16 4 14 22 q-2 20 -24 22 h-32 q-22 -2 -24 -22 q-2 -18 14 -22 q4 -18 26 -18 z" fill="#6cbb72" ${S}/>
      <circle cx="40" cy="40" r="4" fill="#8fd08f"/><circle cx="82" cy="46" r="3.4" fill="#8fd08f"/><circle cx="66" cy="26" r="3" fill="#8fd08f"/>
      ${eyes(54, 12, m)}${cheeks(63, 20, 60, 4.5)}${happyMouth(m, 'smile', 63)}`,
  },
  flower: {
    name: '꽃',
    draw: (m) => {
      const petals = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        return `<circle cx="${(60 + Math.cos(a) * 24).toFixed(1)}" cy="${(46 + Math.sin(a) * 24).toFixed(1)}" r="14" fill="#f7a8c4" ${S}/>`;
      }).join('');
      return `
      <path d="M60 70 q-4 22 2 46" fill="none" stroke="#5fae5f" stroke-width="4" stroke-linecap="round"/>
      <path d="M61 92 q14 -14 26 -8 q-8 14 -26 8 z M60 102 q-14 -12 -24 -4 q8 12 24 4 z" fill="#7cc77c" ${S}/>
      ${petals}<circle cx="60" cy="46" r="20" fill="#ffd662" ${S}/>
      ${eyes(44, 8, m)}${cheeks(52, 13, 60, 3.6)}${happyMouth(m, 'small', 53)}`;
    },
  },
  sun: {
    name: '태양',
    draw: (m) => {
      const rays = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const p = (r: number, da = 0) => `${(60 + Math.cos(a + da) * r).toFixed(1)} ${(60 + Math.sin(a + da) * r).toFixed(1)}`;
        return `<path d="M${p(38, -0.13)} L${p(54)} L${p(38, 0.13)} z" fill="#ffcf4a" ${S}/>`;
      }).join('');
      return `${rays}<circle cx="60" cy="60" r="34" fill="#ffad3b" ${S}/>${eyes(56, 12, m)}${cheeks(66, 20)}${happyMouth(m, 'smile', 68)}`;
    },
  },
  candle: {
    name: '촛불',
    draw: (m) => `
      <path d="M60 8 q16 18 12 30 q-4 10 -12 10 q-8 0 -12 -10 q-4 -12 12 -30 z" fill="#ffb43c" ${S}/>
      <path d="M60 22 q8 10 6 18 q-2 5 -6 5 q-4 0 -6 -5 q-2 -8 6 -18 z" fill="#ffe27a"/>
      <path d="M60 48 v6" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="34" y="54" width="52" height="58" rx="10" fill="#fff4de" ${S}/>
      <path d="M40 54 v12 q0 5 4 5 q4 0 4 -5 v-12" fill="#ffe7bd" ${S}/>
      ${eyes(80, 11, m)}${cheeks(89, 18, 60, 4.2)}${happyMouth(m, 'smile', 92)}`,
  },
  mountain: {
    name: '큰 산',
    draw: (m) => `
      <path d="M8 110 q20 -70 40 -86 q12 -10 24 0 q20 16 40 86 z" fill="#8cb7a4" ${S}/>
      <path d="M40 38 q8 -12 20 -14 q12 2 20 14 q-6 6 -10 0 q-6 8 -10 0 q-6 8 -10 0 q-4 6 -10 0 z" fill="#fff" ${S}/>
      <path d="M22 110 q8 -20 18 -26 M98 110 q-8 -20 -18 -26" fill="none" stroke="#6e9c88" stroke-width="2.4" stroke-linecap="round"/>
      ${eyes(68, 13, m)}${cheeks(78, 22)}${happyMouth(m, 'w', 80)}`,
  },
  field: {
    name: '논밭',
    draw: (m) => `
      <path d="M44 46 q-2 -14 -12 -18 q12 -2 14 12 M44 46 q2 -16 14 -18 q-2 12 -14 18" fill="#7cc77c" ${S}/>
      <path d="M76 46 q-2 -14 -12 -18 q12 -2 14 12 M76 46 q2 -16 14 -18 q-2 12 -14 18" fill="#7cc77c" ${S}/>
      <path d="M44 46 v8 M76 46 v8" stroke="#5fae5f" stroke-width="3" stroke-linecap="round"/>
      <path d="M10 106 q4 -52 50 -52 q46 0 50 52 z" fill="#d1a26a" ${S}/>
      <path d="M24 100 q10 -26 36 -28 M96 100 q-10 -26 -36 -28 M42 104 q6 -14 18 -14 q12 0 18 14" fill="none" stroke="#b5864f" stroke-width="2.4" stroke-linecap="round"/>
      ${eyes(80, 12, m)}${cheeks(89, 21)}${happyMouth(m, 'smile', 91)}`,
  },
  rock: {
    name: '바위',
    draw: (m) => `
      <path d="M16 104 l6 -46 l22 -28 l34 -6 l24 26 l4 54 z" fill="#a9adbb" ${S}/>
      <path d="M44 30 l6 18 l28 -24 M50 48 l-28 10 M78 24 l4 24 l24 8" fill="none" stroke="#8b8fa0" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M41 60 l10 3 M79 60 l-10 3" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
      ${eyes(70, 13, m)}${cheeks(80, 22)}${happyMouth(m, 'small', 84)}`,
  },
  gem: {
    name: '보석',
    draw: (m) => `
      <path d="M30 34 h60 l18 22 l-48 54 l-48 -54 z" fill="#bfe6f5" ${S}/>
      <path d="M12 56 h96 M30 34 l14 22 l16 -22 l16 22 l14 -22 M44 56 l16 54 l16 -54" fill="none" stroke="#86c4dc" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M98 18 v12 M92 24 h12 M20 14 v8 M16 18 h8" stroke="#f1cc45" stroke-width="2.6" stroke-linecap="round"/>
      ${eyes(68, 12, m)}${cheeks(77, 20, 60, 4.2)}${happyMouth(m, 'small', 80)}`,
  },
  sea: {
    name: '바다',
    draw: (m) => `
      <path d="M8 108 q0 -44 30 -64 q24 -16 46 -4 q18 10 12 28 q-6 14 -22 8 q-10 -4 -6 -14 q-12 4 -10 18 q4 18 30 18 q18 0 22 10 z" fill="#5aa5e0" ${S}/>
      <path d="M66 36 q8 -6 18 -2 M90 50 q4 4 2 10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="104" cy="30" r="4" fill="#bfe1fb" ${S}/><circle cx="96" cy="18" r="2.8" fill="#bfe1fb" ${S}/>
      ${eyes(80, 12, m, 44)}${cheeks(89, 20, 44, 4.2)}${happyMouth(m, 'smile', 91, 44)}`,
  },
  rain: {
    name: '이슬비',
    draw: (m) => `
      <path d="M30 70 q-18 0 -18 -16 q0 -16 18 -16 q4 -20 26 -20 q20 0 26 16 q20 -2 24 16 q2 20 -20 20 z" fill="#f2f5fb" ${S}/>
      ${eyes(48, 12, m)}${cheeks(57, 20, 60, 4.5)}${happyMouth(m, 'small', 59)}
      <path d="M34 82 q-4 8 0 10 q4 -2 0 -10 z M60 86 q-4 8 0 10 q4 -2 0 -10 z M86 82 q-4 8 0 10 q4 -2 0 -10 z M47 100 q-4 8 0 10 q4 -2 0 -10 z M73 100 q-4 8 0 10 q4 -2 0 -10 z" fill="#6fb4ef" ${S}/>`,
  },
};

export type CharId = keyof typeof CHARACTERS;

export const ZODIAC_IDS = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep', 'monkey', 'rooster', 'dog', 'pig'] as const;

// 일간(甲~癸) → 자연물 캐릭터
export const DAY_MASTER_CHAR: Record<string, CharId> = {
  甲: 'tree',
  乙: 'flower',
  丙: 'sun',
  丁: 'candle',
  戊: 'mountain',
  己: 'field',
  庚: 'rock',
  辛: 'gem',
  壬: 'sea',
  癸: 'rain',
};

// 오행 → 대표 캐릭터
export const ELEMENT_CHAR: Record<string, CharId> = { wood: 'tree', fire: 'sun', earth: 'mountain', metal: 'gem', water: 'sea' };

// MBTI → 캐릭터
export const MBTI_CHAR: Record<string, CharId> = {
  INTJ: 'hawk',
  INTP: 'cat',
  ENTJ: 'tiger',
  ENTP: 'fox',
  INFJ: 'deer',
  INFP: 'rabbit',
  ENFJ: 'dog',
  ENFP: 'monkey',
  ISTJ: 'turtle',
  ISFJ: 'bear',
  ESTJ: 'ox',
  ESFJ: 'sheep',
  ISTP: 'wolf',
  ISFP: 'whale',
  ESTP: 'horse',
  ESFP: 'rooster',
};

export function charInner(id: string, mood: Mood = 'normal') {
  const c = CHARACTERS[id] ?? CHARACTERS.owl;
  return c.draw(mood);
}

export function charSvg(id: string, mood: Mood = 'normal', size?: number, cls = '') {
  const sz = size ? ` width="${size}" height="${size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"${sz}${cls ? ` class="${cls}"` : ''} aria-hidden="true">${charInner(id, mood)}</svg>`;
}

// ---------- 장식 ----------
export const deco = {
  heart: (x: number, y: number, s = 1, c = '#ff6f8f') =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0 4 C0 -2 -8 -4 -10 2 C-12 8 -4 12 0 16 C4 12 12 8 10 2 C8 -4 0 -2 0 4 Z" fill="${c}" stroke="${INK}" stroke-width="${2 / s}" stroke-linejoin="round"/>`,
  sparkle: (x: number, y: number, s = 1, c = '#ffd23f') =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 Q2 -2 10 0 Q2 2 0 10 Q-2 2 -10 0 Q-2 -2 0 -10 Z" fill="${c}"/>`,
  star: (x: number, y: number, s = 1, c = '#ffd23f') =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L3 -3 L10 -3 L4.5 1.5 L6.5 9 L0 4.5 L-6.5 9 L-4.5 1.5 L-10 -3 L-3 -3 Z" fill="${c}" stroke="${INK}" stroke-width="${1.8 / s}" stroke-linejoin="round"/>`,
  coin: (x: number, y: number, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><circle r="10" fill="#ffd23f" stroke="${INK}" stroke-width="${2 / s}"/><rect x="-3.2" y="-3.2" width="6.4" height="6.4" fill="none" stroke="#b8860b" stroke-width="${1.8 / s}"/></g>`,
  cloud: (x: number, y: number, s = 1, c = '#ffffff') =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M-14 6 q-8 0 -8 -7 q0 -7 8 -7 q2 -9 12 -9 q9 0 12 7 q9 -1 11 7 q1 9 -9 9 z" fill="${c}" stroke="${INK}" stroke-width="${1.8 / s}" stroke-linejoin="round"/>`,
  swirl: (x: number, y: number, s = 1, c = '#c9301e') =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M-12 4 q0 -12 12 -12 q10 0 10 9 q0 7 -7 7 q-6 0 -6 -5 q0 -4 4 -4" fill="none" stroke="${c}" stroke-width="${2.4 / s}" stroke-linecap="round"/>`,
  clover: (x: number, y: number, s = 1) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="#7cc77c" stroke="${INK}" stroke-width="${1.6 / s}"><circle cx="-5" cy="-5" r="5.5"/><circle cx="5" cy="-5" r="5.5"/><circle cx="-5" cy="5" r="5.5"/><circle cx="5" cy="5" r="5.5"/></g>`,
};

export type Theme = 'love' | 'money' | 'luck' | 'work' | 'study' | 'group' | 'night';

export const THEME_BG: Record<Theme, { bg: string; ring: string }> = {
  love: { bg: '#ffe3ea', ring: '#ffc6d3' },
  money: { bg: '#fff1c4', ring: '#ffe08a' },
  luck: { bg: '#fff1c4', ring: '#ffe08a' },
  work: { bg: '#dfeaff', ring: '#bcd2ff' },
  study: { bg: '#e6f6e4', ring: '#c4e8bf' },
  group: { bg: '#efe6ff', ring: '#d9c8ff' },
  night: { bg: '#e3e6f7', ring: '#c7cdee' },
};

function decoFor(theme: Theme) {
  const d = deco;
  switch (theme) {
    case 'love':
      return d.heart(40, 48, 1.3) + d.heart(196, 62, 1) + d.heart(206, 186, 0.8, '#ffa3b8') + d.sparkle(30, 168, 1.1) + d.sparkle(120, 22, 0.8, '#fff');
    case 'money':
      return d.coin(38, 60, 1.3) + d.coin(202, 70, 1) + d.coin(196, 190, 0.9) + d.sparkle(30, 180, 1.1) + d.sparkle(120, 24, 0.9, '#fff');
    case 'work':
      return d.star(40, 52, 1.2) + d.star(200, 60, 1) + d.sparkle(198, 188, 1) + d.cloud(42, 190, 0.9);
    case 'study':
      return d.clover(40, 56, 1.1) + d.sparkle(200, 60, 1.1) + d.clover(198, 186, 0.8) + d.sparkle(34, 186, 0.9, '#fff');
    case 'group':
      return d.star(36, 48, 1) + d.heart(204, 54, 0.9) + d.sparkle(30, 190, 1) + d.sparkle(210, 190, 1);
    case 'night':
      return d.sparkle(40, 50, 1.2, '#fff') + d.sparkle(200, 64, 0.9, '#ffd23f') + d.star(196, 190, 0.9) + d.cloud(44, 192, 0.9);
    default:
      return d.cloud(40, 54, 1.1) + d.sparkle(200, 58, 1.2) + d.swirl(196, 192, 1.2) + d.sparkle(34, 188, 1, '#fff');
  }
}

// 결과 그림 한 장 (240×240): 동그란 무대 + 장식 + 캐릭터 1~4마리
export function sceneSvg(opts: { chars: string[]; mood?: Mood; theme?: Theme; size?: number; plain?: boolean }) {
  const { chars, mood = 'happy', theme = 'luck', size, plain = false } = opts;
  const bg = THEME_BG[theme];
  const n = Math.min(chars.length, 4);
  const layouts: Record<number, { x: number; y: number; s: number }[]> = {
    1: [{ x: 120, y: 124, s: 1.45 }],
    2: [
      { x: 80, y: 128, s: 1.05 },
      { x: 160, y: 128, s: 1.05 },
    ],
    3: [
      { x: 120, y: 98, s: 0.85 },
      { x: 70, y: 152, s: 0.85 },
      { x: 170, y: 152, s: 0.85 },
    ],
    4: [
      { x: 80, y: 96, s: 0.78 },
      { x: 160, y: 96, s: 0.78 },
      { x: 80, y: 164, s: 0.78 },
      { x: 160, y: 164, s: 0.78 },
    ],
  };
  const body = chars
    .slice(0, 4)
    .map((id, i) => {
      const l = layouts[n][i];
      return `<g transform="translate(${l.x - 60 * l.s} ${l.y - 60 * l.s}) scale(${l.s})">${charInner(id, mood)}</g>`;
    })
    .join('');
  const middleHeart = n === 2 && theme === 'love' ? deco.heart(120, 34, 1.5) : '';
  const stage = plain
    ? ''
    : `<circle cx="120" cy="120" r="112" fill="${bg.bg}"/><circle cx="120" cy="120" r="96" fill="none" stroke="${bg.ring}" stroke-width="10" stroke-dasharray="2 14" stroke-linecap="round"/>`;
  const sz = size ? ` width="${size}" height="${size}"` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"${sz} aria-hidden="true">${stage}${plain ? '' : decoFor(theme)}${body}${middleHeart}</svg>`;
}
