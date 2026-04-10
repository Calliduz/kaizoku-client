/**
 * Smooth Loading Spinner with glow effect.
 */
export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
      <div
        className="spinner"
        style={{
          width: '42px',
          height: '42px',
          border: '3px solid rgba(255, 255, 255, 0.05)',
          borderTopColor: 'var(--color-accent)',
          borderRadius: '50%',
          animation: 'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite',
          boxShadow: '0 0 15px rgba(108, 92, 231, 0.1)'
        }}
      />
    </div>
  );
}
