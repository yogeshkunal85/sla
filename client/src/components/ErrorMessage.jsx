import React from 'react';
// import './ErrorMessage.css';

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <p className="error-text">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="error-retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}