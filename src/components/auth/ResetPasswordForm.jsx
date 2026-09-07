import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ResetPasswordForm = ({ onSubmit, isLoading = false, error = null, success = false }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!token) {
      newErrors.token = 'Reset token is missing or invalid. Please request a new password reset link.';
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
      onSubmit({ token, password: formData.password });
    }
  };

  if (success) {
    return (
      <div className="auth-form reset-password-form">
        <div className="form-alert form-alert--success" role="status">
          Your password has been reset successfully. You can now sign in with your new password.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form reset-password-form">
      {errors.token && (
        <div className="form-alert form-alert--error" role="alert">
          {errors.token}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="reset-password" className="form-label">
          New Password
        </label>
        <input
          id="reset-password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your new password"
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
        <label htmlFor="reset-confirmPassword" className="form-label">
          Confirm New Password
        </label>
        <input
          id="reset-confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
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
        disabled={isLoading || !token}
      >
        {isLoading ? 'Resetting…' : 'Reset Password'}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
