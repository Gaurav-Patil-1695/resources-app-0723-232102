import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    padding: '40px 16px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '32px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  stepActive: { color: '#4c6ef5' },
  stepDone: { color: '#37b24d' },
  stepDivider: { color: '#868e96' },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: '24px',
    alignItems: 'start',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '24px',
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
  itemRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    paddingBottom: '16px',
    borderBottom: '1px solid #e9ecef',
    marginBottom: '16px',
  },
  itemRowLast: {
    paddingBottom: '0',
    borderBottom: 'none',
    marginBottom: '0',
  },
  itemImg: {
    width: '72px',
    height: '72px',
    objectFit: 'cover',
    borderRadius: '6px',
    flexShrink: 0,
    border: '1px solid #e9ecef',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '4px',
  },
  itemMeta: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    whiteSpace: 'nowrap',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '15px',
    color: '#343a40',
    lineHeight: '24px',
  },
  summaryRowBold: {
    fontWeight: '700',
    fontSize: '17px',
    color: '#212529',
    borderTop: '2px solid #e9ecef',
    marginTop: '4px',
    paddingTop: '12px',
  },
  savingsRow: {
    color: '#2b8a3e',
    fontWeight: '500',
  },
  promoSection: {
    marginTop: '4px',
    marginBottom: '4px',
  },
  promoRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'stretch',
  },
  promoInput: {
    flex: 1,
    padding: '10px 12px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    minHeight: '44px',
    boxSizing: 'border-box',
    letterSpacing: '0.04em',
  },
  promoInputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  promoInputSuccess: {
    borderColor: '#37b24d',
  },
  applyBtn: {
    padding: '10px 18px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4c6ef5',
    backgroundColor: 'transparent',
    border: '1px solid #4c6ef5',
    borderRadius: '6px',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.15s',
  },
  promoMsg: {
    marginTop: '8px',
    fontSize: '13px',
    lineHeight: '18px',
  },
  promoSuccess: { color: '#2b8a3e', fontWeight: '500' },
  promoError: { color: '#f03e3e' },
  shippingChip: {
    display: 'inline-block',
    padding: '2px 10px',
    backgroundColor: '#d3f9d8',
    color: '#2b8a3e',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.04em',
    marginLeft: '8px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
  },
  backBtn: {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4c6ef5',
    backgroundColor: 'transparent',
    border: '1px solid #4c6ef5',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  primaryBtn: {
    padding: '14px 36px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
  },
  addressBlock: {
    fontSize: '14px',
    lineHeight: '22px',
    color: '#343a40',
  },
  paymentBlock: {
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '22px',
  },
  editLink: {
    fontSize: '13px',
    color: '#4c6ef5',
    textDecoration: 'none',
    marginLeft: 'auto',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '12px 0',
  },
};

const VALID_PROMOS = {
  SAVE10: { discount: 0.10, label: '10% off applied!' },
  FLAT50: { discount: 50, flat: true, label: '₹50 off applied!' },
  WELCOME: { discount: 0.15, label: '15% off for new users!' },
};

const MOCK_ITEMS = [
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', variant: 'Color: Midnight Black', qty: 1, price: 7999 },
  { id: 2, name: 'USB-C Charging Cable (2m)', variant: 'Pack of 2', qty: 2, price: 599 },
];

const TAX_RATE = 0.18;
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_CHARGE = 99;

export default function CheckoutReview() {
  const navigate = useNavigate();
  const [address, setAddress] = useState(null);
  const [payment, setPayment] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoStatus, setPromoStatus] = useState(null); // null | 'valid' | 'invalid'
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const addr = sessionStorage.getItem('checkoutAddress');
    const pay = sessionStorage.getItem('checkoutPayment');
    if (addr) setAddress(JSON.parse(addr));
    if (pay) setPayment(JSON.parse(pay));
  }, []);

  const subtotal = MOCK_ITEMS.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;

  const promoDiscount = appliedPromo
    ? appliedPromo.flat
      ? Math.min(appliedPromo.discount, subtotal)
      : Math.round(subtotal * appliedPromo.discount)
    : 0;

  const taxableAmount = subtotal - promoDiscount;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const total = taxableAmount + tax + shippingCharge;

  const handleApplyPromo = () => {
    const key = promoCode.trim().toUpperCase();
    if (VALID_PROMOS[key]) {
      setAppliedPromo({ ...VALID_PROMOS[key], code: key });
      setPromoStatus('valid');
    } else {
      setAppliedPromo(null);
      setPromoStatus('invalid');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoStatus(null);
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    const orderId = 'ORD' + Date.now();
    sessionStorage.setItem('lastOrder', JSON.stringify({
      orderId,
      items: MOCK_ITEMS,
      subtotal,
      promoDiscount,
      tax,
      shippingCharge,
      total,
      address,
      payment,
    }));
    setTimeout(() => {
      navigate('/checkout/confirmation');
    }, 1200);
  };

  const paymentLabel = () => {
    if (!payment) return '—';
    if (payment.method === 'card') return `Credit/Debit Card ending ****${payment.card?.number || '****'}`;
    if (payment.method === 'upi') return `UPI — ${payment.upi}`;
    if (payment.method === 'netbanking') return 'Net Banking';
    if (payment.method === 'wallet') return `${payment.wallet} Wallet`;
    if (payment.method === 'cod') return 'Cash on Delivery';
    return '—';
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <span style={styles.stepDone}>✓ 1. Address</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepDone}>✓ 2. Payment</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepActive}>3. Review</span>
        </div>

        <h1 style={styles.heading}>Review Your Order</h1>

        <div style={styles.layout}>
          <div>
            {/* Items */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <img src={packageIcon} alt="" width={18} height={18} />
                Order Items ({MOCK_ITEMS.reduce((a, i) => a + i.qty, 0)})
              </div>
              {MOCK_ITEMS.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    ...styles.itemRow,
                    ...(idx === MOCK_ITEMS.length - 1 ? styles.itemRowLast : {}),
                  }}
                >
                  <img src={placeholderProduct} alt={item.name} style={styles.itemImg} />
                  <div style={styles.itemInfo}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemMeta}>{item.variant}</div>
                    <div style={styles.itemMeta}>Qty: {item.qty}</div>
                  </div>
                  <div style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            {/* Address */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                Delivery Address
                <button style={styles.editLink} onClick={() => navigate('/checkout/address')}>Edit</button>
              </div>
              {address ? (
                <div style={styles.addressBlock}>
                  <div style={{ fontWeight: '600' }}>{address.fullName}</div>
                  <div>{address.addressLine1}</div>
                  {address.addressLine2 && <div>{address.addressLine2}</div>}
                  <div>{address.city}, {address.state} — {address.pin}</div>
                  <div>{address.country}</div>
                  <div style={{ marginTop: '4px' }}>📞 {address.phone}</div>
                </div>
              ) : (
                <div style={{ fontSize: '14px', color: '#868e96' }}>No address saved. <button style={styles.editLink} onClick={() => navigate('/checkout/address')}>Add address</button></div>
              )}
            </div>

            {/* Payment */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                Payment Method
                <button style={styles.editLink} onClick={() => navigate('/checkout/payment')}>Edit</button>
              </div>
              <div style={styles.paymentBlock}>{paymentLabel()}</div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div style={styles.card}>
              <div style={styles.cardTitle}>Order Summary</div>

              <div style={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div style={styles.summaryRow}>
                <span>
                  Shipping
                  {shippingCharge === 0 && <span style={styles.shippingChip}>FREE</span>}
                </span>
                <span>
                  {shippingCharge === 0
                    ? <span style={{ color: '#2b8a3e', fontWeight: '500' }}>₹0</span>
                    : `₹${shippingCharge}`
                  }
                </span>
              </div>

              {appliedPromo && (
                <div style={{ ...styles.summaryRow, ...styles.savingsRow }}>
                  <span>Promo ({appliedPromo.code})</span>
                  <span>− ₹{promoDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div style={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <hr style={styles.divider} />

              <div style={{ ...styles.summaryRow, ...styles.summaryRowBold }}>
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>

              <hr style={styles.divider} />

              {/* Promo Code */}
              <div style={styles.promoSection}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#495057', display: 'block', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Promo Code</label>
                {!appliedPromo ? (
                  <>
                    <div style={styles.promoRow}>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoStatus(null); }}
                        placeholder="Enter code"
                        style={{
                          ...styles.promoInput,
                          ...(promoStatus === 'invalid' ? styles.promoInputError : {}),
                          ...(promoStatus === 'valid' ? styles.promoInputSuccess : {}),
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyPromo(); } }}
                        aria-label="Promo code"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        style={styles.applyBtn}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e8ecfd'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        Apply
                      </button>
                    </div>
                    {promoStatus === 'invalid' && (
                      <p style={{ ...styles.promoMsg, ...styles.promoError }}>Invalid or expired promo code.</p>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#d3f9d8', borderRadius: '6px' }}>
                    <span style={{ ...styles.promoMsg, ...styles.promoSuccess, margin: 0 }}>✓ {appliedPromo.label}</span>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      style={{ background: 'none', border: 'none', color: '#f03e3e', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: '0 4px' }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                style={{ ...styles.primaryBtn, width: '100%', marginTop: '20px', opacity: placing ? 0.7 : 1, cursor: placing ? 'not-allowed' : 'pointer' }}
                onClick={handlePlaceOrder}
                disabled={placing}
                onMouseEnter={(e) => { if (!placing) e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
              >
                {placing ? 'Placing Order…' : 'Place Order'}
              </button>

              <p style={{ fontSize: '12px', color: '#868e96', textAlign: 'center', marginTop: '12px', lineHeight: '16px' }}>
                🔒 Secured by 256-bit SSL encryption
              </p>
            </div>

            <div style={styles.actions}>
              <button
                type="button"
                style={styles.backBtn}
                onClick={() => navigate('/checkout/payment')}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e8ecfd'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
