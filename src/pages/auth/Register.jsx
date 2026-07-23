import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    padding: '16px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 2px 16px rgba(33,37,41,0.10)',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '40px',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    color: '#212529',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtext: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#212529',
    marginBottom: '6px',
    lineHeight: '20px',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    lineHeight: '24px',
    color: '#343a40',
    backgroundColor: '#ffffff',
    border: '1px solid #868e96',
    borderRadius: '6px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  fieldError: {
    color: '#f03e3e',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
    lineHeight: '16px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  rateBanner: {
    backgroundColor: '#fff4e6',
    border: '1px solid #fd7e14',
    borderRadius: '6px',
    padding: '12px 16px',
    color: '#fd7e14',
    fontSize: '14px',
    lineHeight: '20px',
    marginBottom: '16px',
  },
  btn: {
    display: 'block',
    width: '100%',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    lineHeight: '24px',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    marginTop: '8px',
  },
  btnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  loginPrompt: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#495057',
    marginTop: '24px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  hint: {
    fontSize: '12px',
    color: '#495057',
    marginTop: '4px',
    display: 'block',
    lineHeight: '16px',
  },
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Enter a valid email address.';
  return null;
}

function validateFullName(value) {
  if (value && value.length > 255) return 'Full name must not exceed 255 characters.';
  return null;
}

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return null;
}

function validatePhone(value) {
  if (value && value.length > 30) return 'Enter a valid phone number.';
  return null;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function validate() {
    const next = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) next.email = emailErr;
    const nameErr = validateFullName(form.full_name);
    if (nameErr) next.full_name = nameErr;
    const pwErr = validatePassword(form.password);
    if (pwErr) next.password = pwErr;
    const confirmErr = validateConfirm(form.confirm, form.password);
    if (confirmErr) next.confirm = confirmErr;
    const phoneErr = validatePhone(form.phone);
    if (phoneErr) next.phone = phoneErr;
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });
      if (res.status === 409) {
        setBanner({ type: 'conflict' });
      } else if (res.status === 429) {
        setBanner({ type: 'rate' });
      } else if (!res.ok) {
        setBanner({ type: 'network' });
      } else {
        navigate('/');
      }
    } catch {
      setBanner({ type: 'network' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subtext}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {banner?.type === 'conflict' && (
            <div role="alert" style={styles.errorBanner}>
              An account with this email already exists.{' '}
              <Link to="/login" style={{ color: '#f03e3e', fontWeight: '500' }}>Log in instead</Link>
            </div>
          )}
          {banner?.type === 'rate' && (
            <div role="alert" style={styles.rateBanner}>
              Too many attempts. Please wait before trying again.
            </div>
          )}
          {banner?.type === 'network' && (
            <div role="alert" style={styles.errorBanner}>
              Something went wrong. Please try again.
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="reg-full-name" style={styles.label}>Full name</label>
            <input
              id="reg-full-name"
              name="full_name"
              type="text"
              autoComplete="name"
              value={form.full_name}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.full_name ? styles.inputError : {}) }}
              aria-describedby={errors.full_name ? 'reg-full-name-error' : undefined}
              aria-invalid={!!errors.full_name}
              maxLength={255}
            />
            {errors.full_name && (
              <span id="reg-full-name-error" role="alert" style={styles.fieldError}>
                {errors.full_name}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-email" style={styles.label}>Email address</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
              aria-invalid={!!errors.email}
              maxLength={320}
            />
            {errors.email && (
              <span id="reg-email-error" role="alert" style={styles.fieldError}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-phone" style={styles.label}>
              Phone number <span style={{ color: '#495057', fontWeight: '400' }}>(optional)</span>
            </label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
              aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
              aria-invalid={!!errors.phone}
              maxLength={30}
            />
            {errors.phone && (
              <span id="reg-phone-error" role="alert" style={styles.fieldError}>
                {errors.phone}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-password" style={styles.label}>Password</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              aria-describedby={errors.password ? 'reg-password-error' : 'reg-password-hint'}
              aria-invalid={!!errors.password}
            />
            {errors.password ? (
              <span id="reg-password-error" role="alert" style={styles.fieldError}>
                {errors.password}
              </span>
            ) : (
              <span id="reg-password-hint" style={styles.hint}>
                Must be at least 8 characters.
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reg-confirm" style={styles.label}>Confirm password</label>
            <input
              id="reg-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.confirm ? styles.inputError : {}) }}
              aria-describedby={errors.confirm ? 'reg-confirm-error' : undefined}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && (
              <span id="reg-confirm-error" role="alert" style={styles.fieldError}>
                {errors.confirm}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={styles.loginPrompt}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
