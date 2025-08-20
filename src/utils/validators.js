/**
 * Validation utilities for the cipher app
 */

/**
 * Validates message input text
 * @param {string} text - The text to validate
 * @param {number} maxLength - Maximum allowed length (default 1000)
 * @returns {object} - Validation result with isValid, errors, and warnings
 */
export const validateMessage = (text, maxLength = 1000) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    stats: {
      length: text ? text.length : 0,
      wordCount: text ? text.trim().split(/\s+/).filter(word => word.length > 0).length : 0
    }
  };

  // Check if text is provided
  if (!text || typeof text !== 'string') {
    result.isValid = true; // Empty text is valid, just nothing to encrypt
    return result;
  }

  // Check length limits
  if (text.length > maxLength) {
    result.isValid = false;
    result.errors.push(`Message exceeds maximum length of ${maxLength} characters (current: ${text.length})`);
  }

  // Warnings for very long messages
  if (text.length > maxLength * 0.8) {
    result.warnings.push(`Message is getting long (${text.length}/${maxLength} characters)`);
  }

  // Check for potentially problematic characters
  const hasUnicodeChars = /[^\x00-\x7F]/.test(text);
  if (hasUnicodeChars) {
    result.warnings.push('Message contains non-ASCII characters - only A-Z and a-z will be encrypted');
  }

  return result;
};

/**
 * Validates password/key input
 * @param {string} password - The password to validate
 * @returns {object} - Validation result
 */
export const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    strength: 'none'
  };

  // Empty password is valid (will result in shift 0)
  if (!password || typeof password !== 'string' || password.trim() === '') {
    result.strength = 'none';
    result.warnings.push('No password set - using shift of 0');
    return result;
  }

  const trimmed = password.trim();

  // Check minimum length for educational purposes
  if (trimmed.length < 3) {
    result.warnings.push('Short passwords create predictable shifts');
    result.strength = 'weak';
  } else if (trimmed.length < 8) {
    result.strength = 'medium';
  } else {
    result.strength = 'good';
  }

  // Check for variety in characters
  const hasNumbers = /\d/.test(trimmed);
  const hasUppercase = /[A-Z]/.test(trimmed);
  const hasLowercase = /[a-z]/.test(trimmed);
  const hasSpecial = /[^A-Za-z0-9]/.test(trimmed);

  const varietyCount = [hasNumbers, hasUppercase, hasLowercase, hasSpecial].filter(Boolean).length;

  if (varietyCount >= 3) {
    result.strength = result.strength === 'good' ? 'excellent' : 'good';
  }

  return result;
};

/**
 * Validates shift value (for manual override)
 * @param {number} shift - The shift value to validate
 * @returns {object} - Validation result
 */
export const validateShift = (shift) => {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (shift === null || shift === undefined) {
    return result; // null is valid (means use password-derived shift)
  }

  if (typeof shift !== 'number') {
    result.isValid = false;
    result.errors.push('Shift must be a number');
    return result;
  }

  if (!Number.isInteger(shift)) {
    result.isValid = false;
    result.errors.push('Shift must be a whole number');
    return result;
  }

  if (shift < 0) {
    result.isValid = false;
    result.errors.push('Shift cannot be negative');
    return result;
  }

  if (shift > 25) {
    result.isValid = false;
    result.errors.push('Shift cannot be greater than 25');
    return result;
  }

  // Warnings for specific shift values
  if (shift === 0) {
    result.warnings.push('Shift of 0 means no encryption');
  }

  if (shift === 13) {
    result.warnings.push('Shift of 13 is ROT13 - a well-known cipher');
  }

  return result;
};

/**
 * Validates the overall app state
 * @param {object} state - The current app state
 * @returns {object} - Overall validation result
 */
export const validateAppState = (state) => {
  const { messageText, password, manualShift, maxLength } = state;

  const messageValidation = validateMessage(messageText, maxLength);
  const passwordValidation = validatePassword(password);
  const shiftValidation = validateShift(manualShift);

  return {
    isValid: messageValidation.isValid && passwordValidation.isValid && shiftValidation.isValid,
    message: messageValidation,
    password: passwordValidation,
    shift: shiftValidation,
    canEncrypt: messageText && messageText.trim().length > 0,
    hasKey: password && password.trim().length > 0
  };
};