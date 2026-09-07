import React from 'react';
import closeIcon from '@/assets/icons/close.svg';

const ActiveFilterBar = ({ filters = [], onRemove, onClearAll }) => {
  if (filters.length === 0) return null;

  return (
    <div
      className="active-filter-bar"
      role="region"
      aria-label="Active filters"
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '8px 0',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: 600,
          color: '#374151',
          whiteSpace: 'nowrap',
        }}
      >
        Active filters:
      </span>

      {filters.map((filter) => (
        <span
          key={filter.key}
          className="active-filter-bar__chip"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '16px',
            padding: '3px 10px 3px 12px',
            fontSize: '13px',
            color: '#1d4ed8',
          }}
        >
          <span>{filter.label}</span>
          <button
            type="button"
            aria-label={`Remove filter: ${filter.label}`}
            onClick={() => onRemove && onRemove(filter.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              marginLeft: '2px',
              borderRadius: '50%',
              lineHeight: 0,
            }}
          >
            <img
              src={closeIcon}
              alt=""
              aria-hidden="true"
              style={{
                width: '12px',
                height: '12px',
                filter:
                  'invert(26%) sepia(89%) saturate(1583%) hue-rotate(213deg) brightness(92%) contrast(98%)',
              }}
            />
          </button>
        </span>
      ))}

      {filters.length > 1 && (
        <button
          type="button"
          onClick={() => onClearAll && onClearAll()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#6b7280',
            textDecoration: 'underline',
            padding: '0',
            marginLeft: '4px',
          }}
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default ActiveFilterBar;
