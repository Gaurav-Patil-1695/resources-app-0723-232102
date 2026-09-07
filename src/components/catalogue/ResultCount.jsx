import React from 'react';

/**
 * total: number — total result count
 * facets: Array<{ label: string, count: number }> — per-option facet counts
 * loading: boolean
 */
const ResultCount = ({ total = 0, facets = [], loading = false }) => {
  if (loading) {
    return (
      <div
        className="result-count result-count--loading"
        aria-busy="true"
        style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
      >
        <div
          style={{
            height: '16px',
            width: '120px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          }}
        />
        <style>{`@keyframes skeleton-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
      </div>
    );
  }

  return (
    <div
      className="result-count"
      aria-live="polite"
      aria-atomic="true"
      style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
    >
      <span
        className="result-count__total"
        style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}
      >
        <strong>{total.toLocaleString()}</strong>{' '}
        {total === 1 ? 'result' : 'results'}
      </span>

      {facets.length > 0 && (
        <div
          className="result-count__facets"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          aria-label="Facet counts"
        >
          {facets.map((facet) => (
            <span
              key={facet.label}
              className="result-count__facet"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                color: '#6b7280',
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '2px 10px',
              }}
            >
              <span>{facet.label}</span>
              <span
                style={{
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                {facet.count.toLocaleString()}
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultCount;
