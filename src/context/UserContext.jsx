// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create the context
// const UserContext = createContext();

// // Custom hook to use the context
// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };

// // UserProvider component
// export const UserProvider = ({ children }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [liveEncryption, setLiveEncryption] = useState(true);

//   // Load saved data from localStorage on mount
//   useEffect(() => {
//     try {
//       const savedUsername = localStorage.getItem('cipher-username');
//       const savedPassword = localStorage.getItem('cipher-password');
//       const savedLiveEncryption = localStorage.getItem('cipher-live-encryption');

//       if (savedUsername) setUsername(savedUsername);
//       if (savedPassword) setPassword(savedPassword);
//       if (savedLiveEncryption !== null) {
//         setLiveEncryption(JSON.parse(savedLiveEncryption));
//       }
//     } catch (error) {
//       console.warn('Failed to load user data from localStorage:', error);
//     }
//   }, []);

//   // Save username to localStorage when it changes
//   useEffect(() => {
//     if (username) {
//       try {
//         localStorage.setItem('cipher-username', username);
//       } catch (error) {
//         console.warn('Failed to save username to localStorage:', error);
//       }
//     }
//   }, [username]);

//   // Save password to localStorage when it changes (with user awareness)
//   useEffect(() => {
//     if (password) {
//       try {
//         localStorage.setItem('cipher-password', password);
//       } catch (error) {
//         console.warn('Failed to save password to localStorage:', error);
//       }
//     }
//   }, [password]);

//   // Save live encryption preference
//   useEffect(() => {
//     try {
//       localStorage.setItem('cipher-live-encryption', JSON.stringify(liveEncryption));
//     } catch (error) {
//       console.warn('Failed to save live encryption preference:', error);
//     }
//   }, [liveEncryption]);

//   // Clear user data
//   const clearUserData = () => {
//     setUsername('');
//     setPassword('');
//     setLiveEncryption(true);
//     try {
//       localStorage.removeItem('cipher-username');
//       localStorage.removeItem('cipher-password');
//       localStorage.removeItem('cipher-live-encryption');
//     } catch (error) {
//       console.warn('Failed to clear user data from localStorage:', error);
//     }
//   };

//   const value = {
//     // State
//     username,
//     password,
//     liveEncryption,
//     // Setters
//     setUsername,
//     setPassword,
//     setLiveEncryption,
//     // Actions
//     clearUserData,
//   };

//   return (
//     <UserContext.Provider value={value}>
//       {children}
//     </UserContext.Provider>
//   );
// };

import React, { createContext, useContext, useState } from 'react';
import { useCipherStorage } from '../hooks/useLocalStorage';

// Create the context
const UserContext = createContext();

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component
export const UserProvider = ({ children }) => {
  const [password, setPassword] = useState('');
  
  // Use our custom storage hook for persistence
  const {
    username,
    setUsername,
    lastPassword,
    setLastPassword,
    preferences,
    updatePreference,
    clearAll,
    exportData,
    importData
  } = useCipherStorage();

  // Convenience getter for live encryption preference
  const liveEncryption = preferences.liveEncryption;
  const setLiveEncryption = (value) => updatePreference('liveEncryption', value);

  // Enhanced clear function
  const clearUserData = () => {
    setPassword('');
    clearAll();
  };

  // Save current password as last used (optional - for UX)
  const saveCurrentPassword = () => {
    if (password.trim()) {
      setLastPassword(password);
    }
  };

  // Load last used password
  const loadLastPassword = () => {
    if (lastPassword) {
      setPassword(lastPassword);
    }
  };

  const value = {
    // State
    username,
    password,
    liveEncryption,
    lastPassword,
    preferences,
    
    // Setters
    setUsername,
    setPassword,
    setLiveEncryption,
    updatePreference,
    
    // Actions
    clearUserData,
    saveCurrentPassword,
    loadLastPassword,
    exportData,
    importData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};