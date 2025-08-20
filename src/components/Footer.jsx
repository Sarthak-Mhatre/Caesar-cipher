import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left side - Educational notice */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Educational Tool Notice</span>
            </div>
            <p className="text-xs text-gray-600 max-w-md">
              This is a learning tool for understanding Caesar ciphers. 
              <strong className="text-amber-700"> Not secure for real secrets!</strong> 
              Caesar ciphers can be easily broken and should never be used for actual security.
            </p>
          </div>

          {/* Center - Links */}
          <div className="flex items-center gap-6 text-sm">
            <button
              onClick={() => window.open('https://en.wikipedia.org/wiki/Caesar_cipher', '_blank')}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Learn More About Caesar Ciphers
            </button>
            <button
              onClick={() => alert(`CipherBox v1.0

Built with:
• React + Vite
• Tailwind CSS
• Custom hooks for encryption

Features:
• Real-time Caesar cipher encryption
• Educational alphabet mapping
• Text analysis
• Clipboard operations
• Local storage for preferences

This is an open-source educational project.`)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              About
            </button>
          </div>

          {/* Right side - Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              © {currentYear} CipherBox
            </p>
            <p className="text-xs text-gray-400">
              Made for learning cryptography
            </p>
          </div>
        </div>

        {/* Security tips */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <details className="group">
            <summary className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-800">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Why Caesar ciphers aren't secure (Click to expand)
            </summary>
            <div className="mt-2 pl-6 text-xs text-gray-600 space-y-1">
              <p><strong>Frequency Analysis:</strong> Letter patterns in your language make it easy to guess the shift.</p>
              <p><strong>Brute Force:</strong> Only 25 possible shifts - can be tested in seconds.</p>
              <p><strong>No Key Security:</strong> The "password" just creates a simple number, not a secure key.</p>
              <p><strong>Historical Context:</strong> Used by Julius Caesar ~50 BC, broken by Al-Kindi ~850 AD.</p>
              <p className="text-blue-600"><strong>For real security:</strong> Use modern encryption like AES with proper key management.</p>
            </div>
          </details>
        </div>
      </div>
    </footer>
  );
};

export default Footer;