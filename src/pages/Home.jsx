import React from 'react';
import { useUser } from '../context/UserContext';
import { useEncryption } from '../hooks/useEncryption';
import MessageInput from '../components/MessageInput';
import EncryptedOutput from '../components/EncryptedOutput';
import EncryptionControls from '../components/EncryptionControls';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  const { 
    username, 
    password, 
    liveEncryption, 
    preferences 
  } = useUser();

  // Initialize encryption hook with user preferences
  const encryptionState = useEncryption({
    defaultKey: password,
    liveEncryption: liveEncryption,
    maxLength: preferences?.maxLength || 1000
  });

  const {
    plainText,
    encryptedText,
    effectiveShift,
    validation,
    textAnalysis,
    alphabetMapping,
    canEncrypt,
    hasValidKey,
    setPlainText
  } = encryptionState;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            CipherBox - Educational Caesar Cipher
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transform your messages using the ancient Caesar cipher! 
            {username && (
              <span className="text-blue-600 font-medium"> Welcome back, {username}!</span>
            )}
          </p>
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-xl mx-auto">
            ⚠️ This is an educational tool - Caesar ciphers are not secure for real secrets!
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-12">
            <EncryptionControls 
              encryptionState={encryptionState}
              className="mb-6"
            />
          </div>

          {/* Input Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Your Message
                </h2>
                <div className="text-sm text-gray-500">
                  {textAnalysis?.totalChars || 0}/{preferences?.maxLength || 1000} chars
                </div>
              </div>
              
              <MessageInput
                value={plainText}
                onChange={setPlainText}
                maxLength={preferences?.maxLength || 1000}
                validation={validation?.message}
                analysis={textAnalysis}
                disabled={false}
              />

              {/* Manual encrypt handler for EncryptionControls */}
              {/* This callback will be passed to EncryptionControls for manual encryption */}
              {/* Only needed if setEncryptedText is not handled in the hook */}
              {/*
              const handleManualEncrypt = () => {
                if (!liveEncryption && typeof encrypt === 'function') {
                  setEncryptedText(encrypt(plainText));
                }
              };
              */}
              
              {/* Text Analysis (if enabled) */}
              {preferences?.showTextAnalysis && plainText.trim() && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <span>Words: {textAnalysis?.words || 0}</span>
                    <span>Letters: {textAnalysis?.letters || 0}</span>
                    <span>Numbers: {textAnalysis?.numbers || 0}</span>
                    <span>Punctuation: {textAnalysis?.punctuation || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Encrypted Output
                </h2>
                <div className="flex items-center gap-2">
                  {hasValidKey && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Shift: {effectiveShift}
                    </span>
                  )}
                  <div className={`w-3 h-3 rounded-full ${
                    canEncrypt && hasValidKey 
                      ? 'bg-green-400' 
                      : 'bg-gray-300'
                  }`} title={canEncrypt && hasValidKey ? 'Ready' : 'Need valid key and message'} />
                </div>
              </div>
              
              <EncryptedOutput
                encryptedText={encryptedText}
                canEncrypt={canEncrypt}
                hasValidKey={hasValidKey}
                shift={effectiveShift}
                isLive={liveEncryption}
              />
            </div>
          </div>

          {/* Alphabet Mapping (if enabled) */}
          {preferences?.showAlphabetMapping && hasValidKey && alphabetMapping && (
            <div className="lg:col-span-12">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Alphabet Mapping (Shift: {effectiveShift})
                </h3>
                <div className="grid grid-cols-13 gap-1 text-xs text-center font-mono">
                  {Object.entries(alphabetMapping)
                    .filter(([key]) => /[A-Z]/.test(key))
                    .map(([original, encrypted]) => (
                      <div key={original} className="p-1">
                        <div className="text-gray-600">{original}</div>
                        <div className="text-blue-600 font-semibold">↓</div>
                        <div className="text-blue-800">{encrypted}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Status Messages */}
        {!canEncrypt && plainText.trim() && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              💡 Enter a password or set a manual shift to start encrypting
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default Home;