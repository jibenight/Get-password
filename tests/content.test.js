import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const contentsDir = join(import.meta.dirname, '..', 'src', 'contents');
const langDirs = readdirSync(contentsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const requiredFiles = [
  'secure_passwords.md',
  'memorization_tips.md',
  'password_manager_guide.md',
];

const filesWithDescription2 = [
  'secure_passwords.md',
  'password_manager_guide.md',
];

/**
 * Parses YAML frontmatter from a markdown file.
 * Returns an object with the frontmatter fields.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith("'") && value.endsWith("'")) ||
        (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }

  return frontmatter;
}

describe('markdown content', () => {
  it('has at least one language directory', () => {
    expect(langDirs.length).toBeGreaterThan(0);
  });

  describe.each(langDirs)('language "%s"', (lang) => {
    for (const file of requiredFiles) {
      const filePath = join(contentsDir, lang, file);

      it(`has ${file}`, () => {
        expect(existsSync(filePath)).toBe(true);
      });

      it(`${file} has valid frontmatter with title, description, layout`, () => {
        const content = readFileSync(filePath, 'utf-8');
        const fm = parseFrontmatter(content);

        expect(fm).not.toBeNull();
        expect(fm.title).toBeTruthy();
        expect(fm.description).toBeTruthy();
        expect(fm.layout).toBe('../../layouts/MarkdownLayout.astro');
      });

      if (filesWithDescription2.includes(file)) {
        it(`${file} has description2`, () => {
          const content = readFileSync(filePath, 'utf-8');
          const fm = parseFrontmatter(content);
          expect(fm).not.toBeNull();
          expect(fm.description2).toBeTruthy();
        });
      }
    }
  });
});
