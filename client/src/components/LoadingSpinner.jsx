import React from 'react';
// import './LoadingSpinner.css';

export function LoadingSpinner({ size = 'medium' }) {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
    </div>
  );
}