import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import searchIcon from '@/assets/icons/search.svg';
import emptyState from '@/assets/images/empty-state.svg';

const styles = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px',
    color: '#212529',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: 0,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    borderBottom: '1px solid #868e96',
    backgroundColor: '#f8f9fa',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#343a40',
    borderBottom: '1px solid #e9ecef',
    verticalAlign: 'middle',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '44px',
    minWidth: '44px',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    color: '#495057',
  },
  emptyImg: {
    width: '120px',
    marginBottom: '16px',
    opacity: 0.6,
  },
  skeletonRow: {
    height: '48px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    marginBottom: '8px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
};

const MOCK_PRODUCTS = [
  { id: 1, name: 'Classic White Tee', slug: 'classic-white-tee', category: 'Apparel', brand: 'CoreWear', basePrice: 29.99, active: true },
  { id: 2, name: 'Running Shorts Pro', slug: 'running-shorts-pro', category: 'Apparel', brand: 'SpeedFit', basePrice: 49.99, active: true },
  { id: 3, name: 'Leather Wallet', slug: 'leather-wallet', category: 'Accessories', brand: 'NovaCraft', basePrice: 79.99, active: false },
];

export default function AdminProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        <Link to="/admin/catalogue/products/new" style={styles.btnPrimary}>
          <img src={plusIcon} alt="" width={16} height={16} />
          New Product
        </Link>
      </div>

      {error && <div style={styles.errorBanner}>{error}</div>}

      <div style={styles.searchBar}>
        <img src={searchIcon} alt="Search" width={16} height={16} style={{ color: '#868e96' }} />
        <input
          style={styles.searchInput}
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={{ padding: '24px' }}>
            {[1, 2, 3].map(i => <div key={i} style={styles.skeletonRow} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <img src={emptyState} alt="" style={styles.emptyImg} />
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>No products found</p>
            <p style={{ margin: '8px 0 0', fontSize: '14px' }}>Try adjusting your search or create a new product.</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Slug</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Brand</th>
                <th style={styles.th}>Base Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td style={styles.td}>
                    <span style={{ fontWeight: 500 }}>{product.name}</span>
                  </td>
                  <td style={styles.td}>
                    <code style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '13px' }}>
                      {product.slug}
                    </code>
                  </td>
                  <td style={styles.td}>{product.category}</td>
                  <td style={styles.td}>{product.brand}</td>
                  <td style={styles.td}>${product.basePrice.toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: product.active ? '#d3f9d8' : '#e9ecef',
                      color: product.active ? '#37b24d' : '#495057',
                    }}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        style={styles.actionBtn}
                        onClick={() => navigate(`/admin/catalogue/products/${product.id}/edit`)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <img src={editIcon} alt="Edit" width={16} height={16} />
                      </button>
                      <button
                        style={{ ...styles.actionBtn, color: '#f03e3e' }}
                        onClick={() => handleDelete(product.id)}
                        aria-label={`Delete ${product.name}`}
                      >
                        <img src={trashIcon} alt="Delete" width={16} height={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
