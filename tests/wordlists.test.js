import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const wordsDir = join(import.meta.dirname, '..', 'public', 'words');
const langDirs = readdirSync(wordsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

describe('word lists', () => {
  it('has at least one language directory', () => {
    expect(langDirs.length).toBeGreaterThan(0);
  });

  describe.each(langDirs)('language "%s"', (lang) => {
    const filePath = join(wordsDir, lang, 'words-compact.json');
    let data;

    it('has a words-compact.json file that is valid JSON', () => {
      const raw = readFileSync(filePath, 'utf-8');
      data = JSON.parse(raw);
      expect(data).toHaveProperty('words');
      expect(Array.isArray(data.words)).toBe(true);
    });

    it('has at least 400 words', () => {
      data ??= JSON.parse(readFileSync(filePath, 'utf-8'));
      expect(data.words.length).toBeGreaterThanOrEqual(400);
    });

    it('has no empty strings', () => {
      data ??= JSON.parse(readFileSync(filePath, 'utf-8'));
      const empty = data.words.filter((w) => typeof w !== 'string' || w.trim() === '');
      expect(empty).toEqual([]);
    });

    it('all words are at most 50 characters', () => {
      data ??= JSON.parse(readFileSync(filePath, 'utf-8'));
      const tooLong = data.words.filter((w) => w.length > 50);
      expect(tooLong).toEqual([]);
    });
  });
});
