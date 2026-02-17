// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://get-password.com/',
  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push', 'gtag'],
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': './src',
        '@scripts': '/src/scripts',
      },
    },
  },
  i18n: {
    locales: ['en', 'fr', 'es', 'de', 'pt', 'it', 'nl', 'ru', 'ja', 'ko', 'zh', 'ar', 'tr', 'pl', 'sv', 'da', 'no', 'fi', 'cs', 'ro', 'hu', 'el', 'th', 'vi', 'id', 'hi', 'bn', 'ms', 'fa', 'tl', 'uk', 'sr', 'ca', 'he', 'bg', 'sk', 'hr', 'lt', 'lv'],
    defaultLocale: 'en',
  },
});
