import React from 'react';
import { useCipherClipboard } from '../hooks/useClipboard';

const EncryptedOutput = ({ 
  encryptedText, 
  canEncrypt = true, 
  hasValidKey = true, 
  shift = 0, 
  isLive = true 
}) => {
  const { copyEncrypted, isCopied, isError } = useCipherClipboard();

  const handleCopy = async () => {
    if (!encryptedText) return;
    await copyEncrypted(encryptedText, shift, true); // Include metadata
  };

  const isLocked = !hasValidKey;

  return (
    <div className="space-y-3">
      {/* Title with lock status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Encrypted output
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-sm ${
            isLocked ? 'text-amber-600' : 'text-green-600'
          }`}>
            {isLocked ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>Locked</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2C7.79086 2 6 3.79086 6 6V7H5C3.89543 7 3 7.89543 3 9V17C3 18.1046 3.89543 19 5 19H15C16.1046 19 17 18.1046 17 17V9C17 7.89543 16.1046 7 15 7H14V6C14 3.79086 12.2091 2 10 2ZM12 7V6C12 4.89543 11.1046 4 10 4C8.89543 4 8 4.89543 8 6V7H12Z" />
                </svg>
                <span>Unlocked</span>
              </>
            )}
          </div>
          
          {!isLive && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
              Manual
            </span>
          )}

          <button
            onClick={handleCopy}
            disabled={!encryptedText}
            className={`relative px-3 py-1 text-sm font-medium rounded-lg transition-all duration-200 ${
              encryptedText
                ? isCopied 
                  ? 'bg-green-100 text-green-700'
                  : isError
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isCopied ? (
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Copied!</span>
              </span>
            ) : isError ? (
              <span>Error</span>
            ) : (
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Output panel */}
      <div className={`w-full h-40 p-4 border-2 rounded-xl transition-all duration-300 ${
        encryptedText 
          ? 'border-gray-300 bg-white' 
          : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="h-full overflow-auto">
          {encryptedText ? (
            <div className="space-y-2">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {encryptedText}
              </pre>
              {shift > 0 && (
                <div className="text-xs text-blue-600 border-t pt-2 mt-2">
                  Encrypted with shift: {shift}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm">
                  {!canEncrypt 
                    ? 'Enter a message and password to start' 
                    : !hasValidKey
                      ? 'Enter a password to unlock encryption'
                      : 'Encrypted text will appear here'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {encryptedText && (
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>
            {encryptedText.length} characters encrypted
          </span>
          <span className={`flex items-center space-x-1 ${
            isLive ? 'text-green-600' : 'text-blue-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-green-400' : 'bg-blue-400'
            }`} />
            <span>{isLive ? 'Live' : 'Manual'}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default EncryptedOutput;