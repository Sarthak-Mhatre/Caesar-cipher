import React, { useState } from 'react';

const MessageInput = ({ 
  value, 
  onChange, 
  maxLength = 1000, 
  validation, 
  analysis, 
  disabled = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value?.length || 0;
  const isOverLimit = characterCount > maxLength;
  
  // Use validation if provided, otherwise create basic validation
  const hasErrors = validation?.errors?.length > 0;
  const hasWarnings = validation?.warnings?.length > 0;

  return (
    <div className="space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Type your message
        </h2>
        <div className={`text-sm font-medium ${
          isOverLimit || hasErrors ? 'text-red-600' : 'text-gray-500'
        }`}>
          {characterCount}/{maxLength}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder="Write your secret message here (max 1000 words)..."
          className={`w-full h-40 p-4 border-2 rounded-xl resize-none transition-all duration-200 ${
            disabled 
              ? 'bg-gray-50 cursor-not-allowed'
              : isFocused 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : hasErrors || isOverLimit
                  ? 'border-red-300'
                  : hasWarnings
                    ? 'border-yellow-300'
                    : 'border-gray-300 hover:border-gray-400'
          } focus:outline-none`}
          maxLength={maxLength + 100} // Allow slight overflow for warning
        />
        
        {/* Character limit warning */}
        {(isOverLimit || hasErrors) && (
          <div className="absolute -bottom-6 left-0 text-sm text-red-600">
            {validation?.errors?.[0] || `Message exceeds ${maxLength} characters`}
          </div>
        )}
      </div>

      {/* Validation Messages */}
      {hasWarnings && (
        <div className="text-sm text-yellow-600">
          {validation.warnings.map((warning, i) => (
            <p key={i}>⚠️ {warning}</p>
          ))}
        </div>
      )}

      {/* Helper text */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>Letters, spaces, and punctuation will be preserved in the encrypted message.</p>
        
        {/* Analysis info if provided */}
        {analysis && value && (
          <div className="text-xs text-gray-500 mt-2">
            <span>{analysis.letters} letters</span>
            <span className="mx-2">•</span>
            <span>{analysis.words} words</span>
            {analysis.numbers > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{analysis.numbers} numbers</span>
              </>
            )}
            {analysis.punctuation > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{analysis.punctuation} punctuation</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;