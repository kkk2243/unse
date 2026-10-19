// 소원 부적: 종류별 이름, 도장, 캐릭터, 축원 문구
import type { Theme } from '../art/characters';

export interface Wish {
  key: string;
  label: string;
  title: string;
  seal: string;
  char: string;
  theme: Theme;
  hint: string; // 소원 입력칸 예시
  wish: string; // 소원을 비워 두면 쓰는 기본 문구
  lines: string[];
}

export const WISHES: Wish[] = [
  { key: 'pass', label: '합격', title: '합격 부적', seal: '合格', char: 'owl', theme: 'study', hint: '예: 공무원 시험 합격', wish: '바라는 시험에 꼭 붙기', lines: ['노력한 만큼 답이 보이고, 아는 문제는 하나도 놓치지 않기를.', '떨리는 순간에도 머리는 맑게, 손은 차분하게 움직이기를.', '그동안 쌓은 시간이 합격이라는 이름으로 돌아오기를.'] },
  { key: 'money', label: '재물', title: '재물 부적', seal: '招財', char: 'pig', theme: 'money', hint: '예: 올해 1000만 원 모으기', wish: '들어오는 돈은 많고 나가는 돈은 적게', lines: ['들어온 복이 새지 않고 차곡차곡 쌓이기를.', '뜻밖의 수입과 좋은 기회가 문을 두드리기를.', '땀 흘린 만큼 지갑이 두둑해지는 한 해가 되기를.'] },
  { key: 'love', label: '연애', title: '인연 부적', seal: '緣', char: 'rabbit', theme: 'love', hint: '예: 좋은 사람 만나기', wish: '좋은 인연이 먼저 다가오기', lines: ['마음이 통하는 사람과 웃는 날이 많아지기를.', '스쳐 가는 인연 말고, 오래 머무는 인연을 만나기를.', '사랑하는 사람과 서로에게 가장 좋은 편이 되어 주기를.'] },
  { key: 'health', label: '건강', title: '건강 부적', seal: '康寧', char: 'turtle', theme: 'luck', hint: '예: 아프지 않고 건강하기', wish: '아프지 않고 오래오래 건강하기', lines: ['몸도 마음도 가볍게, 잔병 없이 지나가기를.', '잘 먹고 잘 자고, 웃을 일이 많아지기를.', '소중한 사람들과 오래오래 건강하게 함께하기를.'] },
  { key: 'job', label: '취업 승진', title: '승진 부적', seal: '昇進', char: 'dragon', theme: 'work', hint: '예: 원하는 회사 입사', wish: '원하는 자리에 당당하게 오르기', lines: ['내 실력을 알아봐 주는 사람을 만나기를.', '면접장에서도 회의실에서도 나답게 빛나기를.', '한 계단씩 오르는 길이 순탄하고 단단하기를.'] },
  { key: 'family', label: '가족 평안', title: '평안 부적', seal: '和平', char: 'bear', theme: 'group', hint: '예: 우리 가족 모두 행복하기', wish: '우리 집에 웃음이 끊이지 않기', lines: ['가족 모두 무탈하고, 저녁 식탁에 웃음이 가득하기를.', '서로 아끼는 마음이 더 깊어지는 한 해가 되기를.', '멀리 있어도 늘 마음은 가까이 닿아 있기를.'] },
  { key: 'luck', label: '행운', title: '행운 부적', seal: '福', char: 'sun', theme: 'luck', hint: '예: 하는 일마다 잘 풀리기', wish: '하는 일마다 술술 풀리기', lines: ['작은 일에도 운이 따르고, 큰일에는 귀인이 함께하기를.', '매일 하나씩 좋은 소식이 들려오기를.', '오늘보다 내일이 조금 더 반짝이기를.'] },
  { key: 'guard', label: '액막이', title: '액막이 부적', seal: '除厄', char: 'dog', theme: 'night', hint: '예: 삼재 무사히 넘기기', wish: '나쁜 일은 비켜 가고 좋은 일만 오기', lines: ['궂은일은 문 앞에서 돌아가고, 복만 들어오기를.', '삼재도 고비도 가볍게 넘기는 한 해가 되기를.', '조심할 때는 지혜가, 위급할 때는 도움이 함께하기를.'] },
];
