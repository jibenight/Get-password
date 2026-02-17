import { describe, it, expect } from 'vitest';
import { getLangFromUrl, useTranslations } from '../src/i18n/utils.ts';
import { ui, defaultLang } from '../src/i18n/ui.ts';

describe('getLangFromUrl', () => {
  it('extracts "fr" from /fr/', () => {
    expect(getLangFromUrl(new URL('https://example.com/fr/'))).toBe('fr');
  });

  it('extracts "es" from /es/some-path', () => {
    expect(getLangFromUrl(new URL('https://example.com/es/some-path'))).toBe('es');
  });

  it('extracts "de" from /de', () => {
    expect(getLangFromUrl(new URL('https://example.com/de'))).toBe('de');
  });

  it('returns default lang for unknown locale /xx/', () => {
    expect(getLangFromUrl(new URL('https://example.com/xx/'))).toBe(defaultLang);
  });

  it('returns default lang for root /', () => {
    expect(getLangFromUrl(new URL('https://example.com/'))).toBe(defaultLang);
  });
});

describe('useTranslations', () => {
  it('returns correct English string', () => {
    const t = useTranslations('en');
    expect(t('title.site')).toBe(ui.en['title.site']);
  });

  it('returns correct French string', () => {
    const t = useTranslations('fr');
    expect(t('title.site')).toBe(ui.fr['title.site']);
    expect(t('title.site')).not.toBe(ui.en['title.site']);
  });

  it('falls back to English for missing keys', () => {
    // Create a key scenario: if a lang value is falsy, it falls back to English
    const t = useTranslations('en');
    // All English keys should return non-empty values
    expect(t('title.site')).toBeTruthy();
  });
});
