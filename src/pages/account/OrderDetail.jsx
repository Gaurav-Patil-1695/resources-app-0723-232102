import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    lineHeight: '40px',
    margin: '0 0 4px 0',
    color: '#212529',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '20px',
  },
  sectionHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '16px',
    marginTop: 0,
  },
  badge: {
    display: 'inline-block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderRadius: '3px',
    padding: '3px 10px',
    marginLeft: '12px',
    verticalAlign: 'middle',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    position: 'relative',
    paddingLeft: '24px',
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: '20px',
    paddingLeft: '16px',
  },
  timelineDot: {
    position: 'absolute',
    left: '-24px',
    top: '4px',
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    border: '2px solid #ffffff',
    boxShadow: '0 0 0 2px #4c6ef5',
  },
  timelineDotInactive: {
    position: 'absolute',
    left: '-24px',
    top: '4px',
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    border: '2px solid #ffffff',
    boxShadow: '0 0 0 2px #868e96',
  },
  timelineLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  timelineDate: {
    fontSize: '12px',
    color: '#495057',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemImg: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#f8f9fa',
    flexShrink: 0,
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 4px',
  },
  itemMeta: {
    fontSize: '14px',
    color: '#495057',
    margin: 0,
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginLeft: 'auto',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    fontSize: '14px',
    color: '#495057',
  },
  totalRowBold: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0 0',
    fontSize: '16px',
    fontWeight: '700',
    color: '#212529',
    borderTop: '1px solid #e9ecef',
    marginTop: '8px',
  },
  actionRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '12px 20px',
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  btnDanger: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#f03e3e',
    border: '1px solid #f03e3e',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
  },
  btnGhost: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    minHeight: '44px',
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
  errorPanel: {
    backgroundColor: '#ffe3e3',
    borderRadius: '10px',
    padding: '32px',
    textAlign: 'center',
    marginTop: '32px',
  },
  trackingBadge: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    backgroundColor: '#e8ecfd',
    color: '#3b5bdb',
    borderRadius: '6px',
    padding: '4px 10px',
    display: 'inline-block',
    marginTop: '8px',
  },
};

const STATUS_COLORS = {
  Processing: { bg: '#e8ecfd', color: '#3b5bdb' },
  Shipped: { bg: '#fff3e6', color: '#fd7e14' },
  Delivered: { bg: '#d3f9d8', color: '#37b24d' },
  Cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
  'Return requested': { bg: '#fff4e6', color: '#fd7e14' },
};

const ORDERS = {
  'ORD-10045': {
    id: 'ORD-10045',
    date: 'Jun 10, 2024',
    status: 'Delivered',
    tracking: 'USPS1234567890',
    items: [
      { id: 'i1', name: 'Classic White Sneakers', sku: 'SKU-001', qty: 1, price: '$95.00' },
      { id: 'i2', name: 'Canvas Tote Bag', sku: 'SKU-045', qty: 2, price: '$47.00' },
    ],
    subtotal: '$142.00',
    shipping: '$0.00',
    total: '$142.00',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
  },
  'ORD-10044': {
    id: 'ORD-10044',
    date: 'May 28, 2024',
    status: 'Shipped',
    tracking: 'FEDEX9876543210',
    items: [
      { id: 'i3', name: 'Running Shoes (Size 10)', sku: 'SKU-089', qty: 1, price: '$89.50' },
    ],
    subtotal: '$89.50',
    shipping: '$0.00',
    total: '$89.50',
    address: '456 Oak Avenue, Brooklyn, NY 11201',
  },
};

const TIMELINE_STEPS = {
  Processing: ['Order placed', 'Processing', 'Shipped', 'Delivered'],
  Shipped: ['Order placed', 'Processing', 'Shipped', 'Delivered'],
  Delivered: ['Order placed', 'Processing', 'Shipped', 'Delivered'],
  Cancelled: ['Order placed', 'Cancelled'],
  'Return requested': ['Order placed', 'Processing', 'Shipped', 'Delivered', 'Return requested'],
};

const COMPLETED_STEPS = {
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 2,
  'Return requested': 5,
};

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const order = ORDERS[id];
  const [cancelled, setCancelled] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (!order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button style={styles.backLink} onClick={() => navigate('/account/orders')}>← Back to order history</button>
          <div style={styles.errorPanel}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#f03e3e', marginBottom: '8px' }}>Order not found or you do not have permission to view it.</p>
            <button style={styles.backLink} onClick={() => navigate('/account/orders')}>← Back to order history</button>
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[cancelled ? 'Cancelled' : order.status] || { bg: '#e9ecef', color: '#495057' };
  const displayStatus = cancelled ? 'Cancelled' : order.status;
  const steps = TIMELINE_STEPS[displayStatus] || TIMELINE_STEPS['Processing'];
  const completedCount = COMPLETED_STEPS[displayStatus] || 1;
  const canCancel = !cancelled && order.status === 'Processing';
  const canReturn = !cancelled && order.status === 'Delivered';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {toast && (
          <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 1000, backgroundColor: toast.type === 'success' ? '#d3f9d8' : '#ffe3e3', color: '#212529', padding: '12px 20px', borderRadius: '10px', fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
            {toast.msg}
          </div>
        )}
        <button style={styles.backLink} onClick={() => navigate('/account/orders')}>← Back to order history</button>
        <h1 style={styles.heading}>
          Order Detail
          <span style={{ ...styles.badge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>{displayStatus}</span>
        </h1>
        <div style={styles.orderId}>{order.id} · Placed {order.date}</div>

        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Status timeline</h2>
          <div style={styles.timeline}>
            {steps.map((step, idx) => (
              <div key={step} style={{ ...styles.timelineItem, paddingBottom: idx === steps.length - 1 ? 0 : '20px' }}>
                <div style={idx < completedCount ? styles.timelineDot : styles.timelineDotInactive} />
                <div style={{ ...styles.timelineLabel, color: idx < completedCount ? '#212529' : '#adb5bd' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {order.tracking && !cancelled && (
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Tracking</h2>
            <p style={{ fontSize: '14px', color: '#495057', margin: '0 0 8px' }}>Your package is on its way.</p>
            <span style={styles.trackingBadge}>{order.tracking}</span>
          </div>
        )}

        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Items</h2>
          {order.items.map((item, idx) => (
            <div key={item.id} style={{ ...styles.itemRow, borderBottom: idx === order.items.length - 1 ? 'none' : '1px solid #e9ecef' }}>
              <img src={placeholderProduct} alt={item.name} style={styles.itemImg} />
              <div>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemMeta}>SKU: {item.sku} · Qty: {item.qty}</p>
              </div>
              <span style={styles.itemPrice}>{item.price}</span>
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            <div style={styles.totalRow}><span>Subtotal</span><span>{order.subtotal}</span></div>
            <div style={styles.totalRow}><span>Shipping</span><span>{order.shipping}</span></div>
            <div style={styles.totalRowBold}><span>Total</span><span>{order.total}</span></div>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Delivery address</h2>
          <p style={{ fontSize: '14px', color: '#495057', margin: 0 }}>{order.address}</p>
        </div>

        <div style={styles.actionRow}>
          {canReturn && (
            <button style={styles.btnPrimary} onClick={() => navigate(`/account/orders/${id}/return`)}>
              Request return
            </button>
          )}
          {canCancel && (
            <button style={styles.btnDanger} onClick={() => { setCancelled(true); showToast('Order cancelled successfully.', 'success'); }}>
              Cancel order
            </button>
          )}
          <button style={styles.btnGhost} onClick={() => navigate('/account/orders')}>
            Back to orders
          </button>
        </div>
      </div>
    </div>
  );
}
