import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value
 * Useful for preventing excessive API calls or heavy computations during typing
 * 
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} - The debounced value
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay completes
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for debounced callback function
 * Useful when you want to debounce a function call rather than a value
 * 
 * @param {Function} callback - The function to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {Function} - The debounced function
 */
export const useDebouncedCallback = (callback, delay = 300) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const debouncedCallback = (...args) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    const newTimeoutId = setTimeout(() => {
      callback(...args);
      setTimeoutId(null);
    }, delay);

    setTimeoutId(newTimeoutId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
};

/**
 * Hook for debounced encryption (specialized for our cipher app)
 * Combines debouncing with encryption logic
 * 
 * @param {string} text - Text to encrypt
 * @param {number} shift - Cipher shift
 * @param {Function} encryptFn - Encryption function
 * @param {number} delay - Debounce delay (default: 150ms for real-time feel)
 * @returns {object} - Debounced encrypted text and loading state
 */
export const useDebouncedEncryption = (text, shift, encryptFn, delay = 150) => {
  const [encryptedText, setEncryptedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Debounce the text input
  const debouncedText = useDebouncedValue(text, delay);
  const debouncedShift = useDebouncedValue(shift, delay);

  useEffect(() => {
    if (!debouncedText.trim()) {
      setEncryptedText('');
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);

    // Small delay to show processing state (optional)
    const processTimeout = setTimeout(() => {
      try {
        const result = encryptFn(debouncedText, debouncedShift);
        setEncryptedText(result);
      } catch (error) {
        console.error('Encryption error:', error);
        setEncryptedText('Error during encryption');
      } finally {
        setIsProcessing(false);
      }
    }, 10);

    return () => clearTimeout(processTimeout);
  }, [debouncedText, debouncedShift, encryptFn]);

  return {
    encryptedText,
    isProcessing,
    isDebouncing: text !== debouncedText || shift !== debouncedShift
  };
};