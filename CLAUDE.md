# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Get Password (get-password.com) is a multilingual password generator web app built with Astro. It offers two modes: a classic random password generator (using Web Crypto API) and a memorable passphrase generator (using word lists). All password generation happens client-side — no server-side processing or storage.

## Commands

- `npm run dev` — Start local dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build locally

## Architecture

### Internationalization (i18n)

The site supports 4 languages: en (default), fr, es, de. Astro's built-in i18n is configured in `astro.config.mjs` with `defaultLocale: 'en'`.

- **UI strings**: `src/i18n/ui.ts` — flat key-value maps per language (e.g., `'password.title'`)
- **Helpers**: `src/i18n/utils.ts` — `getLangFromUrl(url)` extracts lang from URL path, `useTranslations(lang)` returns a `t()` function
- **Markdown content**: `src/contents/{lang}/` — localized article content (secure_passwords, memorization_tips, password_manager_guide)
- **Word lists**: `public/words/{lang}/words-compact.json` — fetched at runtime by the memorable generator

Pages are duplicated per locale under `src/pages/{lang}/index.astro`. The root `src/pages/index.astro` defaults to English.

### Password Generators

Two independent client-side generators, each with its own script and Astro component:

- **Classic** (`src/components/PasswordGenerator.astro` + `src/scripts/passwordGenerator.js`): Uses `window.crypto.getRandomValues()` for secure random generation. Configurable length, character categories, count. Strength meter uses `.bar` CSS class.
- **Memorable** (`src/components/MemorablePasswordGenerator.astro` + `src/scripts/memorablePasswordGenerator.js`): Fetches word lists from `/words/{lang}/words-compact.json`, concatenates capitalized words with optional numbers/symbols. Strength meter uses `.bars` CSS class (note: different class name from classic).

Toggle between generators is handled by `src/scripts/index.js` via `data-type` attributes on nav buttons (`classic` / `memorable`).

### Layouts and Theming

- `src/layouts/Layout.astro` — Main layout with global CSS variables, dark mode logic (inline script using `localStorage`), and Varela Round font
- Dark mode toggled via `.dark-mode` class on `<html>`, controlled by `window.toggleTheme()`
- CSS variables defined in `:root` and `:root.dark-mode` for theming
- Uses Astro `ClientRouter` for view transitions

### Vite Aliases

Defined in `astro.config.mjs`:
- `@` → `./src`
- `@scripts` → `/src/scripts`

### Deployment

- Site URL: `https://get-password.com/`
- `functions/[[path]].js` — Cloudflare Pages function that 301-redirects from `get-password.pages.dev` to `get-password.com`
- Integrations: `@astrojs/sitemap` for SEO, `@astrojs/partytown` for Google Analytics (gtag)

## Adding a New Language

1. Add the language key to `languages` in `src/i18n/ui.ts` and add all translation strings
2. Create `src/pages/{lang}/index.astro` (copy from an existing locale page)
3. Add markdown content in `src/contents/{lang}/`
4. Add word list at `public/words/{lang}/words-compact.json` (for memorable generator)
5. Add the locale to the `i18n.locales` array in `astro.config.mjs`
