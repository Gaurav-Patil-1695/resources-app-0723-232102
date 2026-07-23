import { useState } from 'react';

const ForgotPasswordForm = ({ onSubmit, isLoading = false, error = null, success = false }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (onSubmit) {
      onSubmit({ email });
    }
  };

  if (success) {
    return (
      <div className="auth-form forgot-password-form">
        <div className="form-alert form-alert--success" role="status">
          If an account exists for that email, you will receive a password reset link shortly.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form forgot-password-form">
      <p className="form-description">
        Enter the email address associated with your account and we will send you a link to reset
        your password.
      </p>

      <div className="form-group">
        <label htmlFor="forgot-email" className="form-label">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter your email"
          className={`form-input${errors.email ? ' form-input--error' : ''}`}
          autoComplete="email"
          disabled={isLoading}
        />
        {errors.email && (
          <span className="form-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      {error && (
        <div className="form-alert form-alert--error" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn--primary btn--full"
        disabled={isLoading}
      >
        {isLoading ? 'Sending…' : 'Send Reset Link'}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
