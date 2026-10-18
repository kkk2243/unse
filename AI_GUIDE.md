# AI 작업 안내 (이 프로젝트를 고치는 AI에게)

이 파일을 먼저 읽고 작업하세요. 요구정의서와 함께 쓰면 좋습니다.

## 프로젝트

- 사이트 이름: 사주 연구원. Astro 7 정적 사이트, Tailwind CSS 4, 서버와 DB 없음. Netlify에 `dist/`를 배포.
- 모든 사용자 입력(이름, 생년월일)은 브라우저에서만 계산한다. 서버 전송, URL 파라미터에 평문 저장 금지.
  - 저장한 프로필: localStorage `saju.profiles`, `saju.current` (`lib/profile.ts`)
  - 입력 화면 → 결과 페이지로 넘길 값: sessionStorage `saju.pending` (`setPending`/`getPending`)
- 주소는 끝에 `/`를 붙인다 (`trailingSlash: 'always'`).

## 화면 흐름

- 입력 화면(`InputPage`, `DayInput`) → `lib/gate.ts`의 `openGate()`로 분석 중 화면 → '결과 보기' 링크 → `/…/result/` 페이지.
- '결과 보기'는 반드시 `<a href>` 링크로 둔다. 애드센스 비네트 광고가 링크 이동 때 나오기 때문이다.
- 결과 페이지는 `ResultShell`로 틀을 그리고, 스크립트에서 `fillTalisman()`(부적 카드), `lib/render.ts`(풀이 블록), `updateShare()`(공유)를 부른다.

## 광고 규칙 (애드센스 정책)

- "광고를 봐야 결과를 볼 수 있어요" 같은 직접 만든 강제 시청, 광고 클릭 유도 문구, 광고와 헷갈리는 버튼은 만들지 않는다.
- 결과 잠금이 필요하면 애드센스의 오퍼월(보상형) 설정으로만 한다. 코드는 바꿀 필요 없다.
- 광고는 `components/AdSlot.astro`로만 넣는다. 버튼 바로 옆, 문항 화면, 입력 폼 사이에는 넣지 않는다.
- 참여자 수, 후기처럼 지어낸 숫자나 문구를 넣지 않는다.

## 디자인 규칙

- 콘셉트: 점신처럼 밝은 앱형 화면 + 귀여운 캐릭터 + 노란 부적 결과 카드.
- 캐릭터는 `src/art/characters.ts`의 SVG만 쓴다(`charSvg`, `sceneSvg`). 띠 동물, 일간(나무, 태양 등), MBTI 동물이 정해져 있다. 저작권 있는 캐릭터 금지.
- 색은 `styles/global.css`의 CSS 변수만 쓴다. 다크 모드는 `<html data-theme="dark">`.
- 글꼴: 제목은 `font-display`(Hahmlet), 본문은 Pretendard, 도장 한자는 `Seal Hanja`.
- 모바일 480px 컬럼(`.col`), 데스크톱 1040px 이상에서는 왼쪽 패널이 붙는다. 카카오톡 인앱 브라우저에서 깨지지 않아야 한다.

## 문장 규칙

- 존댓말 해요체, 짧고 구체적으로. 이모지, 느낌표 남발, 가운뎃점(·) 나열 금지.
- 이름 뒤에는 '님'을 붙여 조사를 일정하게 쓴다 (`honor()`).
- 결과 하단에는 재미용 콘텐츠라는 안내(`components/Disclaimer.astro`)를 둔다. MBTI 페이지에는 공식 검사가 아니라는 문구를 유지한다.

## 새 콘텐츠 추가

- 질문형 테스트: `src/data/tests/*.json` + `src/data/catalog.ts`에 한 줄. 페이지, 결과 페이지, OG 이미지는 자동 생성.
- 생년월일로 계산하는 풀이: `lib/reading.ts`에 함수, `data/reading.ts`에 문장, `pages/…/index.astro`(InputPage) + `pages/…/result.astro`(ResultShell).
- 새 결과의 카톡 미리보기 이미지는 `pages/og/[...slug].png.ts`에 경로를 추가한다.
- 새 페이지에는 `title`, `description`, `ogImage`, `crumbs`를 넣는다.

## 확인

- `npm run build`가 오류 없이 끝나야 한다.
- 계산을 고쳤다면 `npm run test:calc`.
- 360px 폭에서 가로 스크롤이 생기지 않는지, 다크 모드에서 글자가 보이는지 확인한다.
