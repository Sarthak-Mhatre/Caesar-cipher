/**
 * Unit tests for cipher utilities
 * Run with: npm test
 */

import { describe, test, expect } from 'vitest';
import { 
  deriveShiftFromKey, 
  encryptCaesar, 
  decryptCaesar, 
  isValidShift,
  analyzeText,
  generateAlphabetMapping,
  bruteForceDecrypt
} from '../utils/cipher.js';

describe('deriveShiftFromKey', () => {
  test('should return 0 for empty or null key', () => {
    expect(deriveShiftFromKey('')).toBe(0);
    expect(deriveShiftFromKey(null)).toBe(0);
    expect(deriveShiftFromKey(undefined)).toBe(0);
    expect(deriveShiftFromKey('   ')).toBe(0);
  });

  test('should return consistent shift for same key', () => {
    const shift1 = deriveShiftFromKey('password');
    const shift2 = deriveShiftFromKey('password');
    expect(shift1).toBe(shift2);
  });

  test('should return different shifts for different keys', () => {
    const shift1 = deriveShiftFromKey('password');
    const shift2 = deriveShiftFromKey('different');
    expect(shift1).not.toBe(shift2);
  });

  test('should return value between 0-25', () => {
    const shifts = [
      deriveShiftFromKey('a'),
      deriveShiftFromKey('test'),
      deriveShiftFromKey('verylongpassword'),
      deriveShiftFromKey('123456'),
      deriveShiftFromKey('special!@#$%')
    ];

    shifts.forEach(shift => {
      expect(shift).toBeGreaterThanOrEqual(0);
      expect(shift).toBeLessThanOrEqual(25);
      expect(Number.isInteger(shift)).toBe(true);
    });
  });
});

describe('encryptCaesar', () => {
  test('should handle empty input', () => {
    expect(encryptCaesar('', 5)).toBe('');
    expect(encryptCaesar(null, 5)).toBe('');
    expect(encryptCaesar(undefined, 5)).toBe('');
  });

  test('should encrypt basic text correctly', () => {
    expect(encryptCaesar('ABC', 3)).toBe('DEF');
    expect(encryptCaesar('abc', 3)).toBe('def');
    expect(encryptCaesar('XYZ', 3)).toBe('ABC'); // wrap around
    expect(encryptCaesar('xyz', 3)).toBe('abc'); // wrap around
  });

  test('should preserve non-letter characters', () => {
    expect(encryptCaesar('Hello, World! 123', 3)).toBe('Khoor, Zruog! 123');
    expect(encryptCaesar('Test @#$ 456', 1)).toBe('Uftu @#$ 456');
  });

  test('should handle shift of 0', () => {
    const text = 'Hello World!';
    expect(encryptCaesar(text, 0)).toBe(text);
  });

  test('should handle negative shift', () => {
    expect(encryptCaesar('ABC', -1)).toBe('ABC'); // should treat as 0
  });

  test('should normalize large shifts', () => {
    expect(encryptCaesar('ABC', 29)).toBe('DEF'); // 29 % 26 = 3
    expect(encryptCaesar('ABC', 52)).toBe('ABC'); // 52 % 26 = 0
  });
});

describe('decryptCaesar', () => {
  test('should decrypt correctly', () => {
    expect(decryptCaesar('DEF', 3)).toBe('ABC');
    expect(decryptCaesar('def', 3)).toBe('abc');
    expect(decryptCaesar('ABC', 3)).toBe('XYZ'); // wrap around
  });

  test('should be inverse of encrypt', () => {
    const original = 'Hello, World! 123';
    const shift = 7;
    const encrypted = encryptCaesar(original, shift);
    const decrypted = decryptCaesar(encrypted, shift);
    expect(decrypted).toBe(original);
  });

  test('should handle multiple rounds', () => {
    const text = 'Secret Message!';
    let result = text;
    
    // Encrypt 5 times
    for (let i = 0; i < 5; i++) {
      result = encryptCaesar(result, 3);
    }
    
    // Decrypt 5 times
    for (let i = 0; i < 5; i++) {
      result = decryptCaesar(result, 3);
    }
    
    expect(result).toBe(text);
  });
});

describe('isValidShift', () => {
  test('should validate correct shifts', () => {
    for (let i = 0; i <= 25; i++) {
      expect(isValidShift(i)).toBe(true);
    }
  });

  test('should reject invalid shifts', () => {
    expect(isValidShift(-1)).toBe(false);
    expect(isValidShift(26)).toBe(false);
    expect(isValidShift(3.5)).toBe(false);
    expect(isValidShift('5')).toBe(false);
    expect(isValidShift(null)).toBe(false);
    expect(isValidShift(undefined)).toBe(false);
  });
});

describe('analyzeText', () => {
  test('should analyze empty text', () => {
    const result = analyzeText('');
    expect(result).toEqual({
      totalChars: 0,
      letters: 0,
      spaces: 0,
      punctuation: 0,
      numbers: 0,
      words: 0
    });
  });

  test('should count different character types', () => {
    const result = analyzeText('Hello, World! 123');
    expect(result.letters).toBe(10); // H,e,l,l,o,W,o,r,l,d
    expect(result.spaces).toBe(2);
    expect(result.punctuation).toBe(2); // comma and exclamation
    expect(result.numbers).toBe(3); // 1,2,3
    expect(result.totalChars).toBe(17);
    expect(result.words).toBe(3); // Hello, World, 123
  });
});

describe('generateAlphabetMapping', () => {
  test('should generate correct mapping for shift 3', () => {
    const mapping = generateAlphabetMapping(3);
    expect(mapping['A']).toBe('D');
    expect(mapping['Z']).toBe('C');
    expect(mapping['a']).toBe('d');
    expect(mapping['z']).toBe('c');
  });

  test('should handle invalid shifts', () => {
    expect(generateAlphabetMapping(-1)).toEqual({});
    expect(generateAlphabetMapping(26)).toEqual({});
    expect(generateAlphabetMapping('invalid')).toEqual({});
  });
});

describe('bruteForceDecrypt', () => {
  test('should return all possible decryptions', () => {
    const encrypted = encryptCaesar('HELLO', 5);
    const results = bruteForceDecrypt(encrypted);
    
    expect(results).toHaveLength(26);
    expect(results[5].text).toBe('HELLO'); // shift 5 should give original
    expect(results[5].shift).toBe(5);
  });

  test('should handle empty input', () => {
    expect(bruteForceDecrypt('')).toEqual([]);
    expect(bruteForceDecrypt(null)).toEqual([]);
  });
});