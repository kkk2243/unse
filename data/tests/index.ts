// 테스트 JSON 파일을 모두 불러옵니다. 이 폴더에 JSON 하나를 추가하면 테스트 페이지가 자동으로 생겨요.
// (src/data/catalog.ts 목록에도 한 줄 추가해야 메인 화면에 보입니다.)

export interface TypeOption {
  text: string;
  score: Record<string, number>;
}
export interface MbtiOption {
  text: string;
  axis: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}
export interface Question<O> {
  q: string;
  options: O[];
}
export interface TypeResult {
  name: string;
  seal: string;
  line: string;
  keys: string[];
  about: string[];
  strengths: string[];
  weaknesses: string[];
  good: string[];
  bad: string[];
  tip: string;
}
interface Base {
  slug: string;
  catalogId: string;
  title: string;
  description: string;
  lead: string;
  questionCount: number;
  minutes: number;
  resultHead: string;
  resultKicker: string;
  shareTitle: string;
  article: string[];
  faq: { q: string; a: string }[];
}
export interface TypeTest extends Base {
  scoring: 'type';
  questions: Question<TypeOption>[];
  results: Record<string, TypeResult>;
}
export interface MbtiTest extends Base {
  scoring: 'mbti';
  questions: Question<MbtiOption>[];
}
export type TestDef = TypeTest | MbtiTest;

const modules = import.meta.glob<{ default: TestDef }>('./*.json', { eager: true });

export const TESTS: TestDef[] = Object.values(modules).map((m) => m.default);

export function getTest(slug: string) {
  return TESTS.find((t) => t.slug === slug);
}
