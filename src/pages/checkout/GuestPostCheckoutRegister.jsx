import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoSvg from '@/assets/images/logo.svg';

const styles = {
  page: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 16px',
  },
  logo: {
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    border: '1px solid #e9ecef',
    boxShadow: '0 2px 16px rgba(33,37,41,0.06)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '32px',
    letterSpacing: '-0.01em',
    color: '#212529',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    textAlign: 'center',
    marginBottom: '32px',
  },
  benefitList: {
    listStyle: 'none',
    padding: '0',
    margin: '0 0 28px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: '#343a40',
    lineHeight: '20px',
  },
  benefitDot: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    backgroundColor: '#37b24d',
    flexShrink: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e9ecef',
    margin: '24px 0',
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
    minHeight: '44px',
    transition: 'border-color 0.15s',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
  },
  inputError: {
    borderColor: '#f03e3e',
    backgroundColor: '#ffe3e3',
  },
  errorText: {
    fontSize: '12px',
    color: '#f03e3e',
    marginTop: '4px',
    lineHeight: '16px',
  },
  passwordStrength: {
    marginTop: '8px',
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  strengthBar: {
    flex: 1,
    height: '4px',
    borderRadius: '9999px',
    backgroundColor: '#e9ecef',
    transition: 'background-color 0.2s',
  },
  strengthLabel: {
    fontSize: '12px',
    color: '#495057',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
    minWidth: '50px',
  },
  primaryBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4c6ef5',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'background-color 0.15s',
    marginTop: '8px',
  },
  primaryBtnDisabled: {
    backgroundColor: '#adb5bd',
    cursor: 'not-allowed',
  },
  skipLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: 'inherit',
    lineHeight: '20px',
  },
  successState: {
    textAlign: 'center',
    padding: '20px 0',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '9999px',
    backgroundColor: '#d3f9d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
    fontSize: '32px',
  },
  successHeading: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#212529',
    marginBottom: '8px',
  },
  successDesc: {
    fontSize: '14px',
    color: '#495057',
    lineHeight: '20px',
    marginBottom: '24px',
  },
  termsText: {
    fontSize: '12px',
    color: '#868e96',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: '18px',
  },
  termsLink: {
    color: '#4c6ef5',
    textDecoration: 'underline',
  },
};

const BENEFITS = [
  'Track your orders in real-time',
  'Save multiple delivery addresses',
  'Faster checkout on future orders',
  'Exclusive member offers and early access',
];

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', colors: [] };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colorMap = [
    '#e9ecef',
    '#f03e3e',
    '#fd7e14',
    '#4c6ef5',
    '#37b24d',
  ];
  const filled = colorMap[score];
  const colors = Array.from({ length: 4 }, (_, i) => (i < score ? filled : '#e9ecef'));
  return { score, label: labels[score], colors };
}

export default function GuestPostCheckoutRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const order = (() => {
    try {
      const stored = sessionStorage.getItem('lastOrder');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Enter a valid email address.';
    }
    if (!form.password || form.password.length < 8) {
      e.password = 'Password must be at least 8 characters.';
    }
    if (form.password !== form.confirmPassword) {
      e.confirmPassword = 'Passwords do not match.';
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // Simulate account creation
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  if (success) {
    return (
      <div style={styles.page}>
        <img src={logoSvg} alt="Logo" width={120} style={styles.logo} />
        <div style={styles.card}>
          <div style={styles.successState}>
            <div style={styles.successIcon} role="img" aria-label="Success">🎉</div>
            <div style={styles.successHeading}>Account Created!</div>
            <div style={styles.successDesc}>
              Welcome! Your account has been created and you're now signed in.
              You can track your order and manage your details from your account.
            </div>
            <Link
              to="/orders"
              style={{ ...styles.primaryBtn, display: 'inline-block', textDecoration: 'none', textAlign: 'center', marginBottom: '12px' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
            >
              View My Orders
            </Link>
            <Link
              to="/"
              style={{ display: 'block', fontSize: '14px', color: '#4c6ef5', textAlign: 'center', textDecoration: 'none', marginTop: '8px' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <img src={logoSvg} alt="Logo" width={120} style={styles.logo} />
      <div style={styles.card}>
        <h1 style={styles.heading}>Save Your Details</h1>
        <p style={styles.subheading}>
          Create an account to track your order and checkout faster next time.
        </p>

        <ul style={styles.benefitList}>
          {BENEFITS.map((b) => (
            <li key={b} style={styles.benefitItem}>
              <span style={styles.benefitDot} />
              {b}
            </li>
          ))}
        </ul>

        {order?.address?.phone && (
          <div style={{ backgroundColor: '#e8ecfd', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#495057', marginBottom: '20px', lineHeight: '18px' }}>
            Registering for <strong>{order.address.fullName}</strong> — order <span style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", fontSize: '12px', color: '#4c6ef5' }}>{order.orderId}</span>
          </div>
        )}

        <hr style={styles.divider} />

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldFull}>
            <label htmlFor="reg-email" style={styles.label}>Email Address *</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              autoComplete="email"
              aria-required="true"
              aria-describedby={errors.email ? 'reg-email-error' : undefined}
            />
            {errors.email && <p id="reg-email-error" style={styles.errorText}>{errors.email}</p>}
          </div>

          <div style={styles.fieldFull}>
            <label htmlFor="reg-password" style={styles.label}>Password *</label>
            <input
              id="reg-password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              autoComplete="new-password"
              aria-required="true"
              aria-describedby={errors.password ? 'reg-password-error' : 'password-strength'}
            />
            {errors.password && <p id="reg-password-error" style={styles.errorText}>{errors.password}</p>}
            {form.password && !errors.password && (
              <div id="password-strength" style={styles.passwordStrength} aria-label={`Password strength: ${strength.label}`}>
                {strength.colors.map((color, i) => (
                  <div key={i} style={{ ...styles.strengthBar, backgroundColor: color }} />
                ))}
                <span style={{ ...styles.strengthLabel, color: strength.score <= 1 ? '#f03e3e' : strength.score === 2 ? '#fd7e14' : strength.score === 3 ? '#4c6ef5' : '#37b24d' }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div style={styles.fieldFull}>
            <label htmlFor="reg-confirm-password" style={styles.label}>Confirm Password *</label>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
              autoComplete="new-password"
              aria-required="true"
              aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
            />
            {errors.confirmPassword && <p id="reg-confirm-error" style={styles.errorText}>{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            style={{
              ...styles.primaryBtn,
              ...(submitting ? styles.primaryBtnDisabled : {}),
            }}
            disabled={submitting}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#3b5bdb'; }}
            onMouseLeave={(e) => { if (!submitting) e.currentTarget.style.backgroundColor = '#4c6ef5'; }}
          >
            {submitting ? 'Creating Account…' : 'Create Account'}
          </button>

          <p style={styles.termsText}>
            By creating an account you agree to our{' '}
            <a href="/terms" style={styles.termsLink}>Terms of Service</a>{' '}and{' '}
            <a href="/privacy" style={styles.termsLink}>Privacy Policy</a>.
          </p>
        </form>

        <button
          type="button"
          style={styles.skipLink}
          onClick={() => navigate('/')}
        >
          No thanks, continue as guest
        </button>
      </div>
    </div>
  );
}
