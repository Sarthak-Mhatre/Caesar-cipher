import React, { createContext, useContext, useMemo } from 'react';
import { useUser } from './UserContext';
import { deriveShiftFromKey, encryptCaesar, decryptCaesar } from '../utils/cipher';

// Create the context
const EncryptionContext = createContext();

// Custom hook to use the context
export const useEncryption = () => {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};

// EncryptionProvider component
export const EncryptionProvider = ({ children }) => {
  const { password } = useUser();

  // Memoize the shift calculation to avoid recalculating on every render
  const currentShift = useMemo(() => {
    return password ? deriveShiftFromKey(password) : 0;
  }, [password]);

  // Memoize the encrypt function
  const encrypt = useMemo(() => {
    return (text, customShift = null) => {
      const shift = customShift !== null ? customShift : currentShift;
      return encryptCaesar(text, shift);
    };
  }, [currentShift]);

  // Memoize the decrypt function
  const decrypt = useMemo(() => {
    return (text, customShift = null) => {
      const shift = customShift !== null ? customShift : currentShift;
      return decryptCaesar(text, shift);
    };
  }, [currentShift]);

  const value = {
    currentShift,
    encrypt,
    decrypt,
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
};