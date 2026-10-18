import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { CATALOG } from '../data/catalog';
import { SITE } from '../config/site';

// 네이버 서치어드바이저에 RSS로 등록하면 새 테스트가 빨리 수집됩니다.
export const GET: APIRoute = (context) =>
  rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: [...CATALOG]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .map((c) => ({
        title: c.title,
        description: c.summary,
        link: c.path,
        pubDate: new Date(`${c.publishedAt}T09:00:00+09:00`),
      })),
    customData: '<language>ko-kr</language>',
  });
