import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mapPinIcon from '@/assets/icons/map-pin.svg';
import checkIcon from '@/assets/icons/check.svg';

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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fieldRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  fieldFull: {
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
    transition: 'border-color 0.15s',
    minHeight: '44px',
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  inputSuccess: {
    borderColor: '#37b24d',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  pinRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  pinInputWrap: {
    flex: '1',
  },
  checkBtn: {
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    minHeight: '44px',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.15s',
  },
  checkBtnLoading: {
    backgroundColor: '#868e96',
    cursor: 'not-allowed',
  },
  serviceabilityMsg: {
    marginTop: '8px',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '500',
  },
  serviceabilitySuccess: {
    backgroundColor: '#d3f9d8',
    color: '#2b8a3e',
  },
  serviceabilityError: {
    backgroundColor: '#ffe3e3',
    color: '#c92a2a',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '24px',
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
  select: {
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
    appearance: 'none',
  },
};

const SERVICEABLE_PINS = ['110001', '400001', '560001', '600001', '700001'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pin: '',
    country: 'India',
  });
  const [errors, setErrors] = useState({});
  const [pinStatus, setPinStatus] = useState(null); // null | 'checking' | 'serviceable' | 'not-serviceable'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'pin') {
      setPinStatus(null);
    }
  };

  const checkPin = () => {
    if (!form.pin || form.pin.length !== 6) {
      setErrors((prev) => ({ ...prev, pin: 'Please enter a valid 6-digit PIN code.' }));
      return;
    }
    setPinStatus('checking');
    setTimeout(() => {
      if (SERVICEABLE_PINS.includes(form.pin)) {
        setPinStatus('serviceable');
      } else {
        setPinStatus('not-serviceable');
      }
    }, 800);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    if (!form.state) newErrors.state = 'State is required.';
    if (!form.pin || form.pin.length !== 6) newErrors.pin = 'Please enter a valid 6-digit PIN code.';
    if (pinStatus === 'not-serviceable') newErrors.pin = 'Delivery is not available at this PIN code.';
    if (pinStatus === null || pinStatus === 'checking') newErrors.pin = 'Please verify your PIN code serviceability.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    sessionStorage.setItem('checkoutAddress', JSON.stringify(form));
    navigate('/checkout/payment');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.stepIndicator}>
          <span style={styles.stepActive}>1. Address</span>
          <span style={styles.stepDivider}>›</span>
          <span>2. Payment</span>
          <span style={styles.stepDivider}>›</span>
          <span>3. Review</span>
        </div>

        <h1 style={styles.heading}>Delivery Address</h1>
        <p style={styles.subheading}>Enter the address where you'd like your order delivered.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.card}>
            <div style={styles.cardTitle}>
              <img src={mapPinIcon} alt="" width={18} height={18} />
              Shipping Details
            </div>

            <div style={styles.fieldRow}>
              <div>
                <label htmlFor="fullName" style={styles.label}>Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }}
                  autoComplete="name"
                  aria-required="true"
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                />
                {errors.fullName && <p id="fullName-error" style={styles.errorText}>{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="phone" style={styles.label}>Mobile Number *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                  autoComplete="tel"
                  maxLength={10}
                  aria-required="true"
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && <p id="phone-error" style={styles.errorText}>{errors.phone}</p>}
              </div>
            </div>

            <div style={styles.fieldFull}>
              <label htmlFor="addressLine1" style={styles.label}>Address Line 1 *</label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                value={form.addressLine1}
                onChange={handleChange}
                style={{ ...styles.input, ...(errors.addressLine1 ? styles.inputError : {}) }}
                autoComplete="address-line1"
                aria-required="true"
                aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
              />
              {errors.addressLine1 && <p id="addressLine1-error" style={styles.errorText}>{errors.addressLine1}</p>}
            </div>

            <div style={styles.fieldFull}>
              <label htmlFor="addressLine2" style={styles.label}>Address Line 2 (Optional)</label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                value={form.addressLine2}
                onChange={handleChange}
                style={styles.input}
                autoComplete="address-line2"
              />
            </div>

            <div style={styles.fieldRow}>
              <div>
                <label htmlFor="city" style={styles.label}>City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }}
                  autoComplete="address-level2"
                  aria-required="true"
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
                {errors.city && <p id="city-error" style={styles.errorText}>{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="state" style={styles.label}>State *</label>
                <select
                  id="state"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  style={{ ...styles.select, ...(errors.state ? styles.inputError : {}) }}
                  aria-required="true"
                  aria-describedby={errors.state ? 'state-error' : undefined}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <p id="state-error" style={styles.errorText}>{errors.state}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="pin" style={styles.label}>PIN Code *</label>
              <div style={styles.pinRow}>
                <div style={styles.pinInputWrap}>
                  <input
                    id="pin"
                    name="pin"
                    type="text"
                    value={form.pin}
                    onChange={handleChange}
                    maxLength={6}
                    style={{
                      ...styles.input,
                      ...(errors.pin ? styles.inputError : {}),
                      ...(pinStatus === 'serviceable' ? styles.inputSuccess : {}),
                    }}
                    autoComplete="postal-code"
                    aria-required="true"
                    aria-describedby={errors.pin ? 'pin-error' : 'pin-status'}
                  />
                </div>
                <button
                  type="button"
                  onClick={checkPin}
                  style={{
                    ...styles.checkBtn,
                    ...(pinStatus === 'checking' ? styles.checkBtnLoading : {}),
                  }}
                  disabled={pinStatus === 'checking'}
                >
                  {pinStatus === 'checking' ? 'Checking…' : 'Check'}
                </button>
              </div>
              {errors.pin && <p id="pin-error" style={styles.errorText}>{errors.pin}</p>}
              {pinStatus === 'serviceable' && !errors.pin && (
                <div
                  id="pin-status"
                  role="status"
                  style={{ ...styles.serviceabilityMsg, ...styles.serviceabilitySuccess }}
                >
                  ✓ Delivery available at this PIN code.
                </div>
              )}
              {pinStatus === 'not-serviceable' && (
                <div
                  id="pin-status"
                  role="alert"
                  style={{ ...styles.serviceabilityMsg, ...styles.serviceabilityError }}
                >
                  ✗ Sorry, we do not deliver to this PIN code.
                </div>
              )}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="submit"
              style={styles.primaryBtn}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
