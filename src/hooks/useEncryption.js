import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  encryptCaesar, 
  decryptCaesar, 
  deriveShiftFromKey,
  analyzeText,
  generateAlphabetMapping,
  bruteForceDecrypt
} from '../utils/cipher';
import { validateMessage, validatePassword, validateShift } from '../utils/validators';

/**
 * Custom hook for encryption/decryption functionality
 * @param {object} options - Configuration options
 * @returns {object} - Encryption state and functions
 */
export const useEncryption = (options = {}) => {
  const {
    defaultText = '',
    defaultKey = '',
    defaultManualShift = null,
    liveEncryption = true,
    maxLength = 1000
  } = options;

  // Core state
  const [plainText, setPlainText] = useState(defaultText);
  const [key, setKey] = useState(defaultKey);
  const [manualShift, setManualShift] = useState(defaultManualShift);
  const [isLive, setIsLive] = useState(liveEncryption);
  const [manualEncryptedText, setManualEncryptedText] = useState(''); // Add this for manual encryption

  // Update key when defaultKey changes (from UserContext)
  useEffect(() => {
    if (defaultKey !== key && defaultKey !== '') {
      setKey(defaultKey);
    }
  }, [defaultKey]); // Don't include 'key' in deps to avoid infinite loop

  // Update live mode when prop changes
  useEffect(() => {
    setIsLive(liveEncryption);
  }, [liveEncryption]);

  // Clear manual encrypted text when switching to live mode
  useEffect(() => {
    if (isLive) {
      setManualEncryptedText('');
    }
  }, [isLive]);

  // Derive shift from key (memoized for performance)
  const keyDerivedShift = useMemo(() => {
    if (!key || key.trim().length === 0) return 0;
    try {
      return deriveShiftFromKey(key);
    } catch (error) {
      console.warn('Error deriving shift from key:', error);
      return 0;
    }
  }, [key]);

  // Determine effective shift (manual override or key-derived)
  const effectiveShift = useMemo(() => {
    if (manualShift !== null && manualShift !== undefined) {
      return Math.max(0, Math.min(25, Math.floor(manualShift)));
    }
    return keyDerivedShift;
  }, [manualShift, keyDerivedShift]);

  // Validate inputs (memoized to prevent unnecessary re-renders)
  const validation = useMemo(() => {
    const messageValidation = validateMessage(plainText, maxLength);
    const passwordValidation = validatePassword(key);
    const shiftValidation = validateShift(manualShift);

    return {
      message: messageValidation,
      password: passwordValidation,
      shift: shiftValidation,
      overall: messageValidation.isValid && passwordValidation.isValid && shiftValidation.isValid
    };
  }, [plainText, key, manualShift, maxLength]);

  // Analyze text (memoized for performance)
  const textAnalysis = useMemo(() => {
    try {
      return analyzeText(plainText);
    } catch (error) {
      console.warn('Error analyzing text:', error);
      return {
        totalChars: plainText.length,
        letters: 0,
        spaces: 0,
        punctuation: 0,
        numbers: 0,
        words: 0
      };
    }
  }, [plainText]);

  // Generate alphabet mapping (memoized)
  const alphabetMapping = useMemo(() => {
    try {
      return generateAlphabetMapping(effectiveShift);
    } catch (error) {
      console.warn('Error generating alphabet mapping:', error);
      return {};
    }
  }, [effectiveShift]);

  // Check if encryption is possible
  const canEncrypt = useMemo(() => {
    return plainText.trim().length > 0 && 
           validation.message.isValid;
  }, [plainText, validation.message]);

  // Check if there's a valid key or manual shift
  const hasValidKey = useMemo(() => {
    return (key.trim().length > 0 && validation.password.isValid) || 
           (manualShift !== null && validation.shift.isValid);
  }, [key, manualShift, validation.password, validation.shift]);

  // Live encrypted text (automatically updates when conditions are met)
  const liveEncryptedText = useMemo(() => {
    // Only encrypt if live mode is on, we can encrypt, and have a valid key
    if (!isLive || !canEncrypt || !hasValidKey) {
      return '';
    }

    try {
      return encryptCaesar(plainText, effectiveShift);
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }, [plainText, effectiveShift, isLive, canEncrypt, hasValidKey]);

  // Return appropriate encrypted text based on mode
  const encryptedText = useMemo(() => {
    return isLive ? liveEncryptedText : manualEncryptedText;
  }, [isLive, liveEncryptedText, manualEncryptedText]);

  // Manual encrypt function
  const encrypt = useCallback((text = plainText, shift = effectiveShift) => {
    try {
      if (!text || text.trim().length === 0) return '';
      return encryptCaesar(text, shift);
    } catch (error) {
      console.error('Manual encryption error:', error);
      return '';
    }
  }, [plainText, effectiveShift]);

  // Set encrypted text function for manual mode
  const setEncryptedText = useCallback((text) => {
    if (!isLive) {
      setManualEncryptedText(text || '');
    }
  }, [isLive]);

  // Manual decrypt function
  const decrypt = useCallback((text, shift = effectiveShift) => {
    try {
      if (!text || text.trim().length === 0) return '';
      return decryptCaesar(text, shift);
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }, [effectiveShift]);

  // Brute force decrypt function
  const bruteForce = useCallback((cipherText) => {
    try {
      if (!cipherText || cipherText.trim().length === 0) return [];
      return bruteForceDecrypt(cipherText);
    } catch (error) {
      console.error('Brute force error:', error);
      return [];
    }
  }, []);

  // Reset function
  const reset = useCallback(() => {
    setPlainText('');
    setKey('');
    setManualShift(null);
    setManualEncryptedText('');
  }, []);

  // Toggle live encryption
  const toggleLive = useCallback(() => {
    setIsLive(prev => !prev);
  }, []);

  // Safe setters with validation
  const safeSetPlainText = useCallback((text) => {
    if (typeof text === 'string') {
      setPlainText(text);
    }
  }, []);

  const safeSetKey = useCallback((newKey) => {
    if (typeof newKey === 'string') {
      setKey(newKey);
    }
  }, []);

  const safeSetManualShift = useCallback((shift) => {
    if (shift === null || shift === undefined) {
      setManualShift(null);
    } else if (typeof shift === 'number' && !isNaN(shift)) {
      setManualShift(Math.max(0, Math.min(25, Math.floor(shift))));
    }
  }, []);

  // Return all the state and functions
  return {
    // Core state
    plainText,
    key,
    manualShift,
    isLive,
    encryptedText,
    
    // Computed values
    effectiveShift,
    keyDerivedShift,
    validation,
    textAnalysis,
    alphabetMapping,
    canEncrypt,
    hasValidKey,
    
    // Safe setters
    setPlainText: safeSetPlainText,
    setKey: safeSetKey,
    setManualShift: safeSetManualShift,
    setEncryptedText, // Add this function
    setIsLive,
    toggleLive,
    
    // Functions
    encrypt,
    decrypt,
    bruteForce,
    reset
  };
};