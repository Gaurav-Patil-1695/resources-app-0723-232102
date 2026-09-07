import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import checkIcon from '@/assets/icons/check.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
  },
  container: {
    maxWidth: '720px',
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
  subheading: {
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
  itemCheckRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef',
  },
  itemImg: {
    width: '52px',
    height: '52px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#f8f9fa',
    flexShrink: 0,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#212529',
  },
  itemMeta: {
    fontSize: '12px',
    color: '#495057',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
    marginBottom: '6px',
  },
  select: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    boxSizing: 'border-box',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    outline: 'none',
    resize: 'vertical',
    minHeight: '100px',
  },
  selectError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorMsg: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  btnPrimary: {
    padding: '12px 24px',
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
  btnGhost: {
    padding: '12px 24px',
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
  successPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '48px 24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    textAlign: 'center',
  },
  successIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#d3f9d8',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
};

const RETURN_REASONS = [
  'Defective or damaged',
  'Wrong item received',
  'Does not fit',
  'Changed my mind',
  'Not as described',
  'Other',
];

const ORDER_ITEMS = {
  'ORD-10045': [
    { id: 'i1', name: 'Classic White Sneakers', sku: 'SKU-001', qty: 1 },
    { id: 'i2', name: 'Canvas Tote Bag', sku: 'SKU-045', qty: 2 },
  ],
  'ORD-10044': [
    { id: 'i3', name: 'Running Shoes (Size 10)', sku: 'SKU-089', qty: 1 },
  ],
};

export default function ReturnRequest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const items = ORDER_ITEMS[id] || [];

  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const toggleItem = itemId => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]);
  };

  const validate = () => {
    const e = {};
    if (selectedItems.length === 0) e.items = 'Please select at least one item to return.';
    if (!reason) e.reason = 'Please select a reason for return.';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successPanel}>
            <div style={styles.successIcon}>
              <img src={checkIcon} alt="" style={{ width: '24px', height: '24px' }} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '12px' }}>Return request submitted</h2>
            <p style={{ fontSize: '14px', color: '#495057', marginBottom: '24px' }}>Our team will review your request within 1–2 business days.</p>
            <button
              style={styles.backLink}
              onClick={() => navigate(`/account/orders/${id}`)}
            >
              ← Back to order detail
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backLink} onClick={() => navigate(`/account/orders/${id}`)}>← Back to order detail</button>
        <h1 style={styles.heading}>Return request</h1>
        <p style={styles.subheading}>Order {id} · Select items and provide a reason for your return.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Select items to return</h2>
            {items.length === 0 && <p style={{ color: '#495057', fontSize: '14px' }}>No eligible items found for this order.</p>}
            {items.map((item, idx) => (
              <div key={item.id} style={{ ...styles.itemCheckRow, borderBottom: idx === items.length - 1 ? 'none' : '1px solid #e9ecef' }}>
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
                <img src={placeholderProduct} alt={item.name} style={styles.itemImg} />
                <label htmlFor={`item-${item.id}`} style={{ cursor: 'pointer' }}>
                  <div style={styles.itemName}>{item.name}</div>
                  <div style={styles.itemMeta}>SKU: {item.sku} · Qty: {item.qty}</div>
                </label>
              </div>
            ))}
            {errors.items && <p style={styles.errorMsg}>{errors.items}</p>}
          </div>

          <div style={styles.card}>
            <h2 style={styles.sectionHeading}>Return details</h2>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="reason">Reason for return</label>
              <select
                id="reason"
                style={{ ...styles.select, ...(errors.reason ? styles.selectError : {}) }}
                value={reason}
                onChange={e => setReason(e.target.value)}
              >
                <option value="">Select a reason…</option>
                {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.reason && <p style={styles.errorMsg}>{errors.reason}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="comments">Additional comments (optional)</label>
              <textarea
                id="comments"
                style={styles.textarea}
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="Describe the issue in more detail…"
              />
            </div>
          </div>

          <div style={styles.btnRow}>
            <button type="submit" style={styles.btnPrimary}>Submit return request</button>
            <button type="button" style={styles.btnGhost} onClick={() => navigate(`/account/orders/${id}`)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
