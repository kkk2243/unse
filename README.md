# 사주 연구원

신년운세, 오늘의 운세, 정통 사주, 궁합, MBTI 테스트를 모은 정적 웹사이트입니다. Astro로 만들었고, 서버 없이 Netlify 무료 플랜에 올릴 수 있어요.
모든 결과는 귀여운 캐릭터가 그려진 '부적' 카드로 나오고, 9:16 이미지로 저장하거나 카카오톡으로 보낼 수 있어요.
이름과 생년월일은 브라우저 안에서만 계산하고 서버로 보내지 않습니다.

## 들어 있는 것

| 주소 | 내용 |
| --- | --- |
| `/` | 홈 (내 정보 바로가기, 출석 도장, 메뉴, 인기 풀이) |
| `/newyear/` → `/newyear/result/` | 2027, 2028 신년운세 (기본 2028). 총운, 8개 분야, 분야별 좋은 달, 월별 그래프와 12달 풀이, 삼재 |
| `/fortune/today/` `/fortune/tomorrow/` `/fortune/date/` → `/fortune/result/` | 오늘, 내일, 지정일 운세. 총운(일진 풀이 포함), 8개 분야, 시간대별 흐름, 행운 아이템 |
| `/saju/` → `/saju/result/` | 정통 사주. 사주 표(십신), 오행 그래프, 신강/신약, 성격, 연애, 결혼, 직업, 재물, 건강, 대운 |
| `/saju/ohaeng/` → `/saju/ohaeng/result/` | 오행 진단 (부족한 기운 채우기) |
| `/gunghap/` → `/gunghap/result/` | 사주 궁합 (오행, 일지, 띠, 보완 관계) |
| `/zodiac/`, `/zodiac/2028/tiger/` 등 | 띠별 신년운세 24페이지 (검색 유입용) |
| `/love/name-match/` `/love/name-mbti/` `/love/group/` | 이름 궁합, 이름+MBTI 궁합, 단톡방 궁합 |
| `/mbti-match/`, `/mbti-match/enfp-intj/` 등 | MBTI 궁합표와 궁합 상세 136페이지 |
| `/test/mbti/` `/test/animal/` | 질문형 테스트, 유형별 결과 페이지 |
| `/mbti/`, `/mbti/{유형}/` | MBTI 16유형 해설 |
| `/saju-mbti/` → `/saju-mbti/result/` | 사주 MBTI 싱크로율 (사주로 본 MBTI와 실제 MBTI 비교) |
| `/ilju/`, `/ilju/gyeongjin/` 등 | 60갑자 일주 도감 60페이지 ('흰 용 일주' 같은 별명, 성격, 연애, 직업, 궁합 일주) |
| `/zodiac/today/` | 오늘의 띠별 운세 순위 (매일 자정 갱신, 내일 순위 미리 보기) |
| `/baby-name/`, `/baby-name/seojun/` 등 | 아기 이름 짓기 (사주 보완 한자, 순우리말, 이름 뜻 페이지 89개) |
| `/bujeok/` | 소원 부적 만들기 (휴대폰 배경화면 9:16 이미지) |
| `/dream/`, `/dream/snake/` 등 | 꿈해몽 사전 50가지 (검색, 분류, 상황별 풀이) |
| `/guide/`, `/guide/samjae/` 등 | 사주 백과 10편 (애드센스 심사와 검색 유입용 해설 글) |
| `/gunghap/?invite=…` | 궁합 초대장 링크 (보낸 사람 정보가 담긴 링크, 받은 사람은 자기 정보만 입력) |
| `/me/` | 내 정보 (생년월일 저장, 최대 6명, 궁합 초대장 보내기) |
| `/category/...` | 카테고리 모아 보기 |
| `/about/` `/privacy/` `/terms/` `/contact/` | 애드센스 승인에 필요한 정책 페이지 |
| `/og/...png` | 카톡 공유 미리보기 이미지 약 330장 (빌드할 때 캐릭터 그림과 함께 자동 생성) |
| `/sitemap-index.xml` `/robots.txt` `/rss.xml` | 검색 등록용 |

입력 → '분석 중' 화면(광고 자리 포함, 약 4초) → 결과 페이지 순서로 움직여요. 결과는 주소가 따로 있는 페이지라서 '결과 보기'를 누를 때 애드센스 전면 광고(비네트)가 나올 수 있어요.

## 내 컴퓨터에서 실행하기

1. [Node.js](https://nodejs.org) 22 LTS 최신 버전(22.22 이상) 또는 24를 설치합니다.
2. 이 폴더에서 터미널을 열고:

```bash
npm install
npm run dev
```

3. 브라우저에서 `http://localhost:4321` 을 엽니다. 개발 중에는 광고 자리가 점선 상자로 보여요.

계산이 맞는지 점검하려면 `npm run test:calc` 를 실행하세요.

## Netlify에 올리기

가장 빠른 방법: `npm run build` 후 생긴 `dist` 폴더를 [Netlify Drop](https://app.netlify.com/drop)에 끌어다 놓으면 끝이에요.

자동 배포를 하려면:

1. GitHub에 새 저장소를 만들고 이 폴더를 통째로 올립니다. (`node_modules`, `dist` 폴더는 올리지 않아요. `.gitignore`에 이미 적혀 있어요.)
2. [Netlify](https://app.netlify.com) > Add new site > Import an existing project > GitHub에서 저장소를 고릅니다.
3. 설정은 `netlify.toml`이 알아서 채워 줘요. Deploy 버튼만 누르면 됩니다. (빌드 2분 정도)
4. 도메인을 샀다면 Netlify의 Domain management에서 연결하세요.

## 환경변수 (Netlify > Site configuration > Environment variables)

| 이름 | 어디서 받나 | 없으면 |
| --- | --- | --- |
| `PUBLIC_KAKAO_JS_KEY` | [카카오 개발자](https://developers.kakao.com) > 내 애플리케이션 > 앱 키 > JavaScript 키 | 카톡 버튼을 누르면 링크 복사로 대신해요 |
| `PUBLIC_GA_ID` | Google Analytics 4 측정 ID (`G-`로 시작) | 방문 통계를 안 모아요 |
| `PUBLIC_ADSENSE_CLIENT` | 애드센스 게시자 ID (`ca-pub-`으로 시작) | 광고가 안 나와요 |
| `SITE_URL` | 직접 지정할 때만 (예: `https://내도메인.com`) | Netlify 주소를 자동 사용 |

환경변수를 바꾼 뒤에는 Netlify에서 Deploys > Trigger deploy로 다시 배포해야 적용돼요. (Netlify Drop으로 올릴 때는 내 컴퓨터에서 `.env` 파일에 적고 빌드하세요.)

### 카카오톡 공유 설정

1. 카카오 개발자 콘솔에서 애플리케이션을 만듭니다.
2. 앱 설정 > 플랫폼 > Web에 사이트 도메인(예: `https://내도메인.com`, Netlify 주소)을 등록합니다.
3. JavaScript 키를 `PUBLIC_KAKAO_JS_KEY`로 등록합니다.

### 애드센스 (광고 수익 구조)

점신처럼 '결과 전에 광고'를 보여 주되, 애드센스 정책 안에서 하는 구성이에요. 직접 만든 "광고를 봐야 결과 열림" 버튼은 정책 위반(광고 시청 보상)이라 넣지 않았어요.

1. **분석 중 화면 광고**: 입력 후 4초 동안 보이는 분석 화면에 300×250 광고 자리(`gate`)가 있어요. 버튼과 떨어진 아래쪽에 있어요.
2. **전면 광고(비네트)**: 애드센스 > 광고 > 사이트 수정 > 자동 광고 켜기 > 오버레이 형식에서 '비네트 광고'를 켭니다. '결과 보기'가 링크라서 누를 때 전면 광고가 나올 수 있어요. 앵커 광고(화면 아래 띠)도 같이 켜 두면 좋아요.
3. **보상형 광고로 결과 열기(오퍼월)**: 애드센스 > 개인 정보 보호 및 메시지 > 오퍼월에서 메시지를 만들고, 페이지 포함 규칙에 `/newyear/result/`, `/saju/result/`, `/gunghap/result/` 처럼 결과 주소를 넣으세요. 방문자가 광고 보기 등을 골라서 결과를 열게 돼요. 처음에는 노출 기준(몇 페이지 뒤에 보일지)을 넉넉하게 잡고 이탈률을 보면서 줄이세요.
4. **페이지 안 광고**: 애드센스에서 광고 단위를 만들고, 슬롯 번호를 `src/config/site.ts`의 `AD_SLOTS`에 넣으세요.
   자리 이름: `gate`(분석 중 화면), `test-intro`(입력 화면 아래), `result-top`(결과 카드 아래), `result-article`(풀이 중간), `list-infeed`(목록 사이)
5. 승인되면 `public/ads.txt`의 안내대로 게시자 ID를 넣습니다. 쿠키 동의 팝업은 개인 정보 보호 및 메시지에서 Google 인증 동의 메시지를 켜면 됩니다.

애드센스 신청은 개인 도메인을 연결하고 콘텐츠가 충분히 쌓인 뒤(지금 페이지 수면 충분해요) 하는 걸 권해요.

### 검색 등록

- Google Search Console: 사이트를 추가하고 `https://내도메인.com/sitemap-index.xml`을 제출하세요.
- 네이버 서치어드바이저: 소유 확인 메타 태그를 `src/layouts/Base.astro`의 주석 자리에 넣고, 사이트맵과 `rss.xml`을 제출하세요.

## 자주 바꾸게 될 곳

| 하고 싶은 일 | 고칠 파일 |
| --- | --- |
| 사이트 이름, 문의 메일, 광고 슬롯 | `src/config/site.ts` |
| 홈 메뉴와 목록, 순서 | `src/data/catalog.ts` |
| 운세, 신년운세, 사주, 궁합 풀이 문장 | `src/data/reading.ts` |
| 풀이를 고르는 규칙(점수, 별점) | `src/lib/saju.ts`, `src/lib/reading.ts` |
| 꿈해몽 추가, 수정 | `src/data/dreams.ts` |
| 사주 백과 글 추가, 수정 | `src/data/guide.ts` |
| 소원 부적 종류와 문구 | `src/data/bujeok.ts` |
| 아기 이름 후보, 한자, 뜻 | `src/data/baby-names.ts` (한자는 부수가 오행에 분명히 속하는 글자만) |
| 사주 MBTI 계산 기준과 문장 | `src/lib/saju-mbti.ts` |
| 일주 도감 문장 | `src/lib/ilju.ts`, `src/data/reading-more.ts` |
| 신년운세 연도 (2029년 추가 등) | `src/data/reading.ts`의 `YEARS`, `DEFAULT_YEAR`, `YEAR_INFO` |
| 캐릭터 그림 | `src/art/characters.ts` (SVG) |
| 메뉴 아이콘 | `src/art/icons.ts` |
| 카톡 미리보기 이미지 | `src/lib/og.ts`, `src/pages/og/[...slug].png.ts` |
| 색, 글꼴 | `src/styles/global.css` 맨 위 색상 토큰 |
| 질문형 테스트 | `src/data/tests/*.json` |
| MBTI 유형, 궁합 | `src/data/mbti/` |

### 질문형 테스트 추가하기

1. `src/data/tests/animal.json`을 복사해서 새 이름으로 저장하고 `slug`, `catalogId`, 질문과 결과를 바꿉니다.
2. `src/data/catalog.ts`에 같은 `id`로 한 줄을 추가합니다. (`chars`에 캐릭터 이름, `seal`에 도장 글자)
3. 저장하면 시작 페이지, 결과 페이지, 공유 이미지가 자동으로 생겨요.

도장에 새 한자를 쓰면 `public/fonts/seal-hanja.woff2`에 그 글자가 없어서 기본 글꼴로 보여요. 한글 한 글자를 써도 괜찮아요.

## 폴더 구조

```
src/
  art/                  캐릭터, 아이콘 SVG
  config/site.ts        사이트 설정, 카테고리, 광고 슬롯
  data/                 풀이 문장과 데이터 (reading.ts, 사주, MBTI, 테스트)
  lib/                  계산 로직 (사주, 풀이 조립, 프로필, 분석 중 화면, 공유, 부적 이미지)
  components/           부적 카드, 입력 폼, 분석 중 화면, 탭 바 등
  layouts/Base.astro    모든 페이지의 틀 (메타 태그, GA, 애드센스)
  pages/                주소별 페이지
public/                 그대로 올라가는 파일 (favicon, ads.txt, 한자 글꼴)
scripts/check-calc.ts   계산 점검
```

AI 코딩 도구로 이어서 작업할 때는 `AI_GUIDE.md`를 먼저 읽게 하세요.
