import { useState } from 'react';

const RegisterForm = ({ onSubmit, isLoading = false, error = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
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
      const { confirmPassword, ...payload } = formData;
      onSubmit(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form register-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="register-firstName" className="form-label">
            First Name
          </label>
          <input
            id="register-firstName"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First name"
            className={`form-input${errors.firstName ? ' form-input--error' : ''}`}
            autoComplete="given-name"
            disabled={isLoading}
          />
          {errors.firstName && (
            <span className="form-error" role="alert">
              {errors.firstName}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="register-lastName" className="form-label">
            Last Name
          </label>
          <input
            id="register-lastName"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            className={`form-input${errors.lastName ? ' form-input--error' : ''}`}
            autoComplete="family-name"
            disabled={isLoading}
          />
          {errors.lastName && (
            <span className="form-error" role="alert">
              {errors.lastName}
            </span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="register-email" className="form-label">
          Email
        </label>
        <input
          id="register-email"
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
        <label htmlFor="register-password" className="form-label">
          Password
        </label>
        <input
          id="register-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          className={`form-input${errors.password ? ' form-input--error' : ''}`}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.password && (
          <span className="form-error" role="alert">
            {errors.password}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="register-confirmPassword" className="form-label">
          Confirm Password
        </label>
        <input
          id="register-confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          className={`form-input${errors.confirmPassword ? ' form-input--error' : ''}`}
          autoComplete="new-password"
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <span className="form-error" role="alert">
            {errors.confirmPassword}
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
        {isLoading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;
