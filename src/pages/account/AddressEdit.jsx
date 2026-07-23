import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
    margin: '0 0 32px 0',
    color: '#212529',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
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
  input: {
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
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorMsg: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#212529',
    cursor: 'pointer',
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
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#212529',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '20px',
  },
};

const SAMPLE_ADDRESSES = {
  '1': { fullName: 'Jane Smith', line1: '123 Main Street', line2: 'Apt 4B', city: 'New York', state: 'NY', postcode: '10001', country: 'United States', isDefault: true },
  '2': { fullName: 'Jane Smith', line1: '456 Oak Avenue', line2: '', city: 'Brooklyn', state: 'NY', postcode: '11201', country: 'United States', isDefault: false },
};

export default function AddressEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = SAMPLE_ADDRESSES[id];

  const [form, setForm] = useState(existing || { fullName: '', line1: '', line2: '', city: '', state: '', postcode: '', country: '', isDefault: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!existing) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button style={styles.backLink} onClick={() => navigate('/account/addresses')}>← Back to addresses</button>
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ fontSize: '16px', color: '#212529', marginBottom: '12px' }}>Address not found.</p>
            <button style={styles.btnPrimary} onClick={() => navigate('/account/addresses')}>Go to addresses</button>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    if (!form.line1.trim()) e.line1 = 'Address line 1 is required.';
    if (!form.city.trim()) e.city = 'City is required.';
    if (!form.postcode.trim()) e.postcode = 'Postcode is required.';
    if (!form.country.trim()) e.country = 'Country is required.';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSuccess(true);
    setTimeout(() => navigate('/account/addresses'), 1500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backLink} onClick={() => navigate('/account/addresses')}>← Back to addresses</button>
        <h1 style={styles.heading}>Edit address</h1>
        <div style={styles.card}>
          {success && <div style={styles.successBanner}>Address updated successfully.</div>}
          <form onSubmit={handleSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="fullName">Full name</label>
              <input id="fullName" type="text" autoComplete="name" style={{ ...styles.input, ...(errors.fullName ? styles.inputError : {}) }} value={form.fullName} onChange={ev => setForm(f => ({ ...f, fullName: ev.target.value }))} />
              {errors.fullName && <p style={styles.errorMsg}>{errors.fullName}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="line1">Address line 1</label>
              <input id="line1" type="text" autoComplete="address-line1" style={{ ...styles.input, ...(errors.line1 ? styles.inputError : {}) }} value={form.line1} onChange={ev => setForm(f => ({ ...f, line1: ev.target.value }))} />
              {errors.line1 && <p style={styles.errorMsg}>{errors.line1}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="line2">Address line 2 (optional)</label>
              <input id="line2" type="text" autoComplete="address-line2" style={styles.input} value={form.line2} onChange={ev => setForm(f => ({ ...f, line2: ev.target.value }))} />
            </div>
            <div style={styles.formRow}>
              <div>
                <label style={styles.label} htmlFor="city">City</label>
                <input id="city" type="text" autoComplete="address-level2" style={{ ...styles.input, ...(errors.city ? styles.inputError : {}) }} value={form.city} onChange={ev => setForm(f => ({ ...f, city: ev.target.value }))} />
                {errors.city && <p style={styles.errorMsg}>{errors.city}</p>}
              </div>
              <div>
                <label style={styles.label} htmlFor="state">State / Region</label>
                <input id="state" type="text" autoComplete="address-level1" style={styles.input} value={form.state} onChange={ev => setForm(f => ({ ...f, state: ev.target.value }))} />
              </div>
            </div>
            <div style={styles.formRow}>
              <div>
                <label style={styles.label} htmlFor="postcode">Postcode / ZIP</label>
                <input id="postcode" type="text" autoComplete="postal-code" style={{ ...styles.input, ...(errors.postcode ? styles.inputError : {}) }} value={form.postcode} onChange={ev => setForm(f => ({ ...f, postcode: ev.target.value }))} />
                {errors.postcode && <p style={styles.errorMsg}>{errors.postcode}</p>}
              </div>
              <div>
                <label style={styles.label} htmlFor="country">Country</label>
                <input id="country" type="text" autoComplete="country-name" style={{ ...styles.input, ...(errors.country ? styles.inputError : {}) }} value={form.country} onChange={ev => setForm(f => ({ ...f, country: ev.target.value }))} />
                {errors.country && <p style={styles.errorMsg}>{errors.country}</p>}
              </div>
            </div>
            <div style={styles.checkboxRow}>
              <input id="isDefault" type="checkbox" style={styles.checkbox} checked={form.isDefault} onChange={ev => setForm(f => ({ ...f, isDefault: ev.target.checked }))} />
              <label htmlFor="isDefault" style={styles.checkboxLabel}>Set as default address</label>
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary}>Save changes</button>
              <button type="button" style={styles.btnGhost} onClick={() => navigate('/account/addresses')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
