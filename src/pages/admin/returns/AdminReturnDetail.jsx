import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const tokens = {
  colorCanvas: '#f8f9fa',
  colorSurface: '#ffffff',
  colorInk: '#212529',
  colorBody: '#343a40',
  colorMuted: '#495057',
  colorBorder: '#868e96',
  colorPrimary: '#4c6ef5',
  colorPrimaryDark: '#3b5bdb',
  colorPrimarySubtle: '#e8ecfd',
  colorOnPrimary: '#ffffff',
  colorSuccess: '#37b24d',
  colorSuccessSubtle: '#d3f9d8',
  colorError: '#f03e3e',
  colorErrorSubtle: '#ffe3e3',
  colorWarning: '#fd7e14',
  colorWarningSubtle: '#fff4e6',
  colorDisabledBg: '#e9ecef',
  colorDisabledText: '#adb5bd',
  colorOverlay: 'rgba(33,37,41,0.48)',
  fontSans: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  radiusMd: '10px',
  radiusSm: '6px',
  radiusXs: '3px',
  radiusFull: '9999px',
  radiusLg: '16px',
};

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: tokens.colorWarningSubtle, color: tokens.colorWarning },
  approved: { label: 'Approved', bg: tokens.colorSuccessSubtle, color: tokens.colorSuccess },
  rejected: { label: 'Rejected', bg: tokens.colorErrorSubtle, color: tokens.colorError },
  processing: { label: 'Processing', bg: tokens.colorPrimarySubtle, color: tokens.colorPrimary },
};

const MOCK_RETURNS = {
  'RET-001': {
    id: 'RET-001',
    orderId: 'ORD-10045',
    customer: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1 (555) 234-5678',
      address: '123 Maple St, Springfield, IL 62701',
    },
    reason: 'Defective product',
    reasonDetail:
      'The product arrived with a broken latch and does not function as described. The item appears to have been damaged during manufacturing.',
    status: 'pending',
    requestedAt: '2024-06-01T10:23:00Z',
    amount: 89.99,
    refundMethod: 'Original Payment Method',
    items: [
      {
        id: 'ITEM-001',
        sku: 'SKU-89234',
        name: 'Premium Locking Container',
        qty: 1,
        unitPrice: 89.99,
        imageUrl: null,
      },
    ],
    timeline: [
      { at: '2024-06-01T10:23:00Z', event: 'Return requested by customer.' },
      { at: '2024-06-01T10:25:00Z', event: 'Assigned to review queue.' },
    ],
    adminNotes: '',
  },
  'RET-002': {
    id: 'RET-002',
    orderId: 'ORD-10031',
    customer: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '+1 (555) 876-5432',
      address: '456 Oak Ave, Columbus, OH 43215',
    },
    reason: 'Wrong item received',
    reasonDetail: 'Customer received a blue variant instead of the red variant ordered.',
    status: 'approved',
    requestedAt: '2024-06-02T14:05:00Z',
    amount: 45.00,
    refundMethod: 'Store Credit',
    items: [
      {
        id: 'ITEM-002',
        sku: 'SKU-45100-RED',
        name: 'Sport Bottle 32oz (Red)',
        qty: 2,
        unitPrice: 22.50,
        imageUrl: null,
      },
    ],
    timeline: [
      { at: '2024-06-02T14:05:00Z', event: 'Return requested by customer.' },
      { at: '2024-06-03T09:00:00Z', event: 'Return approved by admin.' },
    ],
    adminNotes: 'Wrong SKU was shipped from warehouse. Approved full refund.',
  },
  'RET-003': {
    id: 'RET-003',
    orderId: 'ORD-10028',
    customer: {
      name: 'Carol White',
      email: 'carol@example.com',
      phone: '+1 (555) 111-2233',
      address: '789 Pine Rd, Austin, TX 78701',
    },
    reason: 'Changed mind',
    reasonDetail: 'Customer no longer needs the product.',
    status: 'rejected',
    requestedAt: '2024-06-03T09:17:00Z',
    amount: 120.50,
    refundMethod: 'Original Payment Method',
    items: [
      {
        id: 'ITEM-003',
        sku: 'SKU-77009',
        name: 'Deluxe Kitchen Set',
        qty: 1,
        unitPrice: 120.50,
        imageUrl: null,
      },
    ],
    timeline: [
      { at: '2024-06-03T09:17:00Z', event: 'Return requested by customer.' },
      { at: '2024-06-04T10:00:00Z', event: 'Return rejected — outside return policy window.' },
    ],
    adminNotes: 'Return window exceeded (30 days). Policy does not allow returns for change of mind after 30 days.',
  },
  'RET-004': {
    id: 'RET-004',
    orderId: 'ORD-10067',
    customer: {
      name: 'David Lee',
      email: 'david@example.com',
      phone: '+1 (555) 444-5566',
      address: '321 Birch Blvd, Seattle, WA 98101',
    },
    reason: 'Not as described',
    reasonDetail: 'Product dimensions listed as 12x8 inches but arrived at 8x5 inches.',
    status: 'pending',
    requestedAt: '2024-06-04T11:45:00Z',
    amount: 34.99,
    refundMethod: 'Original Payment Method',
    items: [
      {
        id: 'ITEM-004',
        sku: 'SKU-23401',
        name: 'Decorative Frame Set',
        qty: 1,
        unitPrice: 34.99,
        imageUrl: null,
      },
    ],
    timeline: [
      { at: '2024-06-04T11:45:00Z', event: 'Return requested by customer.' },
    ],
    adminNotes: '',
  },
  'RET-005': {
    id: 'RET-005',
    orderId: 'ORD-10072',
    customer: {
      name: 'Eva Martinez',
      email: 'eva@example.com',
      phone: '+1 (555) 667-8899',
      address: '654 Cedar Ln, Miami, FL 33101',
    },
    reason: 'Arrived damaged',
    reasonDetail: 'Package was visibly crushed on arrival. Item inside has dents and scratches.',
    status: 'processing',
    requestedAt: '2024-06-05T08:30:00Z',
    amount: 199.00,
    refundMethod: 'Original Payment Method',
    items: [
      {
        id: 'ITEM-005',
        sku: 'SKU-66120',
        name: 'Bluetooth Speaker Pro',
        qty: 1,
        unitPrice: 199.00,
        imageUrl: null,
      },
    ],
    timeline: [
      { at: '2024-06-05T08:30:00Z', event: 'Return requested by customer.' },
      { at: '2024-06-05T09:00:00Z', event: 'Carrier damage claim initiated.' },
    ],
    adminNotes: 'Awaiting carrier damage assessment before issuing refund.',
  },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, bg: tokens.colorDisabledBg, color: tokens.colorMuted };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 12px',
        borderRadius: tokens.radiusFull,
        background: config.bg,
        color: config.color,
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: tokens.fontSans,
      }}
    >
      {config.label}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: tokens.colorSurface,
        border: `1px solid ${tokens.colorBorder}`,
        borderRadius: tokens.radiusMd,
        padding: '24px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: '16px',
        fontWeight: '600',
        color: tokens.colorInk,
        margin: '0 0 16px 0',
        fontFamily: tokens.fontSans,
        lineHeight: '24px',
      }}
    >
      {children}
    </h2>
  );
}

function FieldRow({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
      <span
        style={{
          fontSize: '13px',
          fontWeight: '600',
          color: tokens.colorMuted,
          minWidth: '140px',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: tokens.colorBody,
          fontFamily: mono ? tokens.fontMono : tokens.fontSans,
          flex: 1,
        }}
      >
        {value || '—'}
      </span>
    </div>
  );
}

function ConfirmModal({ open, title, message, confirmLabel, confirmColor, onConfirm, onCancel, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.colorOverlay,
        padding: '24px',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: tokens.colorSurface,
          borderRadius: tokens.radiusLg,
          padding: '32px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="modal-title"
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: tokens.colorInk,
            margin: '0 0 12px 0',
            fontFamily: tokens.fontSans,
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: '14px', color: tokens.colorBody, margin: '0 0 20px 0', lineHeight: '1.5' }}>
          {message}
        </p>
        {children}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: tokens.radiusSm,
              background: tokens.colorSurface,
              color: tokens.colorBody,
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: tokens.fontSans,
              minHeight: '44px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: tokens.radiusSm,
              background: confirmColor || tokens.colorPrimary,
              color: tokens.colorOnPrimary,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: tokens.fontSans,
              minHeight: '44px',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminReturnDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ret, setRet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [adminNotes, setAdminNotes] = useState('');
  const [actionStatus, setActionStatus] = useState(null);

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [toast, setToast] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = MOCK_RETURNS[id];
      if (found) {
        setRet({ ...found });
        setAdminNotes(found.adminNotes || '');
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [id]);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = () => {
    setActionStatus('loading');
    setTimeout(() => {
      setRet((prev) => ({
        ...prev,
        status: 'approved',
        adminNotes,
        timeline: [
          ...prev.timeline,
          { at: new Date().toISOString(), event: 'Return approved by admin.' },
        ],
      }));
      setApproveModal(false);
      setActionStatus(null);
      showToast('Return request approved successfully.', 'success');
    }, 600);
  };

  const handleReject = () => {
    setActionStatus('loading');
    setTimeout(() => {
      setRet((prev) => ({
        ...prev,
        status: 'rejected',
        adminNotes,
        timeline: [
          ...prev.timeline,
          {
            at: new Date().toISOString(),
            event: `Return rejected by admin.${
              rejectReason ? ` Reason: ${rejectReason}` : ''
            }`,
          },
        ],
      }));
      setRejectModal(false);
      setRejectReason('');
      setActionStatus(null);
      showToast('Return request has been rejected.', 'error');
    }, 600);
  };

  const handleSaveNotes = () => {
    setRet((prev) => ({ ...prev, adminNotes }));
    showToast('Notes saved.', 'success');
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const canAct = ret && (ret.status === 'pending' || ret.status === 'processing');

  const styles = {
    page: {
      minHeight: '100vh',
      background: tokens.colorCanvas,
      fontFamily: tokens.fontSans,
      color: tokens.colorBody,
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
      background: 'none',
      border: 'none',
      color: tokens.colorPrimary,
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: tokens.fontSans,
      padding: '4px 0',
      marginBottom: '20px',
    },
    pageHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      marginBottom: '28px',
    },
    titleGroup: {},
    pageTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: tokens.colorInk,
      letterSpacing: '-0.01em',
      lineHeight: '32px',
      margin: '0 0 6px 0',
    },
    pageMeta: {
      fontSize: '14px',
      color: tokens.colorMuted,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap',
    },
    actionBar: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    approveBtn: {
      padding: '10px 24px',
      background: tokens.colorSuccess,
      color: '#ffffff',
      border: 'none',
      borderRadius: tokens.radiusSm,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: tokens.fontSans,
      minHeight: '44px',
      transition: 'opacity 0.15s',
    },
    rejectBtn: {
      padding: '10px 24px',
      background: tokens.colorSurface,
      color: tokens.colorError,
      border: `1px solid ${tokens.colorError}`,
      borderRadius: tokens.radiusSm,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: tokens.fontSans,
      minHeight: '44px',
      transition: 'background 0.15s',
    },
    disabledBtn: {
      padding: '10px 24px',
      background: tokens.colorDisabledBg,
      color: tokens.colorDisabledText,
      border: 'none',
      borderRadius: tokens.radiusSm,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'not-allowed',
      fontFamily: tokens.fontSans,
      minHeight: '44px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    fullWidth: {
      gridColumn: '1 / -1',
    },
    divider: {
      border: 'none',
      borderTop: `1px solid #dee2e6`,
      margin: '16px 0',
    },
    itemRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      padding: '12px 0',
      borderBottom: `1px solid #dee2e6`,
    },
    itemImg: {
      width: '56px',
      height: '56px',
      borderRadius: tokens.radiusSm,
      objectFit: 'cover',
      background: tokens.colorCanvas,
      border: `1px solid #dee2e6`,
      flexShrink: 0,
    },
    itemName: {
      fontSize: '14px',
      fontWeight: '500',
      color: tokens.colorInk,
      marginBottom: '4px',
    },
    itemSku: {
      fontSize: '12px',
      fontFamily: tokens.fontMono,
      color: tokens.colorMuted,
    },
    timelineItem: {
      display: 'flex',
      gap: '12px',
      marginBottom: '14px',
    },
    timelineDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: tokens.colorPrimary,
      marginTop: '5px',
      flexShrink: 0,
    },
    notesTextarea: {
      width: '100%',
      minHeight: '96px',
      padding: '10px 12px',
      border: `1px solid ${tokens.colorBorder}`,
      borderRadius: tokens.radiusSm,
      fontSize: '14px',
      fontFamily: tokens.fontSans,
      color: tokens.colorInk,
      background: tokens.colorSurface,
      resize: 'vertical',
      outline: 'none',
      boxSizing: 'border-box',
      lineHeight: '1.5',
    },
    saveNotesBtn: {
      marginTop: '12px',
      padding: '8px 20px',
      background: tokens.colorPrimary,
      color: tokens.colorOnPrimary,
      border: 'none',
      borderRadius: tokens.radiusSm,
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      fontFamily: tokens.fontSans,
      minHeight: '36px',
    },
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, textAlign: 'center', paddingTop: '80px', color: tokens.colorMuted, fontSize: '14px' }}>
          Loading return details…
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.container, textAlign: 'center', paddingTop: '80px' }}>
          <img src="@/assets/images/empty-state.svg" alt="" style={{ width: '80px', opacity: 0.4, marginBottom: '20px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: tokens.colorInk, marginBottom: '8px' }}>Return Not Found</h2>
          <p style={{ fontSize: '14px', color: tokens.colorMuted, marginBottom: '24px' }}>
            The return request you are looking for does not exist.
          </p>
          <button
            onClick={() => navigate('/admin/returns')}
            style={{
              padding: '10px 24px',
              background: tokens.colorPrimary,
              color: tokens.colorOnPrimary,
              border: 'none',
              borderRadius: tokens.radiusSm,
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: tokens.fontSans,
            }}
          >
            Back to Returns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 2000,
            background: toast.type === 'success' ? tokens.colorSuccessSubtle : tokens.colorErrorSubtle,
            color: toast.type === 'success' ? tokens.colorSuccess : tokens.colorError,
            border: `1px solid ${toast.type === 'success' ? tokens.colorSuccess : tokens.colorError}`,
            borderRadius: tokens.radiusSm,
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            fontFamily: tokens.fontSans,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '360px',
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={styles.container}>
        {/* Back */}
        <button
          style={styles.backBtn}
          onClick={() => navigate('/admin/returns')}
          aria-label="Back to returns list"
        >
          <img src="@/assets/icons/chevron-left.svg" alt="" style={{ width: '16px', height: '16px' }} />
          Back to Returns
        </button>

        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div style={styles.titleGroup}>
            <h1 style={styles.pageTitle}>
              Return{' '}
              <span style={{ fontFamily: tokens.fontMono, fontSize: '22px' }}>{ret.id}</span>
            </h1>
            <div style={styles.pageMeta}>
              <span>
                Order:{' '}
                <span style={{ fontFamily: tokens.fontMono, fontWeight: '500', color: tokens.colorInk }}>
                  {ret.orderId}
                </span>
              </span>
              <span style={{ color: tokens.colorBorder }}>·</span>
              <span>Requested {formatDate(ret.requestedAt)}</span>
              <span style={{ color: tokens.colorBorder }}>·</span>
              <StatusBadge status={ret.status} />
            </div>
          </div>

          {/* Action Bar */}
          <div style={styles.actionBar}>
            {canAct ? (
              <>
                <button
                  style={actionStatus === 'loading' ? { ...styles.approveBtn, opacity: 0.6 } : styles.approveBtn}
                  onClick={() => setApproveModal(true)}
                  disabled={actionStatus === 'loading'}
                  aria-label="Approve return request"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="@/assets/icons/check.svg" alt="" style={{ width: '16px', height: '16px' }} />
                    Approve
                  </span>
                </button>
                <button
                  style={actionStatus === 'loading' ? { ...styles.rejectBtn, opacity: 0.6 } : styles.rejectBtn}
                  onClick={() => setRejectModal(true)}
                  disabled={actionStatus === 'loading'}
                  aria-label="Reject return request"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <img src="@/assets/icons/close.svg" alt="" style={{ width: '16px', height: '16px' }} />
                    Reject
                  </span>
                </button>
              </>
            ) : (
              <button style={styles.disabledBtn} disabled aria-disabled="true">
                {ret.status === 'approved' ? 'Approved' : ret.status === 'rejected' ? 'Rejected' : 'No Actions Available'}
              </button>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div style={styles.grid}>
          {/* Customer Info */}
          <Card>
            <SectionTitle>Customer Information</SectionTitle>
            <FieldRow label="Name" value={ret.customer.name} />
            <FieldRow label="Email" value={ret.customer.email} />
            <FieldRow label="Phone" value={ret.customer.phone} />
            <FieldRow label="Shipping Address" value={ret.customer.address} />
          </Card>

          {/* Return Summary */}
          <Card>
            <SectionTitle>Return Summary</SectionTitle>
            <FieldRow label="Return ID" value={ret.id} mono />
            <FieldRow label="Order ID" value={ret.orderId} mono />
            <FieldRow label="Refund Amount" value={formatAmount(ret.amount)} />
            <FieldRow label="Refund Method" value={ret.refundMethod} />
            <FieldRow label="Reason" value={ret.reason} />
          </Card>

          {/* Reason Detail */}
          <Card style={styles.fullWidth}>
            <SectionTitle>Reason Detail</SectionTitle>
            <p
              style={{
                fontSize: '14px',
                color: tokens.colorBody,
                lineHeight: '1.6',
                margin: 0,
              }}
            >
              {ret.reasonDetail}
            </p>
          </Card>

          {/* Items */}
          <Card style={styles.fullWidth}>
            <SectionTitle>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="@/assets/icons/package.svg" alt="" style={{ width: '18px', height: '18px', opacity: 0.7 }} />
                Items in Return
              </span>
            </SectionTitle>
            {ret.items.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <img
                  src={item.imageUrl || '@/assets/images/placeholder-product.svg'}
                  alt={item.name}
                  style={styles.itemImg}
                />
                <div style={{ flex: 1 }}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemSku}>SKU: {item.sku}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: tokens.colorMuted, marginBottom: '2px' }}>
                    Qty: {item.qty}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: tokens.colorInk }}>
                    {formatAmount(item.unitPrice * item.qty)}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: `1px solid #dee2e6`,
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '600', color: tokens.colorInk }}>
                Total Refund: {formatAmount(ret.amount)}
              </span>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <SectionTitle>Activity Timeline</SectionTitle>
            {ret.timeline.map((entry, idx) => (
              <div key={idx} style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                <div>
                  <div style={{ fontSize: '13px', color: tokens.colorBody, lineHeight: '1.4' }}>
                    {entry.event}
                  </div>
                  <div style={{ fontSize: '12px', color: tokens.colorMuted, marginTop: '2px' }}>
                    {formatDate(entry.at)}
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Admin Notes */}
          <Card>
            <SectionTitle>Admin Notes</SectionTitle>
            <textarea
              style={styles.notesTextarea}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes about this return…"
              aria-label="Admin notes"
            />
            <button
              style={styles.saveNotesBtn}
              onClick={handleSaveNotes}
              onMouseEnter={(e) => { e.currentTarget.style.background = tokens.colorPrimaryDark; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = tokens.colorPrimary; }}
            >
              Save Notes
            </button>
          </Card>
        </div>
      </div>

      {/* Approve Modal */}
      <ConfirmModal
        open={approveModal}
        title="Approve Return Request"
        message={`Are you sure you want to approve return ${ret.id}? A refund of ${formatAmount(ret.amount)} will be issued to the customer via ${ret.refundMethod}.`}
        confirmLabel="Approve Return"
        confirmColor={tokens.colorSuccess}
        onConfirm={handleApprove}
        onCancel={() => setApproveModal(false)}
      />

      {/* Reject Modal */}
      <ConfirmModal
        open={rejectModal}
        title="Reject Return Request"
        message={`Are you sure you want to reject return ${ret.id}? The customer will be notified.`}
        confirmLabel="Reject Return"
        confirmColor={tokens.colorError}
        onConfirm={handleReject}
        onCancel={() => { setRejectModal(false); setRejectReason(''); }}
      >
        <div style={{ marginBottom: '8px' }}>
          <label
            htmlFor="reject-reason"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: tokens.colorMuted,
              marginBottom: '6px',
            }}
          >
            Rejection Reason (optional)
          </label>
          <textarea
            id="reject-reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Provide a reason for rejection…"
            style={{
              width: '100%',
              minHeight: '72px',
              padding: '10px 12px',
              border: `1px solid ${tokens.colorBorder}`,
              borderRadius: tokens.radiusSm,
              fontSize: '14px',
              fontFamily: tokens.fontSans,
              color: tokens.colorInk,
              background: tokens.colorSurface,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              lineHeight: '1.5',
            }}
          />
        </div>
      </ConfirmModal>
    </div>
  );
}
