// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://get-password.com/',
  integrations: [sitemap()],
  vite: {
    resolve: {
      alias: {
        '@': './src',
        '@scripts': '/src/scripts',
      },
    },
  },
  i18n: {
    locales: ['en', 'fr', 'es'],
    defaultLocale: 'en',
  },
});
