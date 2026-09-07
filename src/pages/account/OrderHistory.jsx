import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 8px 0',
    color: '#212529',
  },
  subtext: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
  },
  filterRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '9999px',
    border: '1px solid #868e96',
    backgroundColor: '#ffffff',
    fontSize: '14px',
    color: '#212529',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '36px',
  },
  filterBtnActive: {
    padding: '8px 16px',
    borderRadius: '9999px',
    border: '1px solid #4c6ef5',
    backgroundColor: '#e8ecfd',
    fontSize: '14px',
    color: '#3b5bdb',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '36px',
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
    border: '1px solid transparent',
    transition: 'border-color 0.15s',
  },
  orderLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  orderDate: {
    fontSize: '14px',
    color: '#495057',
  },
  orderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  orderTotal: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: '3px',
    padding: '3px 10px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 16px',
    color: '#495057',
  },
  backLink: {
    color: '#4c6ef5',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '24px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
};

const STATUS_COLORS = {
  Processing: { bg: '#e8ecfd', color: '#3b5bdb' },
  Shipped: { bg: '#fff3e6', color: '#fd7e14' },
  Delivered: { bg: '#d3f9d8', color: '#37b24d' },
  Cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  'Return requested': { bg: '#fff4e6', color: '#fd7e14' },
};

const ORDERS = [
  { id: 'ORD-10045', date: 'Jun 10, 2024', total: '$142.00', status: 'Delivered', items: 3 },
  { id: 'ORD-10044', date: 'May 28, 2024', total: '$89.50', status: 'Shipped', items: 1 },
  { id: 'ORD-10043', date: 'May 15, 2024', total: '$220.00', status: 'Processing', items: 2 },
  { id: 'ORD-10042', date: 'Apr 30, 2024', total: '$55.00', status: 'Cancelled', items: 1 },
  { id: 'ORD-10041', date: 'Apr 12, 2024', total: '$310.00', status: 'Return requested', items: 4 },
];

const FILTERS = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Return requested'];

export default function OrderHistory() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All' ? ORDERS : ORDERS.filter(o => o.status === activeFilter);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backLink} onClick={() => navigate('/account')}>← Back to account</button>
        <h1 style={styles.heading}>Order history</h1>
        <p style={styles.subtext}>View and manage your past orders.</p>

        <div style={styles.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              style={activeFilter === f ? styles.filterBtnActive : styles.filterBtn}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <img src={packageIcon} alt="" style={{ width: '48px', height: '48px', opacity: 0.4, marginBottom: '16px', display: 'block', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', color: '#212529', margin: '0 0 8px' }}>No orders found.</p>
            <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>No orders match the current filter.</p>
          </div>
        ) : (
          filtered.map(order => {
            const statusStyle = STATUS_COLORS[order.status] || { bg: '#e9ecef', color: '#495057' };
            return (
              <div
                key={order.id}
                style={styles.orderCard}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/account/orders/${order.id}`)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/account/orders/${order.id}`)}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4c6ef5'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div style={styles.orderLeft}>
                  <span style={styles.orderId}>{order.id}</span>
                  <span style={styles.orderDate}>{order.date} · {order.items} item{order.items !== 1 ? 's' : ''}</span>
                </div>
                <div style={styles.orderRight}>
                  <span style={styles.orderTotal}>{order.total}</span>
                  <span style={{ ...styles.badge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>{order.status}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
