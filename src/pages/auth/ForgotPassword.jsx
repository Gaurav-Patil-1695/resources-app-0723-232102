import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    marginTop: '40px',
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
    marginBottom: '16px',
  },
  btnDisabled: {
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed',
  },
  linksRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    fontSize: '14px',
    marginTop: '8px',
  },
  link: {
    color: '#4c6ef5',
    textDecoration: 'none',
    fontWeight: '500',
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

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Enter a valid email address.';
  return null;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setEmail(e.target.value);
    if (emailError) setEmailError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent enumeration
      setSubmitted(true);
    } catch {
      setSubmitted(true);
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

        {submitted ? (
          <div style={styles.successWrap}>
            <div style={styles.successIcon}>
              <img src={checkIcon} alt="" aria-hidden="true" width={28} height={28} />
            </div>
            <h1 style={styles.successHeading}>Check your email</h1>
            <p style={styles.successText}>
              If that address is registered, a reset link is on its way. Check your inbox and follow the instructions.
            </p>
            <Link to="/login" style={styles.successBtn}>Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 style={styles.heading}>Forgot password</h1>
            <p style={styles.subtext}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.formGroup}>
                <label htmlFor="forgot-email" style={styles.label}>Email address</label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleChange}
                  style={{ ...styles.input, ...(emailError ? styles.inputError : {}) }}
                  aria-describedby={emailError ? 'forgot-email-error' : undefined}
                  aria-invalid={!!emailError}
                  maxLength={320}
                />
                {emailError && (
                  <span id="forgot-email-error" role="alert" style={styles.fieldError}>
                    {emailError}
                  </span>
                )}
              </div>

              <button
                type="submit"
                style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
                disabled={loading}
              >
                {loading ? 'Sending…' : 'Reset password'}
              </button>
            </form>

            <div style={styles.linksRow}>
              <Link to="/login" style={styles.link}>Sign in</Link>
              <Link to="/register" style={styles.link}>Create account</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
