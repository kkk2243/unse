// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 사이트 주소: Netlify에서 빌드하면 URL 환경변수(연결한 도메인)가 자동으로 들어옵니다.
// 직접 지정하려면 SITE_URL 환경변수를 설정하세요.
const site = process.env.SITE_URL || process.env.URL || 'https://example.com';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
