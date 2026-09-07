import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import emptyState from '@/assets/images/empty-state.svg';
import searchIcon from '@/assets/icons/search.svg';
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
  colorSecondarySubtle: '#fff3e6',
  colorSecondary: '#fd7e14',
};

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
];

const FACETS = {
  categories: ['Electronics', 'Clothing', 'Home & Garden', 'Sports'],
  brands: ['Alpha', 'Beta', 'Gamma', 'Delta'],
  priceRanges: [
    { label: 'Under $25', min: 0, max: 25 },
    { label: '$25 – $50', min: 25, max: 50 },
    { label: '$50 – $100', min: 50, max: 100 },
    { label: 'Over $100', min: 100, max: null },
  ],
  ratings: [4, 3, 2, 1],
};

function generateSearchProducts(query = '', count = 32) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    slug: `search-result-${i + 1}`,
    name: query
      ? `${query.charAt(0).toUpperCase() + query.slice(1)} Item ${i + 1}`
      : `Search Result ${i + 1}`,
    brand: FACETS.brands[i % FACETS.brands.length],
    category: FACETS.categories[i % FACETS.categories.length],
    price: parseFloat((12.99 + i * 5.1).toFixed(2)),
    taxInclusivePrice: parseFloat((12.99 + i * 5.1) * 1.1).toFixed(2),
    rating: parseFloat((3.0 + (i % 5) * 0.4).toFixed(1)),
    reviewCount: 8 + i * 2,
    image: null,
    inStock: i % 5 !== 0,
  }));
}

function ProductCard({ product, query }) {
  const [wishlisted, setWishlisted] = useState(false);

  const highlightQuery = (text, q) => {
    if (!q || q.trim() === '') return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{
            backgroundColor: tokens.colorSecondarySubtle,
            color: tokens.colorInk,
            fontWeight: '600',
            borderRadius: '2px',
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

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
          <img src={heartIcon} alt='' style={{ width: '16px', height: '16px', opacity: wishlisted ? 1 : 0.4 }} />
        </button>
      </div>
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '12px',
              color: tokens.colorMuted,
              backgroundColor: tokens.colorCanvas,
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: '3px',
              padding: '1px 6px',
            }}
          >
            {product.category}
          </span>
        </div>
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
          {highlightQuery(product.name, query)}
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
          <span style={{ fontSize: '12px', fontWeight: '400', color: tokens.colorMuted, marginLeft: '4px' }}>incl. tax</span>
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

function FacetSidebar({ facets, onFacetChange }) {
  const [expanded, setExpanded] = useState({ category: true, brand: true, price: true, rating: true });

  const toggle = key => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = cat => {
    const next = facets.categories.includes(cat)
      ? facets.categories.filter(c => c !== cat)
      : [...facets.categories, cat];
    onFacetChange({ ...facets, categories: next });
  };

  const toggleBrand = brand => {
    const next = facets.brands.includes(brand)
      ? facets.brands.filter(b => b !== brand)
      : [...facets.brands, brand];
    onFacetChange({ ...facets, brands: next });
  };

  const selectPrice = range => {
    onFacetChange({ ...facets, priceRange: range });
  };

  const selectRating = rating => {
    onFacetChange({ ...facets, minRating: facets.minRating === rating ? null : rating });
  };

  const headerStyle = {
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

  const sectionStyle = {
    borderBottom: `1px solid ${tokens.colorBorder}`,
    paddingBottom: '16px',
    marginBottom: '16px',
  };

  const hasActiveFacets =
    facets.categories.length > 0 ||
    facets.brands.length > 0 ||
    facets.priceRange !== null ||
    facets.minRating !== null;

  return (
    <aside
      aria-label='Search facet filters'
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
        <h2 style={{ fontSize: '16px', fontWeight: '700', color: tokens.colorInk, margin: 0 }}>Refine</h2>
        {hasActiveFacets && (
          <button
            onClick={() => onFacetChange({ categories: [], brands: [], priceRange: null, minRating: null })}
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
        )}
      </div>

      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggle('category')} aria-expanded={expanded.category}>
          Category
          <img src={chevronDown} alt='' style={{ width: '16px', height: '16px', transform: expanded.category ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        {expanded.category && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FACETS.categories.map(cat => (
              <li key={cat}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input type='checkbox' checked={facets.categories.includes(cat)} onChange={() => toggleCategory(cat)} style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }} />
                  {cat}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggle('brand')} aria-expanded={expanded.brand}>
          Brand
          <img src={chevronDown} alt='' style={{ width: '16px', height: '16px', transform: expanded.brand ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        {expanded.brand && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FACETS.brands.map(brand => (
              <li key={brand}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input type='checkbox' checked={facets.brands.includes(brand)} onChange={() => toggleBrand(brand)} style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }} />
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={sectionStyle}>
        <button style={headerStyle} onClick={() => toggle('price')} aria-expanded={expanded.price}>
          Price
          <img src={chevronDown} alt='' style={{ width: '16px', height: '16px', transform: expanded.price ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        {expanded.price && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FACETS.priceRanges.map(range => (
              <li key={range.label}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input type='radio' name='priceRange' checked={facets.priceRange?.label === range.label} onChange={() => selectPrice(range)} style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }} />
                  {range.label}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <button style={headerStyle} onClick={() => toggle('rating')} aria-expanded={expanded.rating}>
          Rating
          <img src={chevronDown} alt='' style={{ width: '16px', height: '16px', transform: expanded.rating ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
        </button>
        {expanded.rating && (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {FACETS.ratings.map(r => (
              <li key={r}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: tokens.colorBody }}>
                  <input type='radio' name='minRating' checked={facets.minRating === r} onChange={() => selectRating(r)} style={{ accentColor: tokens.colorPrimary, width: '16px', height: '16px' }} />
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
            <span key={`ellipsis-${idx}`} style={{ padding: '0 8px', color: tokens.colorMuted, lineHeight: '44px' }}>…</span>
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

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [sort, setSort] = useState('relevance');
  const [facets, setFacets] = useState({ categories: [], brands: [], priceRange: null, minRating: null });
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  const allProducts = generateSearchProducts(query);

  const applyFacets = useCallback(
    products => {
      let result = [...products];
      if (facets.categories.length > 0) {
        result = result.filter(p => facets.categories.includes(p.category));
      }
      if (facets.brands.length > 0) {
        result = result.filter(p => facets.brands.includes(p.brand));
      }
      if (facets.priceRange) {
        result = result.filter(p => {
          const price = parseFloat(p.price);
          const { min, max } = facets.priceRange;
          return price >= min && (max === null || price <= max);
        });
      }
      if (facets.minRating) {
        result = result.filter(p => p.rating >= facets.minRating);
      }
      if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
      if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
      if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
      return result;
    },
    [facets, sort]
  );

  const filteredProducts = applyFacets(allProducts);
  const totalCount = filteredProducts.length;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = page => {
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', String(page)); return next; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFacetChange = newFacets => {
    setFacets(newFacets);
    setSearchParams(prev => { const next = new URLSearchParams(prev); next.set('page', '1'); return next; });
  };

  const handleSearch = e => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setSearchParams({ q: trimmed, page: '1' });
    setFacets({ categories: [], brands: [], priceRange: null, minRating: null });
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
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              lineHeight: '40px',
              color: tokens.colorInk,
              margin: '0 0 20px',
            }}
          >
            Search Results
          </h1>
          <form onSubmit={handleSearch} role='search' style={{ display: 'flex', gap: '8px', maxWidth: '600px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <img
                src={searchIcon}
                alt=''
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '18px',
                  height: '18px',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />
              <input
                ref={inputRef}
                type='search'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder='Search products...'
                aria-label='Search products'
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 42px',
                  borderRadius: '6px',
                  border: `1px solid ${tokens.colorBorder}`,
                  fontSize: '16px',
                  color: tokens.colorInk,
                  backgroundColor: tokens.colorSurface,
                  minHeight: '44px',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = tokens.colorPrimary)}
                onBlur={e => (e.target.style.borderColor = tokens.colorBorder)}
              />
            </div>
            <button
              type='submit'
              style={{
                backgroundColor: tokens.colorPrimary,
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                minHeight: '44px',
                whiteSpace: 'nowrap',
              }}
            >
              Search
            </button>
          </form>
        </header>

        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <FacetSidebar facets={facets} onFacetChange={handleFacetChange} />

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
                {query ? (
                  <>
                    <strong style={{ color: tokens.colorInk }}>{totalCount}</strong> result{totalCount !== 1 ? 's' : ''} for{' '}
                    <strong style={{ color: tokens.colorInk }}>&ldquo;{query}&rdquo;</strong>
                  </>
                ) : (
                  <><strong style={{ color: tokens.colorInk }}>{totalCount}</strong> product{totalCount !== 1 ? 's' : ''}</>
                )}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label htmlFor='sort-select' style={{ fontSize: '14px', color: tokens.colorBody, whiteSpace: 'nowrap' }}>Sort by:</label>
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
                <img src={emptyState} alt='No results found' style={{ width: '120px', marginBottom: '24px', opacity: 0.6 }} />
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: tokens.colorInk, marginBottom: '8px' }}>No results found</h2>
                <p style={{ color: tokens.colorMuted, marginBottom: '20px' }}>
                  {query ? `We couldn't find anything for "${query}". Try different keywords.` : 'Enter a search term to find products.'}
                </p>
                <Link
                  to='/products'
                  style={{
                    display: 'inline-block',
                    backgroundColor: tokens.colorPrimary,
                    color: '#ffffff',
                    padding: '10px 24px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Browse all products
                </Link>
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
                  <ProductCard key={product.id} product={product} query={query} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
