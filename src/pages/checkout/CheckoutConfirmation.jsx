import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import checkIcon from '@/assets/icons/check.svg';
import packageIcon from '@/assets/icons/package.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    padding: '40px 16px',
  },
  container: {
    maxWidth: '680px',
    margin: '0 auto',
  },
  successBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    margin: '0 auto 24px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '40px',
    letterSpacing: '-0.02em',
    color: '#212529',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '16px',
    color: '#495057',
    lineHeight: '24px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  orderId: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    fontSize: '14px',
    color: '#4c6ef5',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: '0.04em',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '20px',
    border: '1px solid #e9ecef',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '15px',
    color: '#343a40',
    lineHeight: '24px',
    borderBottom: '1px solid #f1f3f5',
  },
  summaryRowLast: {
    borderBottom: 'none',
    fontWeight: '700',
    fontSize: '17px',
    color: '#212529',
    paddingTop: '12px',
    marginTop: '4px',
    borderTop: '2px solid #e9ecef',
  },
  addressBlock: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#343a40',
  },
  statusTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    position: 'relative',
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    borderRadius: '9999px',
    backgroundColor: '#4c6ef5',
    flexShrink: 0,
    marginTop: '4px',
    position: 'relative',
    zIndex: 1,
  },
  timelineDotInactive: {
    backgroundColor: '#e9ecef',
    border: '2px solid #adb5bd',
  },
  timelineConnector: {
    width: '2px',
    height: '28px',
    backgroundColor: '#e9ecef',
    marginLeft: '5px',
  },
  timelineLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    lineHeight: '20px',
  },
  timelineDesc: {
    fontSize: '12px',
    color: '#868e96',
    lineHeight: '16px',
    marginTop: '2px',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '32px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 0.15s',
  },
  secondaryBtn: {
    padding: '12px 28px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#4c6ef5',
    backgroundColor: 'transparent',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 0.15s',
  },
  guestRegisterBanner: {
    backgroundColor: '#e8ecfd',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    padding: '20px 24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  guestRegisterTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '6px',
  },
  guestRegisterDesc: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '14px',
    lineHeight: '20px',
  },
  guestRegisterBtn: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 0.15s',
  },
};

const STATUS_STEPS = [
  { label: 'Order Confirmed', desc: 'We have received your order.', active: true },
  { label: 'Processing', desc: 'Your order is being prepared.', active: false },
  { label: 'Shipped', desc: 'Your order is on its way.', active: false },
  { label: 'Delivered', desc: 'Estimated in 3–5 business days.', active: false },
];

export default function CheckoutConfirmation() {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isGuest] = useState(!localStorage.getItem('authToken'));

  useEffect(() => {
    const stored = sessionStorage.getItem('lastOrder');
    if (stored) {
      setOrder(JSON.parse(stored));
    }
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.successBadge} role="img" aria-label="Order confirmed">
          <img src={checkIcon} alt="" width={36} height={36} style={{ filter: 'invert(48%) sepia(79%) saturate(476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }} />
        </div>

        <h1 style={styles.heading}>Order Confirmed!</h1>
        <p style={styles.subheading}>
          Thank you for your purchase. A confirmation email has been sent to your inbox.
        </p>
        {order && (
          <div style={styles.orderId}>Order ID: {order.orderId}</div>
        )}

        {/* Guest register prompt */}
        {isGuest && (
          <div style={styles.guestRegisterBanner}>
            <div style={styles.guestRegisterTitle}>Save your details for faster checkout</div>
            <div style={styles.guestRegisterDesc}>Create a free account to track orders, save addresses, and checkout faster next time.</div>
            <Link
              to="/checkout/register"
              style={styles.guestRegisterBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
            >
              Create Account
            </Link>
          </div>
        )}

        {/* Order summary */}
        {order && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <img src={packageIcon} alt="" width={18} height={18} />
              Order Summary
            </div>
            {order.items && order.items.map((item) => (
              <div key={item.id} style={styles.summaryRow}>
                <span>{item.name} × {item.qty}</span>
                <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            {order.promoDiscount > 0 && (
              <div style={{ ...styles.summaryRow, color: '#2b8a3e' }}>
                <span>Promo Discount</span>
                <span>− ₹{order.promoDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div style={styles.summaryRow}>
              <span>Shipping</span>
              <span>{order.shippingCharge === 0 ? <span style={{ color: '#2b8a3e' }}>FREE</span> : `₹${order.shippingCharge}`}</span>
            </div>
            <div style={styles.summaryRow}>
              <span>GST (18%)</span>
              <span>₹{order.tax?.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ ...styles.summaryRow, ...styles.summaryRowLast }}>
              <span>Total Paid</span>
              <span>₹{order.total?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Delivery address */}
        {order?.address && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Delivering To</div>
            <div style={styles.addressBlock}>
              <div style={{ fontWeight: '600' }}>{order.address.fullName}</div>
              <div>{order.address.addressLine1}</div>
              {order.address.addressLine2 && <div>{order.address.addressLine2}</div>}
              <div>{order.address.city}, {order.address.state} — {order.address.pin}</div>
            </div>
          </div>
        )}

        {/* Tracking timeline */}
        <div style={styles.card}>
          <div style={styles.cardTitle}>Order Status</div>
          <div style={styles.statusTimeline}>
            {STATUS_STEPS.map((step, idx) => (
              <div key={step.label}>
                <div style={styles.timelineItem}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ ...styles.timelineDot, ...(step.active ? {} : styles.timelineDotInactive) }} />
                    {idx < STATUS_STEPS.length - 1 && <div style={styles.timelineConnector} />}
                  </div>
                  <div style={{ paddingBottom: idx < STATUS_STEPS.length - 1 ? '4px' : '0' }}>
                    <div style={{ ...styles.timelineLabel, color: step.active ? '#4c6ef5' : '#212529' }}>{step.label}</div>
                    <div style={styles.timelineDesc}>{step.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.actions}>
          <Link
            to="/orders"
            style={styles.primaryBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
          >
            View My Orders
          </Link>
          <Link
            to="/"
            style={styles.secondaryBtn}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e8ecfd'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
