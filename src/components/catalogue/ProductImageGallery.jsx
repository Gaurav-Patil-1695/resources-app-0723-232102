import React, { useState } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * images: Array<{ src: string, alt?: string }>
 */
const ProductImageGallery = ({ images = [], productName = '' }) => {
  const allImages = images.length > 0 ? images : [{ src: placeholderProduct, alt: productName }];
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, allImages.length - 1)));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
    if (e.key === 'ArrowRight') goTo(activeIndex + 1);
  };

  const current = allImages[activeIndex];

  return (
    <div
      className="product-image-gallery"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      <div
        className="product-image-gallery__main"
        role="img"
        aria-label={current.alt || productName || 'Product image'}
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '100%',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
        onKeyDown={handleKeyDown}
        tabIndex={allImages.length > 1 ? 0 : undefined}
        aria-roledescription={allImages.length > 1 ? 'image carousel' : undefined}
      >
        <img
          src={current.src || placeholderProduct}
          alt={current.alt || productName || 'Product image'}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '16px',
            boxSizing: 'border-box',
          }}
          onError={(e) => {
            e.currentTarget.src = placeholderProduct;
          }}
        />

        {allImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === 0 ? 0.4 : 1,
              }}
            >
              <img src={chevronLeftIcon} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === allImages.length - 1}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)',
                border: '1px solid #e5e7eb',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: activeIndex === allImages.length - 1 ? 'not-allowed' : 'pointer',
                opacity: activeIndex === allImages.length - 1 ? 0.4 : 1,
              }}
            >
              <img src={chevronRightIcon} alt="" aria-hidden="true" style={{ width: '16px', height: '16px' }} />
            </button>
            <div
              aria-live="polite"
              aria-atomic="true"
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: '#6b7280',
                backgroundColor: 'rgba(255,255,255,0.85)',
                padding: '2px 8px',
                borderRadius: '10px',
              }}
            >
              {activeIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </div>

      {allImages.length > 1 && (
        <div
          className="product-image-gallery__thumbnails"
          role="tablist"
          aria-label="Product images"
          style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
        >
          {allImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Image ${idx + 1}${img.alt ? `: ${img.alt}` : ''}`}
              onClick={() => goTo(idx)}
              style={{
                width: '64px',
                height: '64px',
                padding: '0',
                border: idx === activeIndex ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#f9fafb',
                flexShrink: 0,
              }}
            >
              <img
                src={img.src || placeholderProduct}
                alt=""
                aria-hidden="true"
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px', boxSizing: 'border-box' }}
                onError={(e) => {
                  e.currentTarget.src = placeholderProduct;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
