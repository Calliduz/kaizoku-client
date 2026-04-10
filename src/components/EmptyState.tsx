import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon = '∅', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state container animate-fade-in" id="empty-state">
      <span style={{ fontSize: '3.5rem', marginBottom: 'var(--space-md)' }}>{icon}</span>
      <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{title}</h3>
      {description && <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px' }}>{description}</p>}
      {action && (
        <button className="btn-retry" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
