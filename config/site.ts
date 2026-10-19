// 사이트 전체 설정. 이름·도메인·키를 바꿀 때는 이 파일과 .env만 고치면 됩니다.

export const SITE = {
  name: '사주 연구원',
  tagline: '매일 들르는 나만의 사주 연구소',
  description:
    '2028년 신년운세, 오늘의 운세, 정통 사주 풀이, 사주 궁합, MBTI 궁합까지 무료로. 결과는 귀여운 부적 카드로 저장해서 친구에게 보내 보세요.',
  locale: 'ko_KR',
  // 문의 메일: 
  contactEmail: 'ycmbs3@gmail.com',
  // 공개 시작일 (정책 페이지 시행일, '새로 나왔어요' 기준)
  launchedAt: '2026-10-18',
};

// 환경변수 (Netlify 사이트 설정 > Environment variables 에 등록)
export const ENV = {
  kakaoJsKey: import.meta.env.PUBLIC_KAKAO_JS_KEY ?? '',
  gaId: import.meta.env.PUBLIC_GA_ID ?? '',
  adsenseClient: import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '',
};

export const KAKAO_SDK_VERSION = '2.8.3';

export type CategoryKey = 'saju' | 'love' | 'test';

export const CATEGORIES: Record<
  CategoryKey,
  { key: CategoryKey; name: string; short: string; color: string; description: string }
> = {
  saju: {
    key: 'saju',
    name: '사주·운세',
    short: '운세',
    color: 'var(--c-saju)',
    description: '생년월일로 보는 신년운세, 오늘의 운세, 정통 사주와 띠별 운세.',
  },
  love: {
    key: 'love',
    name: '궁합',
    short: '궁합',
    color: 'var(--c-love)',
    description: '사주 궁합부터 이름 궁합, MBTI 궁합, 단톡방 친구들 케미까지.',
  },
  test: {
    key: 'test',
    name: '심리·MBTI',
    short: '테스트',
    color: 'var(--c-mbti)',
    description: '가볍게 해 보고 친구랑 비교하기 좋은 심리 테스트와 MBTI.',
  },
};

// 광고 슬롯 ID. 애드센스 승인 후 [광고 > 광고 단위]에서 만든 슬롯 번호를 넣으세요.
// 비어 있으면 그 자리는 화면에 나타나지 않습니다 (자동 광고만 동작).
export const AD_SLOTS: Record<string, string> = {
  gate: '', // 분석 중 화면 (300×250 권장)
  'test-intro': '',
  'result-top': '',
  'result-article': '',
  'list-infeed': '',
};

// 부적 맨 아래에 찍히는 주소. 도메인이 아직 없으면 사이트 이름을 씁니다.
export function siteFoot(site?: URL | string) {
  const host = site ? new URL(site).host : '';
  return !host || host === 'example.com' || host.startsWith('localhost') ? SITE.name : host;
}
