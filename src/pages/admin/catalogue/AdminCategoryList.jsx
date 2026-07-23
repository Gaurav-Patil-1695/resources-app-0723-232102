import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  treeItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    gap: '8px',
  },
  treeItemChild: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 16px 10px 40px',
    borderBottom: '1px solid #e9ecef',
    gap: '8px',
    backgroundColor: '#f8f9fa',
  },
  categoryName: {
    flex: 1,
    fontSize: '14px',
    fontWeight: 500,
    color: '#212529',
  },
  categoryMeta: {
    fontSize: '12px',
    color: '#495057',
    marginRight: '12px',
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
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    backgroundColor: '#e8ecfd',
    color: '#4c6ef5',
    marginRight: '8px',
  },
};

const MOCK_CATEGORIES = [
  { id: 1, name: 'Apparel', slug: 'apparel', parentId: null, productCount: 12 },
  { id: 4, name: 'T-Shirts', slug: 't-shirts', parentId: 1, productCount: 5 },
  { id: 5, name: 'Shorts', slug: 'shorts', parentId: 1, productCount: 7 },
  { id: 2, name: 'Accessories', slug: 'accessories', parentId: null, productCount: 8 },
  { id: 6, name: 'Wallets', slug: 'wallets', parentId: 2, productCount: 3 },
  { id: 3, name: 'Footwear', slug: 'footwear', parentId: null, productCount: 15 },
];

export default function AdminCategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setCategories(MOCK_CATEGORIES);
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id && c.parentId !== id));
    }
  };

  const roots = categories.filter(c => c.parentId === null);
  const childrenOf = (parentId) => categories.filter(c => c.parentId === parentId);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Categories</h1>
        <Link to="/admin/catalogue/categories/new" style={styles.btnPrimary}>
          <img src={plusIcon} alt="" width={16} height={16} />
          New Category
        </Link>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={{ padding: '24px' }}>
            {[1, 2, 3].map(i => <div key={i} style={styles.skeletonRow} />)}
          </div>
        ) : roots.length === 0 ? (
          <div style={styles.emptyState}>
            <img src={emptyState} alt="" style={styles.emptyImg} />
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>No categories yet</p>
            <p style={{ margin: '8px 0 0', fontSize: '14px' }}>Create your first category to get started.</p>
          </div>
        ) : (
          roots.map(root => (
            <React.Fragment key={root.id}>
              <div style={styles.treeItem}>
                <img src={chevronRightIcon} alt="" width={14} height={14} />
                <span style={styles.categoryName}>{root.name}</span>
                <span style={styles.categoryMeta}>{root.productCount} products</span>
                <button
                  style={styles.actionBtn}
                  onClick={() => navigate(`/admin/catalogue/categories/${root.id}/edit`)}
                  aria-label={`Edit ${root.name}`}
                >
                  <img src={editIcon} alt="Edit" width={16} height={16} />
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => handleDelete(root.id)}
                  aria-label={`Delete ${root.name}`}
                >
                  <img src={trashIcon} alt="Delete" width={16} height={16} />
                </button>
              </div>
              {childrenOf(root.id).map(child => (
                <div key={child.id} style={styles.treeItemChild}>
                  <span style={styles.badge}>sub</span>
                  <span style={styles.categoryName}>{child.name}</span>
                  <span style={styles.categoryMeta}>{child.productCount} products</span>
                  <button
                    style={styles.actionBtn}
                    onClick={() => navigate(`/admin/catalogue/categories/${child.id}/edit`)}
                    aria-label={`Edit ${child.name}`}
                  >
                    <img src={editIcon} alt="Edit" width={16} height={16} />
                  </button>
                  <button
                    style={styles.actionBtn}
                    onClick={() => handleDelete(child.id)}
                    aria-label={`Delete ${child.name}`}
                  >
                    <img src={trashIcon} alt="Delete" width={16} height={16} />
                  </button>
                </div>
              ))}
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
}
