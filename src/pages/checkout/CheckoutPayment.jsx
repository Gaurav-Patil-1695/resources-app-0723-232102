import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    padding: '40px 16px',
  },
  container: {
    maxWidth: '720px',
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
  stepActive: {
    color: '#4c6ef5',
  },
  stepDone: {
    color: '#37b24d',
  },
  stepDivider: {
    color: '#868e96',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '8px',
  },
  subheading: {
    fontSize: '14px',
    color: '#495057',
    marginBottom: '32px',
    lineHeight: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #e9ecef',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '24px',
    color: '#212529',
    marginBottom: '20px',
  },
  methodList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  methodOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background-color 0.15s',
    minHeight: '44px',
  },
  methodOptionSelected: {
    borderColor: '#4c6ef5',
    backgroundColor: '#e8ecfd',
  },
  methodRadio: {
    accentColor: '#4c6ef5',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  methodLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#212529',
    cursor: 'pointer',
  },
  methodDesc: {
    fontSize: '12px',
    color: '#495057',
    marginLeft: 'auto',
  },
  fieldFull: {
    marginBottom: '16px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
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
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#212529',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '44px',
    transition: 'border-color 0.15s',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  testModeBanner: {
    backgroundColor: '#fff3e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    marginBottom: '20px',
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
  },
  testModeBannerTitle: {
    fontWeight: '600',
    color: '#fd7e14',
    marginBottom: '4px',
  },
  testCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    padding: '10px 14px',
    marginTop: '8px',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
    color: '#343a40',
    lineHeight: '20px',
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
    padding: '12px 32px',
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
  upiRow: {
    display: 'flex',
    gap: '12px',
  },
  upiInput: {
    flex: 1,
  },
  verifyBtn: {
    padding: '12px 16px',
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
  walletList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  walletOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    minHeight: '44px',
    transition: 'border-color 0.15s, background-color 0.15s',
  },
  walletOptionSelected: {
    borderColor: '#4c6ef5',
    backgroundColor: '#e8ecfd',
  },
};

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI', desc: 'GPay, PhonePe, BHIM' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks' },
  { id: 'wallet', label: 'Wallet', desc: 'Paytm, MobiKwik' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay at doorstep' },
];

const WALLETS = ['Paytm', 'MobiKwik', 'Amazon Pay', 'Ola Money'];

const TEST_CARD = { number: '4111 1111 1111 1111', expiry: '12/26', cvv: '123', name: 'Test User' };

function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function CheckoutPayment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upi, setUpi] = useState('');
  const [wallet, setWallet] = useState('');
  const [errors, setErrors] = useState({});
  const [fillTest, setFillTest] = useState(false);

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === 'number') formatted = formatCardNumber(value);
    if (name === 'expiry') formatted = formatExpiry(value);
    if (name === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);
    setCard((prev) => ({ ...prev, [name]: formatted }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFillTest = () => {
    setCard({ number: TEST_CARD.number, name: TEST_CARD.name, expiry: TEST_CARD.expiry, cvv: TEST_CARD.cvv });
    setFillTest(true);
    setErrors({});
  };

  const validateCard = () => {
    const e = {};
    const digits = card.number.replace(/\s/g, '');
    if (!digits || digits.length < 16) e.number = 'Enter a valid 16-digit card number.';
    if (!card.name.trim()) e.name = 'Cardholder name is required.';
    if (!card.expiry || card.expiry.length < 5) e.expiry = 'Enter a valid expiry date (MM/YY).';
    if (!card.cvv || card.cvv.length < 3) e.cvv = 'Enter a valid CVV.';
    return e;
  };

  const validateUpi = () => {
    const e = {};
    if (!upi.trim() || !upi.includes('@')) e.upi = 'Enter a valid UPI ID (e.g. name@upi).';
    return e;
  };

  const validateWallet = () => {
    const e = {};
    if (!wallet) e.wallet = 'Please select a wallet.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newErrors = {};
    if (method === 'card') newErrors = validateCard();
    if (method === 'upi') newErrors = validateUpi();
    if (method === 'wallet') newErrors = validateWallet();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const paymentData = { method, ...(method === 'card' ? { card: { ...card, number: card.number.replace(/\s/g, '').slice(-4) } } : {}), ...(method === 'upi' ? { upi } : {}), ...(method === 'wallet' ? { wallet } : {}) };
    sessionStorage.setItem('checkoutPayment', JSON.stringify(paymentData));
    navigate('/checkout/review');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <span style={styles.stepDone}>✓ 1. Address</span>
          <span style={styles.stepDivider}>›</span>
          <span style={styles.stepActive}>2. Payment</span>
          <span style={styles.stepDivider}>›</span>
          <span>3. Review</span>
        </div>

        <h1 style={styles.heading}>Payment</h1>
        <p style={styles.subheading}>Choose your preferred payment method.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Select Payment Method</div>
            <div style={styles.methodList}>
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  style={{
                    ...styles.methodOption,
                    ...(method === m.id ? styles.methodOptionSelected : {}),
                  }}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={method === m.id}
                    onChange={() => { setMethod(m.id); setErrors({}); }}
                    style={styles.methodRadio}
                  />
                  <span style={styles.methodLabel}>{m.label}</span>
                  <span style={styles.methodDesc}>{m.desc}</span>
                </label>
              ))}
            </div>

            {method === 'card' && (
              <div>
                <div style={styles.testModeBanner}>
                  <div style={styles.testModeBannerTitle}>🧪 Test Mode</div>
                  <div>Payments are simulated. No real charges will occur.</div>
                  <div style={styles.testCard}>
                    <div>Card: {TEST_CARD.number}</div>
                    <div>Expiry: {TEST_CARD.expiry} &nbsp; CVV: {TEST_CARD.cvv}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillTest}
                    style={{ marginTop: '10px', fontSize: '13px', color: '#4c6ef5', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                  >
                    Auto-fill test card
                  </button>
                </div>

                <div style={styles.fieldFull}>
                  <label htmlFor="cardNumber" style={styles.label}>Card Number *</label>
                  <input
                    id="cardNumber"
                    name="number"
                    type="text"
                    inputMode="numeric"
                    value={card.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    style={{ ...styles.input, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", ...(errors.number ? styles.inputError : {}) }}
                    aria-required="true"
                    aria-describedby={errors.number ? 'cardNumber-error' : undefined}
                  />
                  {errors.number && <p id="cardNumber-error" style={styles.errorText}>{errors.number}</p>}
                </div>

                <div style={styles.fieldFull}>
                  <label htmlFor="cardName" style={styles.label}>Cardholder Name *</label>
                  <input
                    id="cardName"
                    name="name"
                    type="text"
                    value={card.name}
                    onChange={handleCardChange}
                    placeholder="As printed on card"
                    style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                    autoComplete="cc-name"
                    aria-required="true"
                    aria-describedby={errors.name ? 'cardName-error' : undefined}
                  />
                  {errors.name && <p id="cardName-error" style={styles.errorText}>{errors.name}</p>}
                </div>

                <div style={styles.fieldRow}>
                  <div>
                    <label htmlFor="cardExpiry" style={styles.label}>Expiry (MM/YY) *</label>
                    <input
                      id="cardExpiry"
                      name="expiry"
                      type="text"
                      inputMode="numeric"
                      value={card.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      style={{ ...styles.input, ...(errors.expiry ? styles.inputError : {}) }}
                      autoComplete="cc-exp"
                      aria-required="true"
                      aria-describedby={errors.expiry ? 'cardExpiry-error' : undefined}
                    />
                    {errors.expiry && <p id="cardExpiry-error" style={styles.errorText}>{errors.expiry}</p>}
                  </div>
                  <div>
                    <label htmlFor="cardCvv" style={styles.label}>CVV *</label>
                    <input
                      id="cardCvv"
                      name="cvv"
                      type="password"
                      inputMode="numeric"
                      value={card.cvv}
                      onChange={handleCardChange}
                      placeholder="•••"
                      style={{ ...styles.input, ...(errors.cvv ? styles.inputError : {}) }}
                      autoComplete="cc-csc"
                      aria-required="true"
                      aria-describedby={errors.cvv ? 'cardCvv-error' : undefined}
                    />
                    {errors.cvv && <p id="cardCvv-error" style={styles.errorText}>{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {method === 'upi' && (
              <div>
                <div style={styles.testModeBanner}>
                  <div style={styles.testModeBannerTitle}>🧪 Test Mode</div>
                  <div>Use <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}>test@upi</span> to simulate a successful UPI payment.</div>
                </div>
                <label htmlFor="upiId" style={styles.label}>UPI ID *</label>
                <div style={styles.upiRow}>
                  <div style={styles.upiInput}>
                    <input
                      id="upiId"
                      type="text"
                      value={upi}
                      onChange={(e) => { setUpi(e.target.value); if (errors.upi) setErrors((p) => ({ ...p, upi: '' })); }}
                      placeholder="yourname@upi"
                      style={{ ...styles.input, ...(errors.upi ? styles.inputError : {}) }}
                      aria-required="true"
                      aria-describedby={errors.upi ? 'upi-error' : undefined}
                    />
                  </div>
                  <button type="button" style={styles.verifyBtn}>Verify</button>
                </div>
                {errors.upi && <p id="upi-error" style={styles.errorText}>{errors.upi}</p>}
              </div>
            )}

            {method === 'netbanking' && (
              <div style={styles.testModeBanner}>
                <div style={styles.testModeBannerTitle}>🧪 Test Mode</div>
                <div>You will be redirected to a simulated bank portal. No real transaction occurs.</div>
              </div>
            )}

            {method === 'wallet' && (
              <div>
                <div style={styles.testModeBanner}>
                  <div style={styles.testModeBannerTitle}>🧪 Test Mode</div>
                  <div>Wallet payments are simulated in this environment.</div>
                </div>
                <label style={styles.label}>Choose Wallet *</label>
                <div style={styles.walletList}>
                  {WALLETS.map((w) => (
                    <label key={w} style={{ ...styles.walletOption, ...(wallet === w ? styles.walletOptionSelected : {}) }}>
                      <input
                        type="radio"
                        name="wallet"
                        value={w}
                        checked={wallet === w}
                        onChange={() => { setWallet(w); if (errors.wallet) setErrors((p) => ({ ...p, wallet: '' })); }}
                        style={styles.methodRadio}
                      />
                      {w}
                    </label>
                  ))}
                </div>
                {errors.wallet && <p style={styles.errorText}>{errors.wallet}</p>}
              </div>
            )}

            {method === 'cod' && (
              <div style={{ ...styles.testModeBanner, backgroundColor: '#d3f9d8', borderColor: '#37b24d' }}>
                <div style={{ fontWeight: '600', color: '#2b8a3e', marginBottom: '4px' }}>Cash on Delivery</div>
                <div style={{ fontSize: '14px', color: '#495057' }}>Pay when your order arrives. Additional COD charges may apply.</div>
              </div>
            )}
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.backBtn}
              onClick={() => navigate('/checkout/address')}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e8ecfd'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              ← Back
            </button>
            <button
              type="submit"
              style={styles.primaryBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
            >
              Review Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
