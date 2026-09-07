import React from 'react';

/**
 * priceIncTax: number — tax-inclusive price (required)
 * originalPrice: number — original price for strikethrough (optional)
 * currencySymbol: string — defaults to '$'
 * size: 'sm' | 'md' | 'lg'
 */
const PriceDisplay = ({
  priceIncTax,
  originalPrice,
  currencySymbol = '$',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { current: '14px', original: '12px', label: '11px' },
    md: { current: '20px', original: '14px', label: '12px' },
    lg: { current: '28px', original: '18px', label: '13px' },
  };
  const fontSize = sizeMap[size] || sizeMap.md;

  const formatPrice = (val) =>
    typeof val === 'number'
      ? `${currencySymbol}${val.toFixed(2)}`
      : String(val);

  const hasDiscount =
    originalPrice != null && Number(originalPrice) > Number(priceIncTax);

  return (
    <div
      className="price-display"
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}
    >
      <span
        className="price-display__current"
        style={{
          fontSize: fontSize.current,
          fontWeight: 700,
          color: hasDiscount ? '#dc2626' : '#111827',
          lineHeight: 1,
        }}
      >
        {formatPrice(priceIncTax)}
      </span>

      {hasDiscount && (
        <span
          className="price-display__original"
          style={{
            fontSize: fontSize.original,
            fontWeight: 400,
            color: '#9ca3af',
            textDecoration: 'line-through',
            lineHeight: 1,
          }}
          aria-label={`Original price ${formatPrice(originalPrice)}`}
        >
          {formatPrice(originalPrice)}
        </span>
      )}

      <span
        className="price-display__tax-label"
        style={{
          fontSize: fontSize.label,
          color: '#6b7280',
          fontWeight: 400,
          lineHeight: 1,
        }}
      >
        inc. tax
      </span>
    </div>
  );
};

export default PriceDisplay;
