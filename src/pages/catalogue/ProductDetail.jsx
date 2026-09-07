import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import starIcon from '@/assets/icons/star.svg';
import heartIcon from '@/assets/icons/heart.svg';
import cartIcon from '@/assets/icons/cart.svg';
import checkIcon from '@/assets/icons/check.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import packageIcon from '@/assets/icons/package.svg';

const tokens = {
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorWarning: '#fd7e14',
  colorWarningSubtle: '#fff4e6',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  colorSecondary: '#fd7e14',
};

const MOCK_PRODUCT = {
  id: 1,
  name: 'Premium Wireless Headphones',
  brand: 'Alpha',
  sku: 'SKU-AWH-001',
  description:
    'Experience superior sound quality with these premium wireless headphones. Featuring advanced noise cancellation, 30-hour battery life, and a comfortable over-ear design, they are perfect for music lovers, gamers, and professionals alike. Compatible with all Bluetooth-enabled devices.',
  features: [
    'Active Noise Cancellation (ANC)',
    '30-hour battery life with fast charging',
    'Bluetooth 5.2 with multipoint connection',
    'Foldable design for easy portability',
    'Built-in voice assistant support',
  ],
  price: 149.99,
  taxInclusivePrice: 164.99,
  taxRate: 10,
  rating: 4.5,
  reviewCount: 312,
  inStock: true,
  stockCount: 8,
  images: [null, null, null],
  variants: {
    colors: [
      { id: 'black', label: 'Midnight Black', hex: '#212529' },
      { id: 'white', label: 'Pearl White', hex: '#f8f9fa' },
      { id: 'blue', label: 'Ocean Blue', hex: '#4c6ef5' },
    ],
    sizes: null,
  },
  reviews: [
    { id: 1, author: 'Jordan M.', rating: 5, date: '2024-03-10', body: 'Absolutely love these headphones. The sound quality is incredible and the noise cancellation is top-notch.' },
    { id: 2, author: 'Sam T.', rating: 4, date: '2024-02-28', body: 'Great headphones overall. Battery life is amazing. Slightly tight fit initially but gets comfortable over time.' },
    { id: 3, author: 'Riley P.', rating: 4, date: '2024-02-14', body: 'Excellent sound and build quality. Setup was effortless.' },
  ],
};

function StarRating({ rating, size = 16 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} aria-label={`Rating: ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(star => (
        <img
          key={star}
          src={starIcon}
          alt=''
          style={{
            width: `${size}px`,
            height: `${size}px`,
            opacity: star <= Math.round(rating) ? 1 : 0.25,
          }}
        />
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = MOCK_PRODUCT;

  const [selectedColor, setSelectedColor] = useState(
    product.variants.colors ? product.variants.colors[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const incrementQty = () => setQuantity(q => Math.min(q + 1, product.stockCount));
  const decrementQty = () => setQuantity(q => Math.max(q - 1, 1));

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'features', label: 'Features' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
  ];

  return (
    <div
      style={{
        backgroundColor: tokens.colorCanvas,
        minHeight: '100vh',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: tokens.colorBody,
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb */}
        <nav aria-label='Breadcrumb' style={{ marginBottom: '24px' }}>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', flexWrap: 'wrap' }}>
            <li><Link to='/' style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Home</Link></li>
            <li style={{ color: tokens.colorMuted }}>{'/'}</li>
            <li><Link to='/products' style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Products</Link></li>
            <li style={{ color: tokens.colorMuted }}>{'/'}</li>
            <li style={{ color: tokens.colorMuted }} aria-current='page'>{product.name}</li>
          </ol>
        </nav>

        {/* Back link */}
        <Link
          to='/products'
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: tokens.colorPrimary,
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '24px',
          }}
        >
          <img src={chevronLeft} alt='' style={{ width: '16px', height: '16px' }} />
          Back to products
        </Link>

        {/* Main product layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            marginBottom: '48px',
          }}
        >
          {/* Image gallery */}
          <div>
            <div
              style={{
                backgroundColor: tokens.colorSurface,
                border: `1px solid ${tokens.colorBorder}`,
                borderRadius: '16px',
                overflow: 'hidden',
                aspectRatio: '1/1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}
            >
              <img
                src={product.images[activeImage] || placeholderProduct}
                alt={product.name}
                style={{ width: '80%', height: '80%', objectFit: 'contain' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={activeImage === idx}
                  style={{
                    width: '72px',
                    height: '72px',
                    border: `2px solid ${activeImage === idx ? tokens.colorPrimary : tokens.colorBorder}`,
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundColor: tokens.colorCanvas,
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={img || placeholderProduct}
                    alt=''
                    style={{ width: '56px', height: '56px', objectFit: 'contain' }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Brand & title */}
            <div>
              <Link
                to={`/products?brand=${encodeURIComponent(product.brand)}`}
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: tokens.colorPrimary,
                  textDecoration: 'none',
                }}
              >
                {product.brand}
              </Link>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  letterSpacing: '-0.02em',
                  lineHeight: '40px',
                  color: tokens.colorInk,
                  margin: '8px 0 0',
                }}
              >
                {product.name}
              </h1>
            </div>

            {/* Rating & reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StarRating rating={product.rating} size={18} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: tokens.colorInk }}>{product.rating}</span>
              <span style={{ fontSize: '14px', color: tokens.colorMuted }}>({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div
              style={{
                backgroundColor: tokens.colorPrimarySubtle,
                borderRadius: '10px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    letterSpacing: '-0.02em',
                    color: tokens.colorInk,
                  }}
                >
                  ${product.taxInclusivePrice.toFixed(2)}
                </span>
                <span style={{ fontSize: '14px', color: tokens.colorMuted }}>incl. tax</span>
              </div>
              <p style={{ fontSize: '12px', color: tokens.colorMuted, margin: '4px 0 0' }}>
                Tax: ${(product.taxInclusivePrice - product.price).toFixed(2)} ({product.taxRate}% included)
              </p>
            </div>

            {/* Stock status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {product.inStock ? (
                <>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: tokens.colorSuccessSubtle,
                      color: tokens.colorSuccess,
                      fontSize: '12px',
                      fontWeight: '600',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                    }}
                  >
                    <img src={checkIcon} alt='' style={{ width: '12px', height: '12px' }} />
                    In Stock
                  </span>
                  {product.stockCount <= 10 && (
                    <span style={{ fontSize: '13px', color: tokens.colorWarning, fontWeight: '500' }}>
                      Only {product.stockCount} left
                    </span>
                  )}
                </>
              ) : (
                <span
                  style={{
                    backgroundColor: tokens.colorDisabledBg,
                    color: tokens.colorDisabledText,
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  Out of Stock
                </span>
              )}
            </div>

            {/* SKU */}
            <p style={{ fontSize: '13px', color: tokens.colorMuted, margin: 0 }}>
              SKU:{' '}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
                  fontSize: '13px',
                  color: tokens.colorBody,
                }}
              >
                {product.sku}
              </span>
            </p>

            {/* Color variant picker */}
            {product.variants.colors && (
              <div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: tokens.colorInk,
                    margin: '0 0 10px',
                  }}
                >
                  Colour:{' '}
                  <span style={{ fontWeight: '400', color: tokens.colorMuted }}>
                    {product.variants.colors.find(c => c.id === selectedColor)?.label}
                  </span>
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.variants.colors.map(color => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      aria-label={`Select colour ${color.label}`}
                      aria-pressed={selectedColor === color.id}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '9999px',
                        backgroundColor: color.hex,
                        border: selectedColor === color.id
                          ? `3px solid ${tokens.colorPrimary}`
                          : `2px solid ${tokens.colorBorder}`,
                        cursor: 'pointer',
                        padding: 0,
                        outline: 'none',
                        boxShadow: selectedColor === color.id ? `0 0 0 2px ${tokens.colorSurface}, 0 0 0 4px ${tokens.colorPrimary}` : 'none',
                        transition: 'box-shadow 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: tokens.colorInk, margin: '0 0 10px' }}>Quantity</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${tokens.colorBorder}`, borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  aria-label='Decrease quantity'
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                    opacity: quantity <= 1 ? 0.4 : 1,
                    padding: '0 12px',
                  }}
                >
                  <img src={minusIcon} alt='' style={{ width: '16px', height: '16px' }} />
                </button>
                <span
                  aria-live='polite'
                  aria-atomic='true'
                  style={{
                    minWidth: '48px',
                    textAlign: 'center',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: tokens.colorInk,
                    borderLeft: `1px solid ${tokens.colorBorder}`,
                    borderRight: `1px solid ${tokens.colorBorder}`,
                    padding: '0 12px',
                    lineHeight: '44px',
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= product.stockCount}
                  aria-label='Increase quantity'
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: quantity >= product.stockCount ? 'not-allowed' : 'pointer',
                    opacity: quantity >= product.stockCount ? 0.4 : 1,
                    padding: '0 12px',
                  }}
                >
                  <img src={plusIcon} alt='' style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1,
                  minWidth: '160px',
                  minHeight: '52px',
                  backgroundColor: addedToCart
                    ? tokens.colorSuccess
                    : product.inStock
                    ? tokens.colorPrimary
                    : tokens.colorDisabledBg,
                  color: addedToCart ? '#ffffff' : product.inStock ? '#ffffff' : tokens.colorDisabledText,
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                }}
                aria-label={addedToCart ? 'Added to cart' : 'Add to cart'}
              >
                <img
                  src={addedToCart ? checkIcon : cartIcon}
                  alt=''
                  style={{ width: '20px', height: '20px', filter: 'invert(1)' }}
                />
                {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => setWishlisted(w => !w)}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                aria-pressed={wishlisted}
                style={{
                  minWidth: '52px',
                  minHeight: '52px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${wishlisted ? tokens.colorPrimary : tokens.colorBorder}`,
                  borderRadius: '10px',
                  backgroundColor: wishlisted ? tokens.colorPrimarySubtle : tokens.colorSurface,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.15s',
                }}
              >
                <img
                  src={heartIcon}
                  alt=''
                  style={{
                    width: '22px',
                    height: '22px',
                    opacity: wishlisted ? 1 : 0.5,
                  }}
                />
              </button>
            </div>

            {/* Delivery info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                backgroundColor: tokens.colorCanvas,
                border: `1px solid ${tokens.colorBorder}`,
                borderRadius: '10px',
                padding: '14px 16px',
              }}
            >
              <img src={packageIcon} alt='' style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px', opacity: 0.7 }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: tokens.colorInk, margin: '0 0 2px' }}>Free Delivery</p>
                <p style={{ fontSize: '13px', color: tokens.colorMuted, margin: 0 }}>On orders over $50. Usually dispatches within 1–2 business days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product tabs */}
        <div
          style={{
            backgroundColor: tokens.colorSurface,
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* Tab nav */}
          <div
            role='tablist'
            aria-label='Product information'
            style={{
              display: 'flex',
              borderBottom: `1px solid ${tokens.colorBorder}`,
            }}
          >
            {tabs.map(tab => (
              <button
                key={tab.id}
                role='tab'
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '14px 24px',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? `2px solid ${tokens.colorPrimary}` : '2px solid transparent',
                  backgroundColor: 'transparent',
                  fontSize: '14px',
                  fontWeight: activeTab === tab.id ? '600' : '400',
                  color: activeTab === tab.id ? tokens.colorPrimary : tokens.colorMuted,
                  cursor: 'pointer',
                  marginBottom: '-1px',
                  minHeight: '44px',
                  transition: 'color 0.15s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div style={{ padding: '32px' }}>
            {activeTab === 'description' && (
              <div
                id='panel-description'
                role='tabpanel'
                aria-labelledby='tab-description'
              >
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.625',
                    color: tokens.colorBody,
                    margin: 0,
                    maxWidth: '72ch',
                  }}
                >
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div
                id='panel-features'
                role='tabpanel'
                aria-labelledby='tab-features'
              >
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        fontSize: '16px',
                        color: tokens.colorBody,
                        lineHeight: '1.5',
                      }}
                    >
                      <img
                        src={checkIcon}
                        alt=''
                        style={{
                          width: '18px',
                          height: '18px',
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div
                id='panel-reviews'
                role='tabpanel'
                aria-labelledby='tab-reviews'
              >
                {/* Summary */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '32px',
                    padding: '20px',
                    backgroundColor: tokens.colorCanvas,
                    borderRadius: '10px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '48px', fontWeight: '700', color: tokens.colorInk, margin: 0, lineHeight: 1 }}>{product.rating}</p>
                    <StarRating rating={product.rating} size={20} />
                    <p style={{ fontSize: '13px', color: tokens.colorMuted, margin: '6px 0 0' }}>{product.reviewCount} reviews</p>
                  </div>
                </div>

                {/* Review list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {product.reviews.map(review => (
                    <article
                      key={review.id}
                      style={{
                        borderBottom: `1px solid ${tokens.colorBorder}`,
                        paddingBottom: '24px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: tokens.colorInk, margin: '0 0 4px' }}>{review.author}</p>
                          <StarRating rating={review.rating} size={14} />
                        </div>
                        <time
                          dateTime={review.date}
                          style={{ fontSize: '12px', color: tokens.colorMuted }}
                        >
                          {new Date(review.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                      <p style={{ fontSize: '15px', lineHeight: '1.6', color: tokens.colorBody, margin: 0 }}>{review.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
