// 사주 MBTI: 사주 여덟 글자의 기운으로 MBTI 네 성향을 추정하고, 실제 MBTI와 얼마나 같은지(싱크로율) 계산합니다.
import type { Saju, TenGod } from './saju';
import { STEMS } from '../data/saju';
import type { MbtiCode } from '../data/mbti/types';

type Axis = 'EI' | 'SN' | 'TF' | 'JP';

export const AXIS_INFO: Record<Axis, { a: string; b: string; aName: string; bName: string; label: string }> = {
  EI: { a: 'E', b: 'I', aName: '외향', bName: '내향', label: '에너지 방향' },
  SN: { a: 'S', b: 'N', aName: '감각', bName: '직관', label: '세상을 보는 눈' },
  TF: { a: 'T', b: 'F', aName: '사고', bName: '감정', label: '판단 기준' },
  JP: { a: 'J', b: 'P', aName: '계획', bName: '즉흥', label: '생활 리듬' },
};

export const AXIS_TEXT: Record<Axis, Record<string, { same: string; diff: string }>> = {
  EI: {
    E: { same: '사주에도 밖으로 뻗어 나가는 기운이 강해요. 사람을 만나고 무대에 설 때 에너지가 채워지는 진짜 외향형이에요.', diff: '사주에는 안으로 모으는 기운이 더 강해요. 밖에서는 활발하지만 집에 오면 방전되는 "사회적 외향형"일 가능성이 커요.' },
    I: { same: '사주에도 안으로 모으는 기운이 강해요. 혼자만의 시간에 생각을 다듬고 힘을 채우는, 뼛속까지 내향형이에요.', diff: '사주에는 밖으로 뻗는 기운이 숨어 있어요. 평소엔 조용해도 판이 깔리면 누구보다 잘 노는 "숨은 인싸" 타입이에요.' },
  },
  SN: {
    S: { same: '사주에도 현실을 다루는 기운이 강해요. 눈에 보이는 결과와 경험을 믿는 실속파예요.', diff: '사주에는 직감과 상상의 기운이 더 많아요. 현실적으로 움직이지만 가끔 번뜩이는 촉이 맞아떨어지는 사람이에요.' },
    N: { same: '사주에도 직감과 상상의 기운이 강해요. 보이지 않는 가능성을 먼저 보는 아이디어형이에요.', diff: '사주에는 현실 감각의 기운이 더 많아요. 생각은 멀리 날아가도 결국 실속을 챙기는 똑똑한 몽상가예요.' },
  },
  TF: {
    T: { same: '사주에도 판단하고 결단하는 기운이 강해요. 감정보다 논리와 원칙으로 움직이는 냉철한 해결사예요.', diff: '사주에는 따뜻하게 품는 기운이 더 많아요. 겉으로는 논리적이어도 속으로는 정이 깊은 츤데레 타입이에요.' },
    F: { same: '사주에도 따뜻하게 품는 기운이 강해요. 사람의 마음을 먼저 읽고 공감하는 다정한 사람이에요.', diff: '사주에는 결단하는 기운이 숨어 있어요. 평소엔 다정해도 중요한 순간에는 누구보다 단호해지는 사람이에요.' },
  },
  JP: {
    J: { same: '사주에도 질서와 계획의 기운이 강해요. 정해진 틀 안에서 차근차근 쌓아 올리는 계획형이에요.', diff: '사주에는 자유로운 기운이 더 많아요. 계획을 세우지만 막상 즉흥 여행에서 가장 행복해하는 사람이에요.' },
    P: { same: '사주에도 자유롭게 움직이는 기운이 강해요. 즉흥적인 상황에서 오히려 실력이 나오는 유연한 사람이에요.', diff: '사주에는 질서의 기운이 숨어 있어요. 평소엔 느긋해도 마감이나 중요한 일 앞에서는 놀라운 계획력을 보여 줘요.' },
  },
};

export function syncTier(sync: number) {
  if (sync >= 85) return { name: '사주가 증명한 진짜', line: '타고난 기운과 지금의 성격이 거의 똑같은, 겉과 속이 같은 사람', seal: '同', text: '사주와 MBTI가 이렇게까지 맞는 경우는 드물어요. 지금의 내 모습이 타고난 기질 그대로 자란 거예요. 내 성향을 믿고 밀고 나가면 운도 함께 따라와요.' };
  if (sync >= 70) return { name: '겉과 속이 닮은 사람', line: '사주와 MBTI가 대부분 통하는, 한결같은 매력의 사람', seal: '合', text: '큰 줄기는 타고난 기질과 같고, 한두 가지 성향만 살면서 달라졌어요. 달라진 부분은 환경과 경험이 만들어 준 나의 무기예요.' };
  if (sync >= 55) return { name: '반전 매력 보유자', line: '평소 모습과 숨은 기질이 달라서 알수록 새로운 사람', seal: '反', text: '겉으로 보이는 나와 타고난 기질 사이에 재미있는 차이가 있어요. 주변 사람들이 "너 이런 면도 있었어?" 하고 놀라는 일이 많을 거예요.' };
  return { name: '숨은 자아가 있는 사람', line: '사주 속에 지금과 전혀 다른 내가 숨어 있는 사람', seal: '隱', text: '지금의 MBTI는 살아오면서 만든 모습이고, 사주에는 전혀 다른 기질이 잠들어 있어요. 새로운 환경에 가면 숨은 내가 깨어나 스스로도 놀랄 수 있어요.' };
}

export function sajuMbti(s: Saju, mbti: MbtiCode) {
  const G = s.groups;
  const C = s.counts as Record<string, number>;
  const yang = STEMS[s.dayStem].yang;
  const gods: string[] = [];
  for (const p of s.pillars) {
    if (p.stemGod !== '일간') gods.push(p.stemGod);
    gods.push(p.branchGod);
  }
  const cnt = (list: TenGod[]) => gods.filter((g) => (list as string[]).includes(g)).length;
  const raw: Record<Axis, [number, number]> = {
    EI: [(yang ? 1.4 : 0) + G.output + G.wealth * 0.6 + G.self * 0.3 + C.fire * 0.4, (yang ? 0 : 1.4) + G.resource + G.power * 0.5 + C.water * 0.4 + 0.3],
    SN: [G.wealth + G.power * 0.6 + C.earth * 0.5 + C.metal * 0.3, G.resource + G.output * 0.6 + C.wood * 0.4 + C.water * 0.4],
    TF: [G.power * 0.8 + G.wealth * 0.5 + C.metal * 0.6 + cnt(['편관', '상관']) * 0.3, G.resource * 0.8 + G.output * 0.5 + C.wood * 0.4 + C.fire * 0.5],
    JP: [cnt(['정관', '정재', '정인', '식신']) + C.earth * 0.3 + C.metal * 0.3, cnt(['편관', '편재', '편인', '상관', '겁재']) + C.fire * 0.3 + C.water * 0.3],
  };
  const axes = (Object.keys(raw) as Axis[]).map((k, i) => {
    const [va, vb] = raw[k];
    const pa = va + vb === 0 ? 50 : Math.max(12, Math.min(88, Math.round((100 * va) / (va + vb))));
    const info = AXIS_INFO[k];
    const saju = pa >= 50 ? info.a : info.b;
    const mine = mbti[i];
    const sync = mine === info.a ? pa : 100 - pa;
    return { key: k, ...info, pa, saju, mine, sync, same: saju === mine, text: AXIS_TEXT[k][mine][saju === mine ? 'same' : 'diff'] };
  });
  const pred = axes.map((a) => a.saju).join('') as MbtiCode;
  const avg = axes.reduce((a, x) => a + x.sync, 0) / 4;
  const sync = Math.max(35, Math.min(99, Math.round(24 + avg * 0.85)));
  return { pred, axes, sync, tier: syncTier(sync) };
}
