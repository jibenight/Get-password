import { describe, it, expect } from 'vitest';
import { languages, ui, defaultLang } from '../src/i18n/ui.ts';

// Read the astro config to get the locales array
import astroConfig from '../astro.config.mjs';

const locales = astroConfig.i18n.locales;
const languageKeys = Object.keys(languages);
const englishKeys = Object.keys(ui[defaultLang]);

describe('i18n — translation completeness', () => {
  it('languages object matches astro.config locales', () => {
    expect(languageKeys.sort()).toEqual([...locales].sort());
  });

  it('defaultLang is "en"', () => {
    expect(defaultLang).toBe('en');
  });

  it('every language in languages has a ui entry', () => {
    for (const lang of languageKeys) {
      expect(ui).toHaveProperty(lang);
    }
  });

  describe.each(languageKeys)('language "%s"', (lang) => {
    it('has the same keys as English', () => {
      const langKeys = Object.keys(ui[lang]).sort();
      expect(langKeys).toEqual([...englishKeys].sort());
    });

    it('has no empty string values', () => {
      const entries = Object.entries(ui[lang]);
      const emptyKeys = entries
        .filter(([, value]) => value === '')
        .map(([key]) => key);
      expect(emptyKeys).toEqual([]);
    });
  });
});
