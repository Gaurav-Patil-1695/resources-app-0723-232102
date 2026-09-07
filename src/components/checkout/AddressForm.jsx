import React, { useState } from 'react';
import mapPinIcon from '@/assets/icons/map-pin.svg';

const SERVICEABLE_PINS = ['110001', '400001', '560001', '600001', '700001'];

const INITIAL_STATE = {
  fullName: '',
  phone: '',
  pincode: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  landmark: '',
};

/**
 * AddressForm
 * Props:
 *   onSubmit {(addressData: object) => void}
 *   defaultValues {object} - pre-fill fields
 *   submitLabel {string}
 */
const AddressForm = ({ onSubmit, defaultValues = {}, submitLabel = 'Save & Continue' }) => {
  const [form, setForm] = useState({ ...INITIAL_STATE, ...defaultValues });
  const [errors, setErrors] = useState({});
  const [pincodeStatus, setPincodeStatus] = useState(null); // null | 'checking' | 'serviceable' | 'not-serviceable'
  const [pincodeTimer, setPincodeTimer] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'pincode') {
      setPincodeStatus(null);
      if (pincodeTimer) clearTimeout(pincodeTimer);
      if (value.length === 6 && /^\d{6}$/.test(value)) {
        setPincodeStatus('checking');
        const timer = setTimeout(() => {
          if (SERVICEABLE_PINS.includes(value)) {
            setPincodeStatus('serviceable');
            setForm((prev) => ({
              ...prev,
              city: prev.city || 'Auto-detected City',
              state: prev.state || 'Auto-detected State',
            }));
          } else {
            setPincodeStatus('not-serviceable');
          }
        }, 700);
        setPincodeTimer(timer);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!/^[6-9]\d{9}$/.test(form.phone)) newErrors.phone = 'Enter a valid 10-digit mobile number.';
    if (!/^\d{6}$/.test(form.pincode)) newErrors.pincode = 'Enter a valid 6-digit PIN code.';
    if (pincodeStatus === 'not-serviceable') newErrors.pincode = 'Delivery is not available at this PIN code.';
    if (!form.addressLine1.trim()) newErrors.addressLine1 = 'Address line 1 is required.';
    if (!form.city.trim()) newErrors.city = 'City is required.';
    if (!form.state.trim()) newErrors.state = 'State is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (onSubmit) onSubmit(form);
  };

  const renderPincodeStatus = () => {
    if (pincodeStatus === 'checking') {
      return <span className="address-form__pin-msg address-form__pin-msg--checking">Checking serviceability…</span>;
    }
    if (pincodeStatus === 'serviceable') {
      return <span className="address-form__pin-msg address-form__pin-msg--ok">✓ Delivery available at this PIN</span>;
    }
    if (pincodeStatus === 'not-serviceable') {
      return <span className="address-form__pin-msg address-form__pin-msg--error">✗ Delivery not available at this PIN</span>;
    }
    return null;
  };

  return (
    <form className="address-form" onSubmit={handleSubmit} noValidate>
      <h2 className="address-form__title">
        <img src={mapPinIcon} alt="" className="address-form__title-icon" aria-hidden="true" />
        Delivery Address
      </h2>

      <div className="address-form__row">
        <div className="address-form__field">
          <label htmlFor="af-fullName" className="address-form__label">Full Name *</label>
          <input
            id="af-fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            className={`address-form__input${errors.fullName ? ' address-form__input--error' : ''}`}
            autoComplete="name"
            placeholder="Enter full name"
          />
          {errors.fullName && <span className="address-form__error" role="alert">{errors.fullName}</span>}
        </div>

        <div className="address-form__field">
          <label htmlFor="af-phone" className="address-form__label">Mobile Number *</label>
          <input
            id="af-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className={`address-form__input${errors.phone ? ' address-form__input--error' : ''}`}
            autoComplete="tel"
            placeholder="10-digit mobile number"
            maxLength={10}
          />
          {errors.phone && <span className="address-form__error" role="alert">{errors.phone}</span>}
        </div>
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label htmlFor="af-pincode" className="address-form__label">PIN Code *</label>
          <input
            id="af-pincode"
            name="pincode"
            type="text"
            value={form.pincode}
            onChange={handleChange}
            className={`address-form__input${
              errors.pincode
                ? ' address-form__input--error'
                : pincodeStatus === 'serviceable'
                ? ' address-form__input--success'
                : ''
            }`}
            inputMode="numeric"
            placeholder="6-digit PIN"
            maxLength={6}
          />
          {renderPincodeStatus()}
          {errors.pincode && <span className="address-form__error" role="alert">{errors.pincode}</span>}
        </div>
      </div>

      <div className="address-form__field">
        <label htmlFor="af-addressLine1" className="address-form__label">Address Line 1 *</label>
        <input
          id="af-addressLine1"
          name="addressLine1"
          type="text"
          value={form.addressLine1}
          onChange={handleChange}
          className={`address-form__input${errors.addressLine1 ? ' address-form__input--error' : ''}`}
          autoComplete="address-line1"
          placeholder="House/Flat no., Building name, Street"
        />
        {errors.addressLine1 && <span className="address-form__error" role="alert">{errors.addressLine1}</span>}
      </div>

      <div className="address-form__field">
        <label htmlFor="af-addressLine2" className="address-form__label">Address Line 2</label>
        <input
          id="af-addressLine2"
          name="addressLine2"
          type="text"
          value={form.addressLine2}
          onChange={handleChange}
          className="address-form__input"
          autoComplete="address-line2"
          placeholder="Area, Locality (optional)"
        />
      </div>

      <div className="address-form__field">
        <label htmlFor="af-landmark" className="address-form__label">Landmark</label>
        <input
          id="af-landmark"
          name="landmark"
          type="text"
          value={form.landmark}
          onChange={handleChange}
          className="address-form__input"
          placeholder="Near school, hospital, etc. (optional)"
        />
      </div>

      <div className="address-form__row">
        <div className="address-form__field">
          <label htmlFor="af-city" className="address-form__label">City *</label>
          <input
            id="af-city"
            name="city"
            type="text"
            value={form.city}
            onChange={handleChange}
            className={`address-form__input${errors.city ? ' address-form__input--error' : ''}`}
            autoComplete="address-level2"
            placeholder="City"
          />
          {errors.city && <span className="address-form__error" role="alert">{errors.city}</span>}
        </div>

        <div className="address-form__field">
          <label htmlFor="af-state" className="address-form__label">State *</label>
          <input
            id="af-state"
            name="state"
            type="text"
            value={form.state}
            onChange={handleChange}
            className={`address-form__input${errors.state ? ' address-form__input--error' : ''}`}
            autoComplete="address-level1"
            placeholder="State"
          />
          {errors.state && <span className="address-form__error" role="alert">{errors.state}</span>}
        </div>
      </div>

      <div className="address-form__actions">
        <button type="submit" className="address-form__submit">
          {submitLabel}
        </button>
      </div>

      <style>{`
        .address-form {
          background: #ffffff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }
        .address-form__title {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 20px;
        }
        .address-form__title-icon {
          width: 20px;
          height: 20px;
          color: #16a34a;
        }
        .address-form__row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .address-form__row {
            grid-template-columns: 1fr;
          }
        }
        .address-form__field {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
        }
        .address-form__label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        .address-form__input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          color: #111827;
          background: #f9fafb;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          outline: none;
        }
        .address-form__input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.12);
          background: #ffffff;
        }
        .address-form__input--error {
          border-color: #dc2626;
        }
        .address-form__input--error:focus {
          box-shadow: 0 0 0 3px rgba(220,38,38,0.12);
        }
        .address-form__input--success {
          border-color: #16a34a;
        }
        .address-form__error {
          font-size: 12px;
          color: #dc2626;
        }
        .address-form__pin-msg {
          font-size: 12px;
          margin-top: 2px;
        }
        .address-form__pin-msg--checking {
          color: #6b7280;
        }
        .address-form__pin-msg--ok {
          color: #16a34a;
          font-weight: 500;
        }
        .address-form__pin-msg--error {
          color: #dc2626;
          font-weight: 500;
        }
        .address-form__actions {
          margin-top: 8px;
        }
        .address-form__submit {
          width: 100%;
          padding: 12px;
          background-color: #16a34a;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .address-form__submit:hover {
          background-color: #15803d;
        }
        .address-form__submit:active {
          background-color: #166534;
        }
      `}</style>
    </form>
  );
};

export default AddressForm;
