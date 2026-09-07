import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    marginBottom: '24px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    marginBottom: '20px',
    marginTop: 0,
  },
  formGroup: {
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
  btnRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
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
  successBanner: {
    backgroundColor: '#d3f9d8',
    color: '#212529',
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '20px',
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
};

export default function AccountProfile() {
  const navigate = useNavigate();
  const [profileForm, setProfileForm] = useState({ firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const validateProfile = () => {
    const errors = {};
    if (!profileForm.firstName.trim()) errors.firstName = 'First name is required.';
    if (!profileForm.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!profileForm.email.trim()) errors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) errors.email = 'Enter a valid email address.';
    return errors;
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) errors.currentPassword = 'Current password is required.';
    if (!passwordForm.newPassword) errors.newPassword = 'New password is required.';
    else if (passwordForm.newPassword.length < 8) errors.newPassword = 'Password must be at least 8 characters.';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handleProfileSubmit = e => {
    e.preventDefault();
    const errors = validateProfile();
    if (Object.keys(errors).length > 0) { setProfileErrors(errors); return; }
    setProfileErrors({});
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) { setPasswordErrors(errors); return; }
    setPasswordErrors({});
    setPasswordSuccess(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button style={styles.backLink} onClick={() => navigate('/account')}>← Back to account</button>
        <h1 style={styles.heading}>Account profile</h1>

        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Personal information</h2>
          {profileSuccess && <div style={styles.successBanner}>Profile updated successfully.</div>}
          <form onSubmit={handleProfileSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                style={{ ...styles.input, ...(profileErrors.firstName ? styles.inputError : {}) }}
                value={profileForm.firstName}
                onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
                autoComplete="given-name"
              />
              {profileErrors.firstName && <p style={styles.errorMsg}>{profileErrors.firstName}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                style={{ ...styles.input, ...(profileErrors.lastName ? styles.inputError : {}) }}
                value={profileForm.lastName}
                onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
                autoComplete="family-name"
              />
              {profileErrors.lastName && <p style={styles.errorMsg}>{profileErrors.lastName}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                style={{ ...styles.input, ...(profileErrors.email ? styles.inputError : {}) }}
                value={profileForm.email}
                onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
              {profileErrors.email && <p style={styles.errorMsg}>{profileErrors.email}</p>}
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary}>Save changes</button>
            </div>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionHeading}>Change password</h2>
          {passwordSuccess && <div style={styles.successBanner}>Password updated successfully.</div>}
          <form onSubmit={handlePasswordSubmit} noValidate>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="currentPassword">Current password</label>
              <input
                id="currentPassword"
                type="password"
                style={{ ...styles.input, ...(passwordErrors.currentPassword ? styles.inputError : {}) }}
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                autoComplete="current-password"
              />
              {passwordErrors.currentPassword && <p style={styles.errorMsg}>{passwordErrors.currentPassword}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="newPassword">New password</label>
              <input
                id="newPassword"
                type="password"
                style={{ ...styles.input, ...(passwordErrors.newPassword ? styles.inputError : {}) }}
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                autoComplete="new-password"
              />
              {passwordErrors.newPassword && <p style={styles.errorMsg}>{passwordErrors.newPassword}</p>}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="confirmPassword">Confirm new password</label>
              <input
                id="confirmPassword"
                type="password"
                style={{ ...styles.input, ...(passwordErrors.confirmPassword ? styles.inputError : {}) }}
                value={passwordForm.confirmPassword}
                onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                autoComplete="new-password"
              />
              {passwordErrors.confirmPassword && <p style={styles.errorMsg}>{passwordErrors.confirmPassword}</p>}
            </div>
            <div style={styles.btnRow}>
              <button type="submit" style={styles.btnPrimary}>Update password</button>
              <button type="button" style={styles.btnGhost} onClick={() => { setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
