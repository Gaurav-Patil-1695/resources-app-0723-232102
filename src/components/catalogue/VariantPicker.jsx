import React, { useState, useEffect } from 'react';
import checkIcon from '@/assets/icons/check.svg';

/**
 * variants: Array<{ id, attributes: { size?: string, colour?: string }, sku: string, inStock: boolean }>
 * onVariantSelect: (variant) => void
 */
const VariantPicker = ({ variants = [], onVariantSelect }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [resolvedVariant, setResolvedVariant] = useState(null);

  const attributeKeys = Array.from(
    variants.reduce((acc, v) => {
      Object.keys(v.attributes || {}).forEach((k) => acc.add(k));
      return acc;
    }, new Set())
  );

  const optionsFor = (key) => {
    const seen = new Set();
    return variants
      .map((v) => v.attributes?.[key])
      .filter((val) => val != null && !seen.has(val) && seen.add(val));
  };

  const isAvailable = (key, value) => {
    const candidate = { ...selectedAttributes, [key]: value };
    return variants.some((v) =>
      Object.entries(candidate).every(
        ([k, val]) => v.attributes?.[k] === val
      )
    );
  };

  useEffect(() => {
    if (attributeKeys.length === 0) return;
    const allSelected = attributeKeys.every((k) => selectedAttributes[k] != null);
    if (allSelected) {
      const match = variants.find((v) =>
        attributeKeys.every((k) => v.attributes?.[k] === selectedAttributes[k])
      );
      setResolvedVariant(match || null);
      if (match && onVariantSelect) onVariantSelect(match);
    } else {
      setResolvedVariant(null);
    }
  }, [selectedAttributes]);

  const handleSelect = (key, value) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
    }));
  };

  const labelMap = { size: 'Size', colour: 'Colour', color: 'Color' };

  const colourStyle = (value) => ({
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: value,
    border: '2px solid #d1d5db',
    cursor: 'pointer',
    position: 'relative',
  });

  const isColourKey = (key) =>
    key.toLowerCase() === 'colour' || key.toLowerCase() === 'color';

  return (
    <div className="variant-picker" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {attributeKeys.map((key) => (
        <div key={key} className="variant-picker__group">
          <div
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '8px',
              textTransform: 'capitalize',
            }}
          >
            {labelMap[key] || key}:
            {selectedAttributes[key] && (
              <span style={{ fontWeight: 400, marginLeft: '6px', color: '#6b7280' }}>
                {selectedAttributes[key]}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {optionsFor(key).map((value) => {
              const selected = selectedAttributes[key] === value;
              const available = isAvailable(key, value);
              if (isColourKey(key)) {
                return (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Colour: ${value}`}
                    aria-pressed={selected}
                    disabled={!available}
                    onClick={() => handleSelect(key, value)}
                    style={{
                      ...colourStyle(value),
                      outline: selected ? '3px solid #3b82f6' : 'none',
                      outlineOffset: '2px',
                      opacity: available ? 1 : 0.35,
                      cursor: available ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {selected && (
                      <img
                        src={checkIcon}
                        alt=""
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          padding: '5px',
                          filter: 'invert(1)',
                          boxSizing: 'border-box',
                        }}
                      />
                    )}
                  </button>
                );
              }
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={selected}
                  disabled={!available}
                  onClick={() => handleSelect(key, value)}
                  style={{
                    minWidth: '40px',
                    padding: '6px 12px',
                    border: selected ? '2px solid #3b82f6' : '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: selected ? '#eff6ff' : '#ffffff',
                    color: selected ? '#1d4ed8' : '#374151',
                    fontSize: '13px',
                    fontWeight: selected ? 600 : 400,
                    cursor: available ? 'pointer' : 'not-allowed',
                    opacity: available ? 1 : 0.4,
                    textDecoration: available ? 'none' : 'line-through',
                    transition: 'all 0.15s',
                  }}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {resolvedVariant && (
        <div
          style={{
            fontSize: '12px',
            color: '#6b7280',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            padding: '6px 10px',
          }}
        >
          SKU: <strong>{resolvedVariant.sku}</strong>
          {resolvedVariant.inStock === false && (
            <span style={{ color: '#ef4444', marginLeft: '8px' }}>Out of stock</span>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantPicker;
