import React from 'react';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorDisplay({ message = 'An unexpected error occurred.', onRetry }: ErrorDisplayProps) {
  return (
    <div className="error-display container animate-fade-in" id="error-display">
      <span style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-danger)' }}>⚠</span>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>Something went wrong</h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>{message}</p>
      {onRetry && (
        <button className="btn-retry" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
