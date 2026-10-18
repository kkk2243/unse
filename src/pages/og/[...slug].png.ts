import type { APIRoute, GetStaticPaths } from 'astro';
import { renderOg, type OgSpec } from '../../lib/og';
import { CATALOG } from '../../data/catalog';
import { SITE } from '../../config/site';
import { TESTS } from '../../data/tests';
import { MBTI, MBTI_CODES } from '../../data/mbti/types';
import { matchDetail, canonicalPair } from '../../data/mbti/compat';
import { MBTI_CHAR, DAY_MASTER_CHAR, ELEMENT_CHAR } from '../../art/characters';
import { YEARS, YEAR_INFO, ZODIAC_BRANCHES, ZODIAC_SLUG, GH_TIER } from '../../data/reading';
import { BRANCHES, DAY_MASTER, STEMS, ELEMENTS, ELEMENT_ORDER } from '../../data/saju';
import { zodiacYearReading } from '../../lib/reading';

// 빌드할 때 /og/... .png 이미지를 미리 만들어 둡니다.
export const getStaticPaths: GetStaticPaths = () => {
  const paths: { params: { slug: string }; props: { spec: OgSpec } }[] = [];
  const add = (slug: string, spec: OgSpec) => paths.push({ params: { slug }, props: { spec } });

  add('default', { head: '무료 사주, 운세, 궁합', name: SITE.name, line: '2028 신년운세부터 오늘의 운세, 궁합, MBTI까지 귀여운 부적으로 받아 가세요', seal: '四柱', cta: '운세 보러 가기', scene: { chars: ['owl', 'rabbit'], theme: 'night' } });

  for (const c of CATALOG) {
    add(`test-${c.id}`, { head: SITE.name, name: c.title, line: c.summary, seal: c.seal, scene: { chars: c.chars, theme: c.theme } });
  }

  for (const t of TESTS) {
    if (t.scoring === 'type') {
      for (const [key, r] of Object.entries(t.results)) {
        add(`r/${t.slug}-${key}`, { head: `${SITE.name} ${t.resultHead}`, kicker: t.resultKicker, name: r.name, line: r.line, seal: r.seal, cta: '나도 테스트하기', scene: { chars: [key], theme: 'group' } });
      }
    } else {
      for (const c of MBTI_CODES) {
        add(`r/${t.slug}-${c.toLowerCase()}`, { head: `${SITE.name} 성격 유형`, kicker: MBTI[c].name, name: c, line: MBTI[c].line, seal: c, cta: '나도 검사하기', scene: { chars: [MBTI_CHAR[c]], theme: 'work' } });
      }
    }
  }

  const done = new Set<string>();
  for (const a of MBTI_CODES) {
    for (const b of MBTI_CODES) {
      const slug = canonicalPair(a, b);
      if (done.has(slug)) continue;
      done.add(slug);
      const d = matchDetail(a, b);
      add(`m/${slug}`, {
        head: `${SITE.name} MBTI 궁합`,
        kicker: a === b ? `${a} × ${b}` : `${a} × ${b}, ${d.score}점`,
        name: d.tier.name,
        line: d.tier.line,
        seal: d.tier.seal,
        cta: '우리 궁합 보기',
        scene: { chars: a === b ? [MBTI_CHAR[a]] : [MBTI_CHAR[a], MBTI_CHAR[b]], theme: 'love' },
      });
    }
  }

  // 오늘의 운세 공유용 (띠별)
  for (const b of ZODIAC_BRANCHES) {
    const slug = ZODIAC_SLUG[b];
    add(`day/${slug}`, { head: `${SITE.name} 오늘의 부적`, kicker: `${BRANCHES[b].animal}띠 친구의`, name: '오늘의 운세', line: '생일만 넣으면 매일 새 부적을 써 드려요', seal: '今日', cta: '내 운세 보기', scene: { chars: [slug], theme: 'luck' } });
  }

  // 신년운세 (개인 결과 공유용, 점수 없이) · 띠별 운세 (띠 점수 포함)
  for (const y of YEARS) {
    for (const b of ZODIAC_BRANCHES) {
      const slug = ZODIAC_SLUG[b];
      const scene = { chars: [slug, YEAR_INFO[y].char], theme: 'money' as const };
      add(`year/${y}-${slug}`, {
        head: `${SITE.name} ${y} 신년운세`,
        kicker: `${YEAR_INFO[y].animal}의 해, ${BRANCHES[b].animal}띠 친구의`,
        name: `${y}년 신년운세`,
        line: '연애, 직장, 재물, 건강운에 달마다 흐름까지. 내 운은 몇 점일까?',
        seal: '新年',
        cta: '내 신년운세 보기',
        scene,
      });
      const r = zodiacYearReading(b, y);
      add(`zodiac/${y}-${slug}`, {
        head: `${SITE.name} ${y} 띠별 운세`,
        kicker: `${YEAR_INFO[y].animal}의 해, ${BRANCHES[b].animal}띠는`,
        name: `${r.grade.name}(${r.grade.hanja}) ${r.score}점`,
        line: r.total,
        seal: r.grade.hanja,
        cta: '내 띠 운세 보기',
        scene: { ...scene, mood: r.score >= 70 ? 'happy' : 'normal' },
      });
    }
  }

  // 정통 사주 (일간별)
  for (const [stem, dm] of Object.entries(DAY_MASTER)) {
    const el = ELEMENTS[STEMS[stem].el];
    add(`saju/${DAY_MASTER_CHAR[stem]}`, {
      head: `${SITE.name} 사주 판정`,
      kicker: `타고난 기운은 ${STEMS[stem].ko}${el.ko}(${stem}${el.hanja})`,
      name: dm.image,
      line: dm.line,
      seal: stem,
      cta: '내 사주 보기',
      scene: { chars: [DAY_MASTER_CHAR[stem]], theme: 'study' },
    });
  }

  // 오행 진단 (부족한 기운별)
  for (const k of ELEMENT_ORDER) {
    const el = ELEMENTS[k];
    add(`ohaeng/${k}`, { head: `${SITE.name} 오행 진단`, kicker: '나에게 필요한 기운은', name: `${el.name}의 기운`, line: `행운의 색은 ${el.colorName}, 숫자는 ${el.numbers}`, seal: el.hanja, cta: '내 오행 보기', scene: { chars: [ELEMENT_CHAR[k]], theme: 'study' } });
  }

  // 사주 궁합 (등급별)
  const ghChars = [['rabbit', 'tiger'], ['dog', 'cat'], ['bear', 'deer'], ['fox', 'pig'], ['monkey', 'rooster']];
  [95, 85, 78, 70, 60].forEach((sc, i) => {
    const t = GH_TIER(sc);
    add(`gunghap/${'abcde'[i]}`, { head: `${SITE.name} 궁합 판정`, kicker: '우리 사주 궁합은', name: t.name, line: t.line, seal: t.seal, cta: '우리 궁합 보기', scene: { chars: ghChars[i], theme: 'love' } });
  });

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg((props as { spec: OgSpec }).spec);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
