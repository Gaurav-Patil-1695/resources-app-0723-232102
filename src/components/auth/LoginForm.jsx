import { useState } from 'react';

const LoginForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form login-form">
      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          name="email"
          value={formData.email}
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

      <div className="form-group">
        <label htmlFor="login-password" className="form-label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={`form-input${errors.password ? ' form-input--error' : ''}`}
          autoComplete="current-password"
          disabled={isLoading}
        />
        {errors.password && (
          <span className="form-error" role="alert">
            {errors.password}
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
        {isLoading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
