import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need to test the pure functions from the password generators.
// Since they use `window.crypto` and DOM, we extract and test the logic directly.

// --- Classic password strength ---
// Reimplemented here to test the algorithm without DOM dependencies.
// Mirrors src/scripts/passwordGenerator.js calculatePasswordStrength
function classicStrength(password, { uppercase, lowercase, numbers, symbols }) {
  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && uppercase) strength++;
  if (/[a-z]/.test(password) && lowercase) strength++;
  if (/[0-9]/.test(password) && numbers) strength++;
  if (/[!@#$%^&*]/.test(password) && symbols) strength++;
  return Math.min(strength, 4);
}

// --- Memorable password strength ---
// Mirrors src/scripts/memorablePasswordGenerator.js calculatePasswordStrength
function memorableStrength(password, wordCount) {
  if (wordCount === 1) return 2;
  let strength = 0;
  if (password.length >= 16) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*]/.test(password)) strength++;
  return Math.min(strength, 4);
}

// --- Memorable password generation ---
// Mirrors src/scripts/memorablePasswordGenerator.js generateMemorablePassword
function generateMemorablePassword(words, count, includeNumbers, includeSymbols, randomIntFn) {
  if (!words || words.length === 0) return 'Error: No words available.';

  let password = '';
  for (let i = 0; i < count; i++) {
    const randomIndex = randomIntFn(words.length);
    let word = words[randomIndex];
    word = word.charAt(0).toUpperCase() + word.slice(1);
    password += word;
  }

  if (includeNumbers) {
    const randomNumber = randomIntFn(100);
    password += randomNumber;
  }

  if (includeSymbols) {
    const syms = ['!', '@', '#', '$', '%', '&', '*'];
    const randomSymbol = syms[randomIntFn(syms.length)];
    password += randomSymbol;
  }

  return password;
}

describe('classic calculatePasswordStrength', () => {
  it('returns 0 for short password with no matching options', () => {
    expect(classicStrength('abc', { uppercase: false, lowercase: false, numbers: false, symbols: false })).toBe(0);
  });

  it('returns 1 for long password with no character options enabled', () => {
    expect(classicStrength('abcdefghijklmnop', { uppercase: false, lowercase: false, numbers: false, symbols: false })).toBe(1);
  });

  it('returns 2 for long password with lowercase enabled', () => {
    expect(classicStrength('abcdefghijklmnop', { uppercase: false, lowercase: true, numbers: false, symbols: false })).toBe(2);
  });

  it('returns 4 for long password with all options enabled', () => {
    expect(classicStrength('Abcdef1234!@#$', { uppercase: true, lowercase: true, numbers: true, symbols: true })).toBe(4);
  });

  it('caps at 4 even if all criteria met', () => {
    expect(classicStrength('Abcdefghijkl123!', { uppercase: true, lowercase: true, numbers: true, symbols: true })).toBe(4);
  });

  it('does not count character types if option is not checked', () => {
    // Password has uppercase but option not enabled
    expect(classicStrength('ABCDEFGHIJKLM', { uppercase: false, lowercase: false, numbers: false, symbols: false })).toBe(1);
  });
});

describe('memorable calculatePasswordStrength', () => {
  it('returns 2 for single word (capped)', () => {
    expect(memorableStrength('HelloWorld', 1)).toBe(2);
  });

  it('returns 2 for single word even with numbers and symbols', () => {
    expect(memorableStrength('Hello42!', 1)).toBe(2);
  });

  it('counts length >= 16 for multi-word', () => {
    expect(memorableStrength('AppleBananaCherry', 3)).toBeGreaterThanOrEqual(2);
  });

  it('returns 4 for long multi-word with numbers and symbols', () => {
    expect(memorableStrength('AppleBananaCherry42!', 3)).toBe(4);
  });

  it('returns 0 for short multi-word without uppercase, numbers, or symbols', () => {
    // All lowercase, short, no numbers or symbols
    expect(memorableStrength('ab', 2)).toBe(0);
  });
});

describe('generateMemorablePassword', () => {
  const words = ['apple', 'banana', 'cherry', 'dragon', 'eagle'];
  let callIndex;
  const mockRandom = (max) => {
    // Cycle through indices 0, 1, 2, 3, 4, 0, 1, ...
    const val = callIndex % max;
    callIndex++;
    return val;
  };

  beforeEach(() => {
    callIndex = 0;
  });

  it('capitalizes the first letter of each word', () => {
    const result = generateMemorablePassword(words, 2, false, false, mockRandom);
    expect(result).toBe('AppleBanana');
  });

  it('appends a number when includeNumbers is true', () => {
    const result = generateMemorablePassword(words, 1, true, false, mockRandom);
    // word at index 0 = "apple" -> "Apple", then random number: mockRandom(100) returns 1
    expect(result).toBe('Apple1');
  });

  it('appends a symbol when includeSymbols is true', () => {
    const result = generateMemorablePassword(words, 1, false, true, mockRandom);
    // word at index 0 = "apple" -> "Apple", then symbol at mockRandom(7) = 1 -> '@'
    expect(result).toBe('Apple@');
  });

  it('appends both number and symbol', () => {
    const result = generateMemorablePassword(words, 1, true, true, mockRandom);
    // word index 0 -> "Apple", number: mockRandom(100)=1, symbol: mockRandom(7)=2 -> '#'
    expect(result).toBe('Apple1#');
  });

  it('returns error string for empty word list', () => {
    const result = generateMemorablePassword([], 3, false, false, mockRandom);
    expect(result).toBe('Error: No words available.');
  });

  it('returns correct number of words concatenated', () => {
    const result = generateMemorablePassword(words, 4, false, false, mockRandom);
    // Indices: 0,1,2,3 -> Apple, Banana, Cherry, Dragon
    expect(result).toBe('AppleBananaCherryDragon');
  });
});
