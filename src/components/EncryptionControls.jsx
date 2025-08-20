import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const EncryptionControls = ({ encryptionState, className = '' }) => {
  const { 
    setPassword, 
    liveEncryption, 
    setLiveEncryption,
    preferences,
    updatePreference 
  } = useUser();

  const {
    key,
    manualShift,
    effectiveShift,
    keyDerivedShift,
    setKey,
    setManualShift,
    validation,
    reset,
    toggleLive,
    encrypt,
    plainText,
    setEncryptedText
  } = encryptionState;

  const [showPassword, setShowPassword] = useState(false);
  const [useManualShift, setUseManualShift] = useState(false);

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setKey(value);
    setPassword(value);
  };

  const handleManualShiftChange = (e) => {
    const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
    setManualShift(value);
  };

  const handleToggleManualShift = () => {
    if (useManualShift) {
      setManualShift(null);
    } else {
      setManualShift(keyDerivedShift);
    }
    setUseManualShift(!useManualShift);
  };

  const handleLiveToggle = () => {
    const newValue = !liveEncryption;
    setLiveEncryption(newValue);
    toggleLive();
  };

  // Handler for manual encrypt button
  const handleManualEncrypt = () => {
    if (!liveEncryption && typeof encrypt === 'function' && typeof setEncryptedText === 'function') {
      setEncryptedText(encrypt(plainText));
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Encryption Controls
        </h2>
        {/* Live encryption toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Live encryption:</span>
          <button
            onClick={handleLiveToggle}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${liveEncryption 
                ? 'bg-blue-600' 
                : 'bg-gray-300'
              }
            `}
          >
            <span className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${liveEncryption ? 'translate-x-6' : 'translate-x-1'}
            `} />
          </button>
          <span className={`text-xs ${liveEncryption ? 'text-blue-600' : 'text-gray-500'}`}>
            {liveEncryption ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password / Key
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={key}
              onChange={handlePasswordChange}
              placeholder="Enter password — used to derive your personal shift"
              className={`
                w-full px-3 py-2 border rounded-lg pr-10
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${!validation.password.isValid 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300'
                }
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          {key && (
            <div className="text-sm text-gray-600">
              Derived shift: <span className="font-mono font-medium">{keyDerivedShift}</span>
            </div>
          )}
          
          {!validation.password.isValid && validation.password.errors.length > 0 && (
            <div className="text-sm text-red-600">
              {validation.password.errors[0]}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Different password = different shift. This is educational only.
          </div>
        </div>

        {/* Manual Shift Override */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Manual Shift (Teaching Mode)
            </label>
            <button
              onClick={handleToggleManualShift}
              className={`
                text-xs px-2 py-1 rounded-full transition-colors
                ${useManualShift 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              {useManualShift ? 'Manual' : 'Auto'}
            </button>
          </div>
          
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="25"
              value={manualShift || keyDerivedShift}
              onChange={(e) => handleManualShiftChange(e)}
              disabled={!useManualShift}
              className={`
                w-full h-2 rounded-lg appearance-none cursor-pointer
                ${useManualShift 
                  ? 'bg-purple-200 slider-thumb:bg-purple-600' 
                  : 'bg-gray-200 slider-thumb:bg-gray-400'
                }
              `}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span className="font-medium">
                Current: {effectiveShift}
              </span>
              <span>25</span>
            </div>
            <input
              type="number"
              min="0"
              max="25"
              value={manualShift || ''}
              onChange={handleManualShiftChange}
              disabled={!useManualShift}
              placeholder="0-25"
              className={`
                w-full px-3 py-2 border rounded-lg text-center
                focus:outline-none focus:ring-2
                ${useManualShift 
                  ? 'border-purple-300 focus:ring-purple-500' 
                  : 'border-gray-300 bg-gray-100 text-gray-500'
                }
              `}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            Override automatic shift for demonstrations
          </div>
        </div>

        {/* Current Status & Actions */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Status
            </label>
            
            <div className="space-y-2">
              <div className={`
                flex items-center gap-2 text-sm px-3 py-2 rounded-lg
                ${validation.password.isValid && key
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
                }
              `}>
                <div className={`w-2 h-2 rounded-full ${
                  validation.password.isValid && key ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                Key: {validation.password.isValid && key ? 'Valid' : 'Missing'}
              </div>
              
              <div className={`
                flex items-center gap-2 text-sm px-3 py-2 rounded-lg
                ${liveEncryption
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
                }
              `}>
                <div className={`w-2 h-2 rounded-full ${
                  liveEncryption ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                }`} />
                Mode: {liveEncryption ? 'Live' : 'Manual'}
              </div>
              
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                Shift: {effectiveShift} {useManualShift ? '(Manual)' : '(Auto)'}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2">
            <button
              onClick={reset}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset All
            </button>

            {/* Encrypt button, only enabled when liveEncryption is off */}
            <button
              onClick={handleManualEncrypt}
              disabled={liveEncryption}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors border
                ${!liveEncryption ? 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700' : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'}`}
              style={{ marginTop: '0.5rem' }}
            >
              Encrypt
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updatePreference('showAlphabetMapping', !preferences.showAlphabetMapping)}
                className={`
                  px-3 py-2 text-xs font-medium rounded-lg transition-colors
                  ${preferences.showAlphabetMapping
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }
                `}
              >
                ABC Map
              </button>
              <button
                onClick={() => updatePreference('showTextAnalysis', !preferences.showTextAnalysis)}
                className={`
                  px-3 py-2 text-xs font-medium rounded-lg transition-colors
                  ${preferences.showTextAnalysis
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                  }
                `}
              >
                Analysis
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EncryptionControls;