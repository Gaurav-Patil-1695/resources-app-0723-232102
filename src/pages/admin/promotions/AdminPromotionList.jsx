import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import editIcon from '@/assets/icons/edit.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';

const MOCK_PROMOTIONS = [
  {
    id: 1,
    code: 'SAVE10',
    type: 'percentage',
    discount: 10,
    expiry: '2025-12-31',
    active: true,
  },
  {
    id: 2,
    code: 'FLAT20',
    type: 'fixed',
    discount: 20,
    expiry: '2025-06-30',
    active: true,
  },
  {
    id: 3,
    code: 'SUMMER15',
    type: 'percentage',
    discount: 15,
    expiry: '2024-08-31',
    active: false,
  },
];

export default function AdminPromotionList() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetch
    setTimeout(() => {
      setPromotions(MOCK_PROMOTIONS);
      setLoading(false);
    }, 300);
  }, []);

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this promo code?')) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  }

  function formatDiscount(type, discount) {
    if (type === 'percentage') return `${discount}%`;
    if (type === 'fixed') return `$${discount.toFixed(2)}`;
    return discount;
  }

  function isExpired(expiry) {
    return new Date(expiry) < new Date();
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Promo Codes</h1>
        <button
          style={styles.addButton}
          onClick={() => navigate('/admin/promotions/new')}
        >
          <img src={plusIcon} alt="" style={styles.buttonIcon} />
          New Promo Code
        </button>
      </div>

      {loading ? (
        <p style={styles.loadingText}>Loading promotions...</p>
      ) : promotions.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No promo codes found.</p>
          <Link to="/admin/promotions/new" style={styles.emptyLink}>
            Create your first promo code
          </Link>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.theadRow}>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Discount</th>
                <th style={styles.th}>Expiry</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} style={styles.tbodyRow}>
                  <td style={styles.td}>
                    <span style={styles.codeTag}>{promo.code}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>
                      {promo.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDiscount(promo.type, promo.discount)}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.expiry,
                        color: isExpired(promo.expiry) ? '#dc2626' : '#374151',
                      }}
                    >
                      {promo.expiry}
                      {isExpired(promo.expiry) && (
                        <span style={styles.expiredLabel}> (Expired)</span>
                      )}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: promo.active && !isExpired(promo.expiry) ? '#d1fae5' : '#fee2e2',
                        color: promo.active && !isExpired(promo.expiry) ? '#065f46' : '#991b1b',
                      }}
                    >
                      {promo.active && !isExpired(promo.expiry) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        style={styles.iconButton}
                        onClick={() => navigate(`/admin/promotions/${promo.id}/edit`)}
                        title="Edit"
                      >
                        <img src={editIcon} alt="Edit" style={styles.actionIcon} />
                      </button>
                      <button
                        style={{ ...styles.iconButton, ...styles.deleteButton }}
                        onClick={() => handleDelete(promo.id)}
                        title="Delete"
                      >
                        <img src={trashIcon} alt="Delete" style={styles.actionIcon} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  buttonIcon: {
    width: '16px',
    height: '16px',
    filter: 'brightness(0) invert(1)',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 0',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '16px',
    marginBottom: '12px',
  },
  emptyLink: {
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
  },
  theadRow: {
    backgroundColor: '#f9fafb',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid #e5e7eb',
  },
  tbodyRow: {
    borderBottom: '1px solid #f3f4f6',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#374151',
    verticalAlign: 'middle',
  },
  codeTag: {
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '0.05em',
  },
  typeBadge: {
    fontSize: '13px',
    color: '#374151',
  },
  expiry: {
    fontSize: '14px',
  },
  expiredLabel: {
    fontSize: '12px',
    fontWeight: '600',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  iconButton: {
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    borderColor: '#fecaca',
    backgroundColor: '#fff5f5',
  },
  actionIcon: {
    width: '16px',
    height: '16px',
  },
};
