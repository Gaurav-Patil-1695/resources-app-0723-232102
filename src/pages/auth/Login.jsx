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
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    fontSize: '14px',
    color: '#4c6ef5',
    textDecoration: 'none',
    marginTop: '6px',
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
  divider: {
    margin: '24px 0',
    borderColor: '#e9ecef',
  },
  registerPrompt: {
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
};

function validateEmail(value) {
  if (!value) return 'Enter a valid email address.';
  if (value.length > 320) return 'Enter a valid email address.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(value)) return 'Enter a valid email address.';
  return null;
}

function validatePassword(value) {
  if (!value) return 'Password is required.';
  return null;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    const pwErr = validatePassword(form.password);
    if (pwErr) next.password = pwErr;
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (res.status === 401) {
        setBanner({ type: 'auth', message: 'Incorrect email or password.' });
      } else if (res.status === 429) {
        setBanner({ type: 'rate', message: 'Too many login attempts. Please try again later.' });
      } else if (!res.ok) {
        setBanner({ type: 'network', message: 'Something went wrong. Please try again.' });
      } else {
        navigate('/');
      }
    } catch {
      setBanner({ type: 'network', message: 'Something went wrong. Please try again.' });
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
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.subtext}>Sign in to your account to continue.</p>

        <form onSubmit={handleSubmit} noValidate>
          {banner && (
            <div role="alert" style={styles.errorBanner}>
              {banner.message}
            </div>
          )}

          <div style={styles.formGroup}>
            <label htmlFor="login-email" style={styles.label}>Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
              aria-invalid={!!errors.email}
              maxLength={320}
            />
            {errors.email && (
              <span id="login-email-error" role="alert" style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.email}
              </span>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="login-password" style={styles.label}>Password</label>
            <input
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
              aria-describedby={errors.password ? 'login-password-error' : undefined}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <span id="login-password-error" role="alert" style={{ color: '#f03e3e', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                {errors.password}
              </span>
            )}
            <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
          </div>

          <button
            type="submit"
            style={{ ...styles.btn, ...(loading ? styles.btnDisabled : {}) }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={styles.registerPrompt}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
