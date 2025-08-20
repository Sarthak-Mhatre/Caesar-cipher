/**
 * Derives a shift value (0-25) from a password/key string
 * This is a simple educational implementation - NOT secure for real use
 * @param {string} key - The password/key string
 * @returns {number} - Shift value between 0-25
 */
export const deriveShiftFromKey = (key) => {
  if (!key || typeof key !== 'string' || key.trim() === '') return 0;
  
  // More sophisticated derivation: use character codes with position weighting
  let sum = 0;
  const trimmedKey = key.trim();
  
  for (let i = 0; i < trimmedKey.length; i++) {
    const charCode = trimmedKey.charCodeAt(i);
    // Weight each character by its position to make different arrangements matter
    sum += charCode * (i + 1);
  }
  
  // Ensure we get a number between 0-25
  const shift = sum % 26;
  return shift;
};

/**
 * Encrypts text using Caesar cipher
 * @param {string} text - The text to encrypt
 * @param {number} shift - The shift amount (0-25)
 * @returns {string} - The encrypted text
 */
export const encryptCaesar = (text, shift) => {
  if (!text || typeof text !== 'string') return '';
  if (typeof shift !== 'number' || shift < 0) shift = 0;
  
  // Normalize shift to 0-25 range
  shift = Math.abs(Math.floor(shift)) % 26;
  
  return text
    .split('')
    .map(char => shiftChar(char, shift))
    .join('');
};

/**
 * Decrypts text using Caesar cipher
 * @param {string} text - The text to decrypt
 * @param {number} shift - The shift amount (0-25)
 * @returns {string} - The decrypted text
 */
export const decryptCaesar = (text, shift) => {
  if (!text || typeof text !== 'string') return '';
  if (typeof shift !== 'number' || shift < 0) shift = 0;
  
  // For decryption, we shift backwards
  shift = Math.abs(Math.floor(shift)) % 26;
  const reverseShift = (26 - shift) % 26;
  
  return text
    .split('')
    .map(char => shiftChar(char, reverseShift))
    .join('');
};

/**
 * Shifts a single character by the given amount
 * @param {string} char - Single character to shift
 * @param {number} shift - Amount to shift
 * @returns {string} - Shifted character
 */
const shiftChar = (char, shift) => {
  // Check if it's an uppercase letter (A-Z)
  if (char >= 'A' && char <= 'Z') {
    const charCode = char.charCodeAt(0);
    const shifted = ((charCode - 65 + shift) % 26) + 65;
    return String.fromCharCode(shifted);
  }
  
  // Check if it's a lowercase letter (a-z)
  if (char >= 'a' && char <= 'z') {
    const charCode = char.charCodeAt(0);
    const shifted = ((charCode - 97 + shift) % 26) + 97;
    return String.fromCharCode(shifted);
  }
  
  // If it's not a letter, return as-is (preserve spaces, punctuation, numbers)
  return char;
};

/**
 * Validates if a shift value is valid (0-25)
 * @param {number} shift - The shift to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidShift = (shift) => {
  return typeof shift === 'number' && 
         Number.isInteger(shift) && 
         shift >= 0 && 
         shift <= 25;
};

/**
 * Analyzes text and returns statistics
 * @param {string} text - The text to analyze
 * @returns {object} - Statistics about the text
 */
export const analyzeText = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      totalChars: 0,
      letters: 0,
      spaces: 0,
      punctuation: 0,
      numbers: 0,
      words: 0
    };
  }

  let letters = 0;
  let spaces = 0;
  let punctuation = 0;
  let numbers = 0;

  for (const char of text) {
    if (/[a-zA-Z]/.test(char)) {
      letters++;
    } else if (char === ' ') {
      spaces++;
    } else if (/[0-9]/.test(char)) {
      numbers++;
    } else if (/[^\w\s]/.test(char)) {
      punctuation++;
    }
  }

  // Simple word count (split by spaces and filter empty strings)
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return {
    totalChars: text.length,
    letters,
    spaces,
    punctuation,
    numbers,
    words
  };
};

/**
 * Generates a visual mapping of the alphabet shift
 * @param {number} shift - The shift amount
 * @returns {object} - Mapping of original to encrypted letters
 */
export const generateAlphabetMapping = (shift) => {
  if (!isValidShift(shift)) return {};

  const mapping = {};
  
  // Generate uppercase mapping
  for (let i = 0; i < 26; i++) {
    const originalChar = String.fromCharCode(65 + i); // A-Z
    const shiftedChar = shiftChar(originalChar, shift);
    mapping[originalChar] = shiftedChar;
  }
  
  // Generate lowercase mapping
  for (let i = 0; i < 26; i++) {
    const originalChar = String.fromCharCode(97 + i); // a-z
    const shiftedChar = shiftChar(originalChar, shift);
    mapping[originalChar] = shiftedChar;
  }

  return mapping;
};

/**
 * Attempts to break a Caesar cipher by trying all possible shifts
 * Educational feature to show cipher weakness
 * @param {string} cipherText - The encrypted text
 * @returns {Array} - Array of all possible decryptions
 */
export const bruteForceDecrypt = (cipherText) => {
  if (!cipherText || typeof cipherText !== 'string') return [];

  const results = [];
  
  for (let shift = 0; shift < 26; shift++) {
    const decrypted = decryptCaesar(cipherText, shift);
    results.push({
      shift,
      text: decrypted,
      preview: decrypted.substring(0, 50) + (decrypted.length > 50 ? '...' : '')
    });
  }
  
  return results;
};