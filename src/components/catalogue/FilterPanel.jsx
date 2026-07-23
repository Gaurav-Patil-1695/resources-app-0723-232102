import React, { useState } from 'react';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="filter-panel__section"
      style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '16px' }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          padding: '0 0 12px 0',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          color: '#111827',
        }}
      >
        {title}
        <img
          src={chevronDownIcon}
          alt=""
          aria-hidden="true"
          style={{
            width: '16px',
            height: '16px',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

const FilterPanel = ({
  brands = [],
  priceRange = { min: 0, max: 1000 },
  currentPriceRange = { min: 0, max: 1000 },
  ratings = [1, 2, 3, 4, 5],
  selectedBrands = [],
  selectedRating = null,
  onBrandChange,
  onPriceRangeChange,
  onRatingChange,
  brandCounts = {},
  ratingCounts = {},
}) => {
  const handleBrandToggle = (brand) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    if (onBrandChange) onBrandChange(next);
  };

  const handleMinPrice = (e) => {
    const val = Number(e.target.value);
    if (onPriceRangeChange)
      onPriceRangeChange({ min: val, max: currentPriceRange.max });
  };

  const handleMaxPrice = (e) => {
    const val = Number(e.target.value);
    if (onPriceRangeChange)
      onPriceRangeChange({ min: currentPriceRange.min, max: val });
  };

  const handleRatingClick = (r) => {
    if (onRatingChange) onRatingChange(selectedRating === r ? null : r);
  };

  return (
    <aside
      className="filter-panel"
      aria-label="Product filters"
      style={{
        width: '240px',
        minWidth: '200px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        fontSize: '14px',
      }}
    >
      <h2
        style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#111827',
          margin: '0 0 16px 0',
        }}
      >
        Filters
      </h2>

      {brands.length > 0 && (
        <Section title="Brand">
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {brands.map((brand) => (
              <li key={brand}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    color: '#374151',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ flexGrow: 1 }}>{brand}</span>
                  {brandCounts[brand] != null && (
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                      ({brandCounts[brand]})
                    </span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Price Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6b7280', minWidth: '28px' }}>Min</label>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                $
              </span>
              <input
                type="number"
                min={priceRange.min}
                max={currentPriceRange.max}
                value={currentPriceRange.min}
                onChange={handleMinPrice}
                aria-label="Minimum price"
                style={{
                  width: '100%',
                  padding: '6px 8px 6px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '12px', color: '#6b7280', minWidth: '28px' }}>Max</label>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <span
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  fontSize: '13px',
                }}
              >
                $
              </span>
              <input
                type="number"
                min={currentPriceRange.min}
                max={priceRange.max}
                value={currentPriceRange.max}
                onChange={handleMaxPrice}
                aria-label="Maximum price"
                style={{
                  width: '100%',
                  padding: '6px 8px 6px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Rating">
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[5, 4, 3, 2, 1].map((r) => (
            <li key={r}>
              <button
                type="button"
                aria-pressed={selectedRating === r}
                onClick={() => handleRatingClick(r)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: selectedRating === r ? '#f3f4f6' : 'none',
                  border: selectedRating === r ? '1px solid #d1d5db' : '1px solid transparent',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '13px',
                  color: '#374151',
                }}
              >
                <span style={{ display: 'flex', gap: '2px' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        color: i < r ? '#f59e0b' : '#d1d5db',
                        fontSize: '14px',
                      }}
                    >
                      ★
                    </span>
                  ))}
                </span>
                <span style={{ flexGrow: 1, textAlign: 'left' }}>{r}+</span>
                {ratingCounts[r] != null && (
                  <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                    ({ratingCounts[r]})
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </Section>
    </aside>
  );
};

export default FilterPanel;
