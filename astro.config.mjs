// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  integrations: [],
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
