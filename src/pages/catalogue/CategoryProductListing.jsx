import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';
import chevronDown from '@/assets/icons/chevron-down.svg';
import starIcon from '@/assets/icons/star.svg';
import heartIcon from '@/assets/icons/heart.svg';

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
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
};

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
];

const MOCK_CATEGORIES = {
  'electronics': { name: 'Electronics', description: 'Latest gadgets and electronic devices.' },
  'clothing': { name: 'Clothing', description: 'Trendy apparel for every occasion.' },
  'home-garden': { name: 'Home & Garden', description: 'Everything for your home and garden.' },
  'sports': { name: 'Sports & Outdoors', description: 'Gear up for your next adventure.' },
};

const BRANDS = ['Alpha', 'Beta', 'Gamma', 'Delta'];

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 – $50', min: 25, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: null },
];

function generateCategoryProducts(categorySlug, count = 36) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    slug: `${categorySlug}-product-${i + 1}`,
    name: `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Product ${i + 1}`,
    brand: BRANDS[i % BRANDS.length],
    price: parseFloat((14.99 + i * 4.25).toFixed(2)),
    taxInclusivePrice: parseFloat((14.99 + i * 4.25) * 1.1).toFixed(2),
    rating: parseFloat((3.2 + (i % 4) * 0.4).toFixed(1)),
    reviewCount: 5 + i * 4,
    image: null,
    inStock: i % 6 !== 0,
  }));
}

function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <article
      style={{
        backgroundColor: tokens.colorSurface,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ position: 'relative', aspectRatio: '4/3', backgroundColor: tokens.colorCanvas }}>
        <img
          src={product.image || placeholderProduct}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
        />
        {!product.inStock && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: tokens.colorDisabledBg,
              color: tokens.colorDisabledText,
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '3px',
            }}
          >
            Out of Stock
          </span>
        )}
        <button
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => setWishlisted(w => !w)}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: tokens.colorSurface,
            border: `1px solid ${tokens.colorBorder}`,
            borderRadius: '9999px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <img
            src={heartIcon}
            alt=''
            style={{ width: '16px', height: '16px', opacity: wishlisted ? 1 : 0.4 }}
          />
        </button>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontSize: '12px', color: tokens.colorMuted, margin: 0 }}>{product.brand}</p>
        <Link
          to={`/products/${product.slug}`}
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: tokens.colorInk,
            textDecoration: 'none',
            lineHeight: '1.3',
          }}
        >
          {product.name}
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
          <img src={starIcon} alt='Rating' style={{ width: '14px', height: '14px' }} />
          <span style={{ fontSize: '14px', color: tokens.colorBody }}>{product.rating}</span>
          <span style={{ fontSize: '12px', color: tokens.colorMuted }}>({product.reviewCount})</span>
        </div>
        <p
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: tokens.colorInk,
            margin: 0,
            marginTop: 'auto',
            paddingTop: '8px',
          }}
        >
          ${product.taxInclusivePrice}
          <span style={{ fontSize: '12px', fontWeight: '400', color: tokens.colorMuted, marginLeft: '4px' }}>
            incl. tax
          </span>
        </p>
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <Link
          to={`/products/${product.slug}`}
          style={{
            display: 'block',
            textAlign: 'center',
            backgroundColor: product.inStock ? tokens.colorPrimary : tokens.colorDisabledBg,
            color: product.inStock ? '#ffffff' : tokens.colorDisabledText,
            padding: '10px',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
            pointerEvents: product.inStock ? 'auto' : 'none',
            minHeight: '44px',
            lineHeight: '24px',
          }}
          aria-disabled={!product.inStock}
        >
          {product.inStock ? 'View Product' : 'Out of Stock'}
        </Link>
      </div>
    </article>
  );
}

function FilterSidebar({ filters, onFilterChange }) {
  const [expandedSections, setExpandedSections] = useState({ brand: true, price: true, rating: true });

  const toggleSection = key =>
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleBrand = brand => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: next });
  };

  const selectPriceRange = range => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const selectRating = rating => {
    onFilterChange({ ...filters, minRating: filters.minRating === rating ? null : rating });
  };

  const sectionHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    padding: '0 0 12px',
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorInk,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  };

  return (
    <aside
      aria-label='Category product filters'
      style={{
        width: '220px',
        flexShrink: 0,
        backgroundColor: tokens.colorSurface,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: '10px',
        padding: '20px',
        alignSelf: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: tokens.colorInk, margin: 0 }}>Filters</h2>
        <button
          onClick={() => onFilterChange({ brands: [], priceRange: null, minRating: null })}
          style={{
            background: 'none',
            border: 'none',
            color: tokens.colorPrimary,
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Clear all
        </button>
      </div>

      <div style={{ borderBottom: `1px solid ${tokens.colorBorder}`, paddingBottom: '16px', marginBottom: '16px' }}>
        <button style={sectionHeaderStyle} onClick={() => toggleSection('brand')} aria-expanded={expandedSections.brand}>
          Brand
          <img
            src={chevronDown}
            alt=''
            style={{
              width: '16px',
              height: '16px',
              transform: expandedSections.brand ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
        {expandedSections.brand && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {BRANDS.map(brand => (
              <li key={brand}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input
                    type='checkbox'
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }}
                  />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ borderBottom: `1px solid ${tokens.colorBorder}`, paddingBottom: '16px', marginBottom: '16px' }}>
        <button style={sectionHeaderStyle} onClick={() => toggleSection('price')} aria-expanded={expandedSections.price}>
          Price
          <img
            src={chevronDown}
            alt=''
            style={{
              width: '16px',
              height: '16px',
              transform: expandedSections.price ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
        {expandedSections.price && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PRICE_RANGES.map(range => (
              <li key={range.label}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input
                    type='radio'
                    name='priceRange'
                    checked={filters.priceRange?.label === range.label}
                    onChange={() => selectPriceRange(range)}
                    style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }}
                  />
                  {range.label}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button style={sectionHeaderStyle} onClick={() => toggleSection('rating')} aria-expanded={expandedSections.rating}>
          Rating
          <img
            src={chevronDown}
            alt=''
            style={{
              width: '16px',
              height: '16px',
              transform: expandedSections.rating ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
        {expandedSections.rating && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[4, 3, 2, 1].map(r => (
              <li key={r}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input
                    type='radio'
                    name='minRating'
                    checked={filters.minRating === r}
                    onChange={() => selectRating(r)}
                    style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }}
                  />
                  {r}+ stars
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <nav aria-label='Pagination' style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label='Previous page'
        style={{
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: '10px',
          background: tokens.colorSurface,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.4 : 1,
        }}
      >
        <img src={chevronLeft} alt='' style={{ width: '16px', height: '16px' }} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
          acc.push(p);
          return acc;
        }, [])
        .map((item, idx) =>
          item === '...' ? (
            <span
              key={`ellipsis-${idx}`}
              style={{ padding: '0 8px', color: tokens.colorMuted, lineHeight: '44px' }}
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
              style={{
                minWidth: '44px',
                minHeight: '44px',
                border: `1px solid ${item === currentPage ? tokens.colorPrimary : tokens.colorBorder}`,
                borderRadius: '10px',
                background: item === currentPage ? tokens.colorPrimary : tokens.colorSurface,
                color: item === currentPage ? '#ffffff' : tokens.colorInk,
                fontWeight: item === currentPage ? '600' : '400',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {item}
            </button>
          )
        )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label='Next page'
        style={{
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${tokens.colorBorder}`,
          borderRadius: '10px',
          background: tokens.colorSurface,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.4 : 1,
        }}
      >
        <img src={chevronRight} alt='' style={{ width: '16px', height: '16px' }} />
      </button>
    </nav>
  );
}

export default function CategoryProductListing() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({ brands: [], priceRange: null, minRating: null });
  const [sort, setSort] = useState('relevance');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const category = MOCK_CATEGORIES[slug] || { name: slug ? slug.replace(/-/g, ' ') : 'Category', description: '' };
  const allProducts = generateCategoryProducts(slug || 'category');

  const applyFilters = useCallback(
    products => {
      let result = [...products];
      if (filters.brands.length > 0) {
        result = result.filter(p => filters.brands.includes(p.brand));
      }
      if (filters.priceRange) {
        result = result.filter(p => {
          const price = parseFloat(p.price);
          const { min, max } = filters.priceRange;
          return price >= min && (max === null || price <= max);
        });
      }
      if (filters.minRating) {
        result = result.filter(p => p.rating >= filters.minRating);
      }
      if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
      if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      return result;
    },
    [filters, sort]
  );

  const filteredProducts = applyFilters(allProducts);
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = page => {
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', String(page)); return next; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', '1'); return next; });
  };

  return (
    <div
      style={{
        backgroundColor: tokens.colorCanvas,
        minHeight: '100vh',
        fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: tokens.colorBody,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        <nav aria-label='Breadcrumb' style={{ marginBottom: '16px' }}>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <li>
              <Link to='/' style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Home</Link>
            </li>
            <li style={{ color: tokens.colorMuted }}>{'/'}</li>
            <li>
              <Link to='/products' style={{ color: tokens.colorPrimary, textDecoration: 'none' }}>Products</Link>
            </li>
            <li style={{ color: tokens.colorMuted }}>{'/'}</li>
            <li style={{ color: tokens.colorMuted }} aria-current='page'>{category.name}</li>
          </ol>
        </nav>

        <header style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              lineHeight: '40px',
              color: tokens.colorInk,
              margin: '0 0 8px',
            }}
          >
            {category.name}
          </h1>
          {category.description && (
            <p style={{ fontSize: '16px', color: tokens.colorMuted, margin: 0 }}>{category.description}</p>
          )}
        </header>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <p style={{ fontSize: '14px', color: tokens.colorMuted, margin: 0 }}>
                <strong style={{ color: tokens.colorInk }}>{totalCount}</strong> product{totalCount !== 1 ? 's' : ''} in {category.name}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor='sort-select' style={{ fontSize: '14px', color: tokens.colorBody, whiteSpace: 'nowrap' }}>
                  Sort by:
                </label>
                <select
                  id='sort-select'
                  value={sort}
                  onChange={e => { setSort(e.target.value); handlePageChange(1); }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${tokens.colorBorder}`,
                    fontSize: '14px',
                    color: tokens.colorInk,
                    backgroundColor: tokens.colorSurface,
                    minHeight: '44px',
                    cursor: 'pointer',
                  }}
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {pagedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                <img src={emptyState} alt='No products found' style={{ width: '120px', marginBottom: '24px', opacity: 0.6 }} />
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: tokens.colorInk, marginBottom: '8px' }}>No products found</h2>
                <p style={{ color: tokens.colorMuted }}>Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px',
                }}
              >
                {pagedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
