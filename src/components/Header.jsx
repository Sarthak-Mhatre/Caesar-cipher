import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const Header = () => {
  const { 
    username, 
    setUsername, 
    clearUserData, 
    preferences 
  } = useUser();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(username);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUsername(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(username);
    setIsEditingName(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-3.243a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CipherBox</h1>
              <p className="text-xs text-gray-500">Educational Caesar Cipher</p>
            </div>
          </div>

          {/* User Area */}
          <div className="flex items-center gap-4">
            
            {/* User Info/Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {username ? username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">
                    {username || 'Anonymous User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {preferences.liveEncryption ? 'Live Mode' : 'Manual Mode'}
                  </div>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                  <div className="p-4">
                    
                    {/* Username Edit */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      {isEditingName ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Enter your name"
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveName}
                            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-800">
                            {username || 'Not set'}
                          </span>
                          <button
                            onClick={() => {
                              setTempName(username);
                              setIsEditingName(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Mode:</span>
                          <span className={preferences.liveEncryption ? 'text-green-600' : 'text-orange-600'}>
                            {preferences.liveEncryption ? 'Live Encryption' : 'Manual'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Length:</span>
                          <span>{preferences.maxLength} chars</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <button
                        onClick={() => {
                          if (confirm('This will clear all your settings and data. Continue?')) {
                            clearUserData();
                            setShowUserMenu(false);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Clear All Data
                        </div>
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Help Button */}
            <button
              onClick={() => alert('CipherBox Help:\n\n1. Enter a password to generate your unique shift\n2. Type your message in the left panel\n3. See encrypted result in the right panel\n4. Use manual shift for teaching/demos\n\nRemember: This is educational - not secure!')}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Help & Instructions"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default Header;