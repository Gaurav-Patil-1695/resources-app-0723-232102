import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.svg';
import checkIcon from '@/assets/icons/check.svg';

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
    maxWidth: '440px',
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
  hint: {
    fontSize: '12px',
    color: '#495057',
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
  invalidTokenBanner: {
    backgroundColor: '#ffe3e3',
    border: '1px solid #f03e3e',
    borderRadius: '6px',
    padding: '16px',
    color: '#f03e3e',
    fontSize: '14px',
    lineHeight: '20px',
    textAlign: 'center',
    marginBottom: '24px',
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
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
  },
  signInLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '4px',
    fontSize: '14px',
    color: '#4c6ef5',
  },
  successWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
  },
  successIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginBottom: '12px',
    lineHeight: '28px',
  },
  successText: {
    fontSize: '14px',
    color: '#495057',
    textAlign: 'center',
    marginBottom: '32px',
    lineHeight: '20px',
  },
  successBtn: {
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
    textDecoration: 'none',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
};

function validatePassword(value) {
  if (!value || value.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

function validateConfirm(value, password) {
  if (value !== password) return 'Passwords do not match.';
  return null;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  function validate() {
    const next = {};
    const pwErr = validatePassword(form.password);
    if (pwErr) next.password = pwErr;
    const confirmErr = validateConfirm(form.confirm, form.password);
    if (confirmErr) next.confirm = confirmErr;
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
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: form.password }),
      });
      if (res.status === 400 || res.status === 422) {
        setBanner({ type: 'invalid' });
      } else if (!res.ok) {
        setBanner({ type: 'network' });
      } else {
        setSuccess(true);
      }
    } catch {
      setBanner({ type: 'network' });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <div style={styles.invalidTokenBanner} role="alert">
            This password reset link is invalid or has expired.
          </div>
          <Link to="/forgot-password" style={{ ...styles.successBtn, display: 'block', textAlign: 'center', textDecoration: 'none', padding: '12px 24px', backgroundColor: '#4c6ef5', color: '#ffffff', borderRadius: '10px', fontWeight: '600', fontSize: '16px' }}>
            Request a new link
          </Link>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#495057' }}>
            <Link to="/login" style={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <img src={logo} alt="Logo" style={styles.logo} />
          </div>
          <div style={styles.successWrap}>
            <div style={styles.successIcon}>
              <img src={checkIcon} alt="" aria-hidden="true" width={28} height={28} />
            </div>
            <h1 style={styles.successHeading}>Password reset successfully</h1>
            <p style={styles.successText}>
              Your password has been updated. Please sign in with your new password.
            </p>
            <Link to="/login" style={styles.successBtn}>Go to sign in</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.heading}>Reset password</h1>
        <p style={styles.subtext}>Enter and confirm your new password below.</p>

        <form onSubmit={handleSubmit} noValidate>
          {banner?.type === 'invalid' && (
            <div role="alert" style={styles.errorBanner}>
              This reset link is invalid or has expired.{' '}
              <Link to="/forgot-password" style={{ color: '#f03e3e', fontWeight: '500' }}>Request a new one</Link>
            </div>
          )}
          {banner?.type === 'network' && (
            <div role="alert" style={styles.errorBanner}>
              Something went wrong. Please try again.
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="reset-password" style={styles.label}>New password</label>
            <input
              id="reset-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              aria-describedby={errors.password ? 'reset-password-error' : 'reset-password-hint'}
              aria-invalid={!!errors.password}
            />
            {errors.password ? (
              <span id="reset-password-error" role="alert" style={styles.fieldError}>
                {errors.password}
              </span>
            ) : (
              <span id="reset-password-hint" style={styles.hint}>
                Must be at least 8 characters.
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reset-confirm" style={styles.label}>Confirm new password</label>
            <input
              id="reset-confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.confirm ? styles.inputError : {}) }}
              aria-describedby={errors.confirm ? 'reset-confirm-error' : undefined}
              aria-invalid={!!errors.confirm}
            />
            {errors.confirm && (
              <span id="reset-confirm-error" role="alert" style={styles.fieldError}>
                {errors.confirm}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Saving…' : 'Set new password'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#495057' }}>
          Remember your password?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
