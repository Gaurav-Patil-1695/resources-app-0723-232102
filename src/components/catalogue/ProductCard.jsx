import React from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import starIcon from '@/assets/icons/star.svg';

const ProductCard = ({ product, onClick }) => {
  const {
    id,
    name,
    image,
    priceIncTax,
    originalPrice,
    rating,
    reviewCount,
  } = product || {};

  const handleClick = () => {
    if (onClick) onClick(product);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const formattedPrice =
    typeof priceIncTax === 'number'
      ? `$${priceIncTax.toFixed(2)}`
      : priceIncTax;

  const formattedOriginal =
    typeof originalPrice === 'number'
      ? `$${originalPrice.toFixed(2)}`
      : originalPrice;

  const displayRating =
    typeof rating === 'number' ? rating.toFixed(1) : null;

  return (
    <article
      className="product-card"
      role="button"
      tabIndex={0}
      aria-label={name}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <div
        className="product-card__image-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          backgroundColor: '#f9fafb',
          overflow: 'hidden',
        }}
      >
        <img
          src={image || placeholderProduct}
          alt={name || 'Product image'}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '8px',
          }}
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />
        {displayRating !== null && (
          <div
            className="product-card__rating-badge"
            aria-label={`Rating: ${displayRating} out of 5`}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              backgroundColor: '#1f2937',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              padding: '3px 7px',
              borderRadius: '12px',
            }}
          >
            <img
              src={starIcon}
              alt=""
              aria-hidden="true"
              style={{ width: '11px', height: '11px', filter: 'invert(1)' }}
            />
            <span>{displayRating}</span>
            {reviewCount != null && (
              <span style={{ fontWeight: 400, opacity: 0.75 }}>
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>

      <div
        className="product-card__body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '12px',
          flexGrow: 1,
        }}
      >
        <h3
          className="product-card__name"
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.4,
            color: '#111827',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name || 'Unnamed Product'}
        </h3>

        <div
          className="product-card__price"
          style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}
        >
          <span
            style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}
          >
            {formattedPrice}
          </span>
          {formattedOriginal && (
            <span
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: '#9ca3af',
                textDecoration: 'line-through',
              }}
            >
              {formattedOriginal}
            </span>
          )}
          <span
            style={{
              fontSize: '11px',
              color: '#6b7280',
              marginLeft: 'auto',
            }}
          >
            inc. tax
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
