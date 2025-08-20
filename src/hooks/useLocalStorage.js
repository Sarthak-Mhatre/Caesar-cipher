import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for localStorage with React state synchronization
 * 
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if nothing in localStorage
 * @returns {[any, Function, Function]} - [value, setValue, removeValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

/**
 * Specialized hook for cipher app preferences
 * Manages multiple localStorage keys for the cipher app
 */
export const useCipherStorage = () => {
  const [username, setUsername, removeUsername] = useLocalStorage('cipher-username', '');
  const [lastPassword, setLastPassword, removeLastPassword] = useLocalStorage('cipher-last-password', '');
  const [preferences, setPreferences, removePreferences] = useLocalStorage('cipher-preferences', {
    liveEncryption: true,
    theme: 'light',
    maxLength: 1000,
    showAlphabetMapping: false,
    showTextAnalysis: true
  });

  // Update individual preferences
  const updatePreference = useCallback((key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, [setPreferences]);

  // Clear all cipher data
  const clearAll = useCallback(() => {
    removeUsername();
    removeLastPassword();
    removePreferences();
  }, [removeUsername, removeLastPassword, removePreferences]);

  // Export data for backup
  const exportData = useCallback(() => {
    return {
      username,
      lastPassword,
      preferences,
      exportDate: new Date().toISOString()
    };
  }, [username, lastPassword, preferences]);

  // Import data from backup
  const importData = useCallback((data) => {
    try {
      if (data.username !== undefined) setUsername(data.username);
      if (data.lastPassword !== undefined) setLastPassword(data.lastPassword);
      if (data.preferences !== undefined) setPreferences(data.preferences);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [setUsername, setLastPassword, setPreferences]);

  return {
    username,
    setUsername,
    lastPassword,
    setLastPassword,
    preferences,
    setPreferences,
    updatePreference,
    clearAll,
    exportData,
    importData
  };
};