import { MBTI, type MbtiCode } from './types';

// MBTI 궁합 점수 규칙 (이 사이트 자체 기준)
// - 정보를 받아들이는 방식(N/S)이 같으면 대화가 잘 통한다고 보고 가장 크게 반영
// - 에너지 방향(E/I)과 생활 리듬(J/P)은 서로 다를 때 보완이 된다고 봄
// - 판단 기준(T/F)은 같은 F끼리 가장 따뜻하고, 다를 때도 무난
const AXIS = {
  ns: { NN: 18, SS: 14, NS: 0, max: 18, label: '대화 코드' },
  ei: { EI: 10, EE: 6, II: 5, max: 10, label: '에너지와 약속' },
  tf: { FF: 8, TF: 7, TT: 5, max: 8, label: '마음 나누기' },
  jp: { JP: 9, JJ: 5, PP: 4, max: 9, label: '생활 리듬' },
} as const;

function pair(a: string, b: string, x: string, y: string) {
  if (a === b) return a + a;
  return x + y; // 서로 다를 때는 고정 순서 (예: EI, NS, TF, JP)
}

export function axisCombos(a: MbtiCode, b: MbtiCode) {
  return {
    ei: pair(a[0], b[0], 'E', 'I') as 'EE' | 'II' | 'EI',
    ns: pair(a[1], b[1], 'N', 'S') as 'NN' | 'SS' | 'NS',
    tf: pair(a[2], b[2], 'T', 'F') as 'TT' | 'FF' | 'TF',
    jp: pair(a[3], b[3], 'J', 'P') as 'JJ' | 'PP' | 'JP',
  };
}

export function mbtiScore(a: MbtiCode, b: MbtiCode) {
  const c = axisCombos(a, b);
  return 50 + AXIS.ns[c.ns] + AXIS.ei[c.ei] + AXIS.tf[c.tf] + AXIS.jp[c.jp];
}

export function axisBars(a: MbtiCode, b: MbtiCode) {
  const c = axisCombos(a, b);
  return (['ns', 'tf', 'jp', 'ei'] as const).map((k) => {
    const def = AXIS[k] as Record<string, number> & { max: number; label: string };
    const raw = def[c[k]];
    return { key: k, label: def.label, value: Math.round(50 + (raw / def.max) * 50) };
  });
}

export interface Tier {
  name: string;
  line: string;
  seal: string;
}

export function tierOf(score: number, same = false): Tier {
  if (same) return { name: '거울 궁합', line: '말 안 해도 아는, 너무 닮아서 웃긴 사이', seal: '鏡' };
  if (score >= 90) return { name: '천생연분', line: '서로의 빈칸을 정확히 채워 주는 사이', seal: '緣' };
  if (score >= 83) return { name: '찰떡궁합', line: '같이 있으면 일이 술술 풀리는 사이', seal: '合' };
  if (score >= 77) return { name: '잘 맞는 편', line: '조금만 맞춰 주면 오래가는 사이', seal: '和' };
  if (score >= 70) return { name: '노력형 궁합', line: '다른 만큼 서로 배울 게 많은 사이', seal: '學' };
  return { name: '롤러코스터', line: '부딪히는 만큼 뜨겁게 가까워지는 사이', seal: '火' };
}

// 축별 해설. {E} {I} 등은 해당 성향을 가진 쪽 유형으로 바뀝니다.
const TEXT = {
  ns: {
    NN: '대화의 결이 잘 맞아요. "만약에"로 시작하는 이야기 하나로 몇 시간이 훌쩍 가고, 서로의 엉뚱한 상상도 웃으며 받아 줘요. 다만 둘 다 현실적인 일처리를 뒤로 미루기 쉬우니 예약, 공과금 같은 건 미리 챙기세요.',
    SS: '현실 감각이 비슷해서 데이트 계획이나 돈 쓰는 방식에서 부딪힐 일이 적어요. 오늘 뭐 먹을지, 주말에 뭐 할지가 금방 정해지죠. 대신 둘 다 익숙한 것만 고르면 관계가 조금 단조로워질 수 있어서, 가끔은 안 가 본 곳에 같이 가 보면 좋아요.',
    NS: '{N}는 큰 그림과 가능성을, {S}는 구체적인 현실을 먼저 봐요. 대화가 엇갈리는 순간이 있지만, 서로가 못 보는 반쪽을 채워 주는 조합이기도 해요. "그래서 언제, 어떻게?"와 "근데 그게 왜?"를 서로 웃으며 받아 줄 수 있다면 생각보다 훨씬 든든한 팀이 돼요.',
  },
  tf: {
    FF: '서로의 감정을 잘 알아채고 배려해서 따뜻한 관계가 돼요. 힘든 날 말없이 옆에 있어 주는 것만으로 위로가 되는 사이예요. 대신 둘 다 상처 주기 싫어서 문제를 덮어 두면 나중에 한꺼번에 터질 수 있어요.',
    TT: '둘 다 솔직하고 논리적이라 문제가 생기면 빠르게 해결해요. 뒤끝 없이 정리되는 게 이 조합의 장점이죠. 다만 맞는 말만 오가다 보면 정작 마음이 다친 건 놓칠 수 있으니, 가끔은 결론보다 "괜찮아?"를 먼저 물어 주세요.',
    TF: '{T}의 해결책과 {F}의 공감이 만나는 조합이에요. 고민을 털어놓을 때 {T}는 방법을 찾아 주고, {F}는 마음을 먼저 살펴요. 이야기를 꺼내기 전에 "해결해 줘"인지 "그냥 들어 줘"인지 먼저 말해 주면 서운할 일이 절반으로 줄어요.',
  },
  jp: {
    JJ: '계획을 세우고 지키는 리듬이 같아서 약속, 여행, 생활 습관이 편하게 맞아요. 둘이 함께 짠 계획은 거의 틀어지지 않죠. 서로 주도권을 쥐려 할 때만 조심하면, 같이 사는 것도 무리 없는 조합이에요.',
    PP: '즉흥적인 리듬이 같아서 갑작스러운 여행 제안에도 바로 "콜"이에요. 같이 있으면 예상 못 한 재미가 계속 생겨요. 둘 다 마감과 정리를 미루기 쉬우니, 집안일이나 돈 관리는 역할을 정해 두면 좋아요.',
    JP: '{J}가 판을 짜고 {P}가 거기에 재미를 더하는 조합이에요. {J}는 {P} 덕분에 여유를 배우고, {P}는 {J} 덕분에 일이 제때 끝나요. 계획은 큰 틀만 정하고 빈칸을 남겨 두면 둘 다 만족해요.',
  },
  ei: {
    EE: '둘 다 사람 만나는 걸 좋아해서 약속이 끊이지 않아요. 함께 아는 친구도 금방 늘어나죠. 다만 늘 밖으로만 돌다 보면 둘만의 깊은 대화가 부족해질 수 있으니, 한 달에 한 번은 단둘이 조용한 시간을 가져 보세요.',
    II: '둘 다 조용한 시간을 소중히 여겨서, 집에서 각자 할 일을 하며 같이 있는 것만으로 편안해요. 억지로 약속을 늘릴 필요가 없는 사이죠. 대신 둘 다 서운한 걸 말로 꺼내지 않으면 오래 묵히게 되니, 작은 것부터 말하는 연습을 해 보세요.',
    EI: '{E}가 새로운 곳으로 데려가고, {I}가 쉬어 갈 자리를 만들어 주는 조합이에요. 서로 덕분에 세계가 넓어지고 깊어져요. 주말에 사람을 몇 번 만날지만 미리 합의해 두면 지칠 일이 없어요.',
  },
  fight: {
    TT: '둘 다 논리로 싸우면 끝이 안 나요. 이기는 것보다 해결하는 걸 목표로 정해 두세요.',
    FF: '감정이 가라앉을 시간을 서로 주고, 서운했던 장면 하나만 골라서 이야기해 보세요.',
    TF: 'T 쪽은 결론보다 마음을 먼저, F 쪽은 감정보다 바라는 걸 먼저 말해 보세요.',
  },
};

function fill(s: string, a: MbtiCode, b: MbtiCode) {
  // 각 성향 글자를 가진 쪽 유형으로 치환
  return s.replace(/\{([EINSTFJP])\}/g, (_, letter: string) => {
    const pos = 'EI'.includes(letter) ? 0 : 'NS'.includes(letter) ? 1 : 'TF'.includes(letter) ? 2 : 3;
    return a[pos] === letter ? a : b;
  });
}

export function matchDetail(a: MbtiCode, b: MbtiCode) {
  const c = axisCombos(a, b);
  const score = mbtiScore(a, b);
  const tier = tierOf(score, a === b);
  return {
    a,
    b,
    score,
    tier,
    bars: axisBars(a, b),
    sections: [
      { title: '대화가 통하는 정도', body: fill(TEXT.ns[c.ns], a, b) },
      { title: '마음을 나누는 방식', body: fill(TEXT.tf[c.tf], a, b) },
      { title: '생활 리듬', body: fill(TEXT.jp[c.jp], a, b) },
      { title: '에너지와 약속', body: fill(TEXT.ei[c.ei], a, b) },
    ],
    fight: {
      a: MBTI[a].fight,
      b: MBTI[b].fight,
      tip: TEXT.fight[c.tf],
    },
  };
}

export function pairSlug(a: string, b: string) {
  return `${a.toLowerCase()}-${b.toLowerCase()}`;
}

export function canonicalPair(a: string, b: string) {
  return a <= b ? pairSlug(a, b) : pairSlug(b, a);
}
