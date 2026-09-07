import React from 'react';
import ProductCard from './ProductCard';

const SkeletonCard = () => (
  <div
    className="product-card-skeleton"
    aria-hidden="true"
    style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: '100%',
        paddingTop: '100%',
        backgroundColor: '#e5e7eb',
        borderRadius: '0',
        animation: 'skeleton-pulse 1.5s ease-in-out infinite',
      }}
    />
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          height: '14px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          width: '80%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '14px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          width: '55%',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }}
      />
      <div
        style={{
          height: '18px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          width: '40%',
          marginTop: '4px',
          animation: 'skeleton-pulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  </div>
);

const SKELETON_COUNT = 8;

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '16px',
  width: '100%',
};

const keyframesStyle = `
@keyframes skeleton-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
`;

const ProductGrid = ({ products = [], loading = false, onProductClick }) => {
  return (
    <>
      <style>{keyframesStyle}</style>
      <section
        className="product-grid"
        aria-label="Product listing"
        aria-busy={loading}
        style={gridStyle}
      >
        {loading
          ? Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <SkeletonCard key={`skeleton-${i}`} />
            ))
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
              />
            ))}
        {!loading && products.length === 0 && (
          <p
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              color: '#6b7280',
              padding: '40px 0',
              fontSize: '16px',
            }}
          >
            No products found.
          </p>
        )}
      </section>
    </>
  );
};

export default ProductGrid;
