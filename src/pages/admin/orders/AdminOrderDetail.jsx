import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import packageIcon from '@/assets/icons/package.svg';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import userIcon from '@/assets/icons/user.svg';
import checkIcon from '@/assets/icons/check.svg';
import placeholderProductImg from '@/assets/images/placeholder-product.svg';

const STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

const STATUS_COLORS = {
  pending: { bg: '#fff4e6', color: '#fd7e14' },
  confirmed: { bg: '#e8ecfd', color: '#4c6ef5' },
  processing: { bg: '#e8ecfd', color: '#3b5bdb' },
  shipped: { bg: '#d3f9d8', color: '#37b24d' },
  delivered: { bg: '#d3f9d8', color: '#2f9e44' },
  cancelled: { bg: '#ffe3e3', color: '#f03e3e' },
};

const NEXT_STATUS_LABELS = {
  pending: 'Confirm Order',
  confirmed: 'Mark as Processing',
  processing: 'Mark as Shipped',
  shipped: 'Mark as Delivered',
};

const MOCK_ORDERS = {
  'ORD-10001': {
    id: 'ORD-10001',
    status: 'pending',
    createdAt: '2024-06-01T10:23:00Z',
    updatedAt: '2024-06-01T10:23:00Z',
    customer: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 555-0101',
    },
    shippingAddress: {
      line1: '123 Maple Street',
      line2: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
      country: 'US',
    },
    items: [
      { id: 1, name: 'Wireless Headphones', sku: 'WH-2024-BLK', qty: 1, unitPrice: 79.99, imageUrl: null },
      { id: 2, name: 'USB-C Charging Cable 2m', sku: 'USB-C-2M-WHT', qty: 2, unitPrice: 14.99, imageUrl: null },
      { id: 3, name: 'Phone Stand Adjustable', sku: 'STND-ADJ-SLV', qty: 1, unitPrice: 20.02, imageUrl: null },
    ],
    subtotal: 129.99,
    shippingCost: 0,
    tax: 10.40,
    total: 140.39,
    notes: 'Please leave at the front door.',
  },
  'ORD-10002': {
    id: 'ORD-10002',
    status: 'shipped',
    createdAt: '2024-06-02T14:05:00Z',
    updatedAt: '2024-06-03T09:00:00Z',
    customer: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 555-0202',
    },
    shippingAddress: {
      line1: '456 Oak Avenue',
      line2: '',
      city: 'Portland',
      state: 'OR',
      zip: '97201',
      country: 'US',
    },
    items: [
      { id: 1, name: 'Mechanical Keyboard TKL', sku: 'KB-TKL-MX-BLU', qty: 1, unitPrice: 149.50, imageUrl: null },
      { id: 2, name: 'Mouse Pad XL', sku: 'MP-XL-BLK', qty: 1, unitPrice: 29.99, imageUrl: null },
    ],
    subtotal: 179.49,
    shippingCost: 9.99,
    tax: 14.99,
    total: 204.47,
    notes: '',
  },
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: '#e9ecef', color: '#495057' };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        backgroundColor: colors.bg,
        color: colors.color,
        lineHeight: '16px',
      }}
    >
      {status}
    </span>
  );
}

function StatusStepper({ currentStatus }) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', margin: '8px 0' }}>
      {STATUS_FLOW.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isPending = i > currentIndex;
        const stepColor = isDone ? '#37b24d' : isCurrent ? '#4c6ef5' : '#adb5bd';
        const stepBg = isDone ? '#d3f9d8' : isCurrent ? '#e8ecfd' : '#e9ecef';
        return (
          <React.Fragment key={step}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                minWidth: '80px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  backgroundColor: stepBg,
                  border: `2px solid ${stepColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
                aria-label={`${step}${isDone ? ' (completed)' : isCurrent ? ' (current)' : ' (upcoming)'}`}
              >
                {isDone ? (
                  <img src={checkIcon} alt="completed" style={{ width: '14px', height: '14px' }} />
                ) : (
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      backgroundColor: stepColor,
                      display: 'block',
                    }}
                  />
                )}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isCurrent ? '600' : '400',
                  color: isCurrent ? '#4c6ef5' : isDone ? '#37b24d' : '#adb5bd',
                  textTransform: 'capitalize',
                  textAlign: 'center',
                  letterSpacing: '0.02em',
                }}
              >
                {step}
              </span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: i < currentIndex ? '#37b24d' : '#e9ecef',
                  minWidth: '20px',
                  marginBottom: '20px',
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    const timer = setTimeout(() => {
      const found = MOCK_ORDERS[id] || null;
      setOrder(found ? { ...found } : null);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [id]);

  const currentIndex = order ? STATUS_FLOW.indexOf(order.status) : -1;
  const canAdvance =
    order &&
    order.status !== 'cancelled' &&
    order.status !== 'delivered' &&
    currentIndex < STATUS_FLOW.length - 1;
  const canCancel = order && order.status !== 'cancelled' && order.status !== 'delivered';
  const nextStatus = canAdvance ? STATUS_FLOW[currentIndex + 1] : null;

  function handleAdvance() {
    if (!canAdvance) return;
    setAdvancing(true);
    setSuccessMsg('');
    setErrorMsg('');
    setTimeout(() => {
      setOrder((prev) => ({
        ...prev,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      }));
      setSuccessMsg(`Order status updated to "${nextStatus}" successfully.`);
      setAdvancing(false);
    }, 600);
  }

  function handleCancel() {
    setCancelling(true);
    setSuccessMsg('');
    setErrorMsg('');
    setShowCancelConfirm(false);
    setTimeout(() => {
      setOrder((prev) => ({
        ...prev,
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      }));
      setSuccessMsg('Order has been cancelled.');
      setCancelling(false);
    }, 600);
  }

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      color: '#212529',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    backBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '24px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#4c6ef5',
      fontSize: '14px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      padding: '4px 0',
    },
    headerRow: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '32px',
    },
    titleGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      letterSpacing: '-0.02em',
      lineHeight: '40px',
      color: '#212529',
      margin: 0,
    },
    orderId: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '14px',
      color: '#495057',
    },
    actionBtns: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    advanceBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 20px',
      backgroundColor: '#4c6ef5',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      opacity: advancing ? 0.7 : 1,
    },
    cancelBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      color: '#f03e3e',
      border: '1px solid #f03e3e',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      opacity: cancelling ? 0.7 : 1,
    },
    disabledBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '10px 20px',
      backgroundColor: '#e9ecef',
      color: '#adb5bd',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'not-allowed',
      minHeight: '44px',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '24px',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #dee2e6',
      padding: '24px',
    },
    cardTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '20px',
    },
    cardIcon: {
      width: '18px',
      height: '18px',
      opacity: 0.6,
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      marginBottom: '4px',
    },
    value: {
      fontSize: '14px',
      color: '#212529',
      marginBottom: '12px',
    },
    muted: {
      fontSize: '14px',
      color: '#495057',
    },
    divider: {
      height: '1px',
      backgroundColor: '#e9ecef',
      margin: '16px 0',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      padding: '10px 12px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#495057',
      textAlign: 'left',
      borderBottom: '2px solid #e9ecef',
    },
    td: {
      padding: '12px',
      fontSize: '14px',
      color: '#343a40',
      borderBottom: '1px solid #e9ecef',
      verticalAlign: 'middle',
    },
    productImg: {
      width: '40px',
      height: '40px',
      borderRadius: '6px',
      objectFit: 'cover',
      border: '1px solid #e9ecef',
    },
    sku: {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      fontSize: '12px',
      color: '#495057',
    },
    totalsTable: {
      width: '100%',
      maxWidth: '400px',
      marginLeft: 'auto',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '6px 0',
      fontSize: '14px',
      color: '#343a40',
    },
    grandTotalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      fontSize: '16px',
      fontWeight: '700',
      color: '#212529',
      borderTop: '2px solid #212529',
      marginTop: '4px',
    },
    alertSuccess: {
      backgroundColor: '#d3f9d8',
      color: '#2f9e44',
      border: '1px solid #b2f2bb',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '24px',
    },
    alertError: {
      backgroundColor: '#ffe3e3',
      color: '#c92a2a',
      border: '1px solid #ffa8a8',
      borderRadius: '6px',
      padding: '12px 16px',
      fontSize: '14px',
      marginBottom: '24px',
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(33,37,41,0.48)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '440px',
      width: '90%',
      boxShadow: '0 8px 32px rgba(33,37,41,0.16)',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '12px',
    },
    modalText: {
      fontSize: '14px',
      color: '#495057',
      marginBottom: '24px',
      lineHeight: '1.5',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
    },
    modalKeepBtn: {
      padding: '10px 20px',
      backgroundColor: '#ffffff',
      color: '#495057',
      border: '1px solid #868e96',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      minHeight: '44px',
    },
    modalCancelBtn: {
      padding: '10px 20px',
      backgroundColor: '#f03e3e',
      color: '#ffffff',
      border: 'none',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      minHeight: '44px',
    },
    notesBox: {
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '6px',
      padding: '12px',
      fontSize: '14px',
      color: '#495057',
      lineHeight: '1.5',
      fontStyle: 'italic',
    },
    stepperCard: {
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      border: '1px solid #dee2e6',
      padding: '24px',
      marginBottom: '24px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={{ padding: '64px 0', textAlign: 'center', color: '#495057', fontSize: '16px' }}>
            Loading order…
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button style={styles.backBtn} onClick={() => navigate('/admin/orders')}>
            <img src={chevronLeftIcon} alt="" style={{ width: '18px', height: '18px' }} aria-hidden="true" />
            Back to Orders
          </button>
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>Order not found</p>
            <p style={{ fontSize: '14px', color: '#495057' }}>The order "{id}" does not exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress;
  const addrLine2 = addr.line2 ? `, ${addr.line2}` : '';

  return (
    <div style={styles.page}>
      {showCancelConfirm && (
        <div style={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
          <div style={styles.modal}>
            <p style={styles.modalTitle} id="cancel-dialog-title">Cancel Order?</p>
            <p style={styles.modalText}>
              Are you sure you want to cancel order <strong>{order.id}</strong>? This action cannot be undone.
            </p>
            <div style={styles.modalActions}>
              <button style={styles.modalKeepBtn} onClick={() => setShowCancelConfirm(false)}>
                Keep Order
              </button>
              <button style={styles.modalCancelBtn} onClick={handleCancel}>
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate('/admin/orders')}>
          <img src={chevronLeftIcon} alt="" style={{ width: '18px', height: '18px' }} aria-hidden="true" />
          Back to Orders
        </button>

        {successMsg && <div style={styles.alertSuccess} role="alert">{successMsg}</div>}
        {errorMsg && <div style={styles.alertError} role="alert">{errorMsg}</div>}

        <div style={styles.headerRow}>
          <div style={styles.titleGroup}>
            <h1 style={styles.title}>Order Detail</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={styles.orderId}>{order.id}</span>
              <StatusBadge status={order.status} />
            </div>
            <div style={{ fontSize: '12px', color: '#495057' }}>
              Placed: {formatDate(order.createdAt)}&nbsp;&nbsp;·&nbsp;&nbsp;Last updated: {formatDate(order.updatedAt)}
            </div>
          </div>

          <div style={styles.actionBtns}>
            {canAdvance ? (
              <button
                style={styles.advanceBtn}
                onClick={handleAdvance}
                disabled={advancing}
                aria-busy={advancing}
              >
                <img src={checkIcon} alt="" style={{ width: '16px', height: '16px' }} aria-hidden="true" />
                {advancing ? 'Updating…' : (NEXT_STATUS_LABELS[order.status] || 'Advance Status')}
              </button>
            ) : (
              <span style={styles.disabledBtn}>
                {order.status === 'delivered' ? 'Order Delivered' : 'No Further Advance'}
              </span>
            )}
            {canCancel && (
              <button
                style={styles.cancelBtn}
                onClick={() => setShowCancelConfirm(true)}
                disabled={cancelling}
              >
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>

        {order.status !== 'cancelled' && (
          <div style={styles.stepperCard}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#495057', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Order Progress
            </p>
            <StatusStepper currentStatus={order.status} />
          </div>
        )}

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <img src={userIcon} alt="" style={styles.cardIcon} aria-hidden="true" />
              Customer Information
            </div>
            <div style={styles.label}>Name</div>
            <div style={styles.value}>{order.customer.name}</div>
            <div style={styles.label}>Email</div>
            <div style={styles.value}>
              <a href={`mailto:${order.customer.email}`} style={{ color: '#4c6ef5', textDecoration: 'none' }}>
                {order.customer.email}
              </a>
            </div>
            <div style={styles.label}>Phone</div>
            <div style={{ ...styles.value, marginBottom: 0 }}>{order.customer.phone}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <img src={mapPinIcon} alt="" style={styles.cardIcon} aria-hidden="true" />
              Shipping Address
            </div>
            <address style={{ fontStyle: 'normal', fontSize: '14px', color: '#343a40', lineHeight: '1.6' }}>
              <div>{addr.line1}{addrLine2}</div>
              <div>{addr.city}, {addr.state} {addr.zip}</div>
              <div>{addr.country}</div>
            </address>

            {order.notes ? (
              <>
                <div style={styles.divider} />
                <div style={styles.label}>Order Notes</div>
                <div style={styles.notesBox}>{order.notes}</div>
              </>
            ) : null}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <img src={packageIcon} alt="" style={styles.cardIcon} aria-hidden="true" />
            Order Items
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table} aria-label="Order items">
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '48px' }} scope="col"></th>
                  <th style={styles.th} scope="col">Product</th>
                  <th style={styles.th} scope="col">SKU</th>
                  <th style={{ ...styles.th, textAlign: 'center' }} scope="col">Qty</th>
                  <th style={{ ...styles.th, textAlign: 'right' }} scope="col">Unit Price</th>
                  <th style={{ ...styles.th, textAlign: 'right' }} scope="col">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      <img
                        src={item.imageUrl || placeholderProductImg}
                        alt={item.name}
                        style={styles.productImg}
                      />
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '500', color: '#212529' }}>{item.name}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.sku}>{item.sku}</span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                      {formatCurrency(item.unitPrice * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.divider} />

          <div style={styles.totalsTable}>
            <div style={styles.totalRow}>
              <span style={styles.muted}>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.muted}>Shipping</span>
              <span>{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.muted}>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <div style={styles.grandTotalRow}>
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
