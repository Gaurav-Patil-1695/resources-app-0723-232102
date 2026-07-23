import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';

const MOCK_PROMOTIONS = {
  1: {
    id: 1,
    code: 'SAVE10',
    type: 'percentage',
    discount: 10,
    expiry: '2025-12-31',
    active: true,
  },
  2: {
    id: 2,
    code: 'FLAT20',
    type: 'fixed',
    discount: 20,
    expiry: '2025-06-30',
    active: true,
  },
  3: {
    id: 3,
    code: 'SUMMER15',
    type: 'percentage',
    discount: 15,
    expiry: '2024-08-31',
    active: false,
  },
};

export default function AdminPromotionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    // Simulate fetch by id
    setTimeout(() => {
      const promo = MOCK_PROMOTIONS[Number(id)];
      if (!promo) {
        setNotFound(true);
      } else {
        setForm({
          code: promo.code,
          type: promo.type,
          discount: String(promo.discount),
          expiry: promo.expiry,
          active: promo.active,
        });
      }
      setLoading(false);
    }, 300);
  }, [id]);

  function validate(data) {
    const errs = {};
    if (!data.code.trim()) {
      errs.code = 'Promo code is required.';
    } else if (!/^[A-Z0-9_-]{3,20}$/.test(data.code.trim())) {
      errs.code = 'Code must be 3–20 uppercase letters, numbers, hyphens, or underscores.';
    }
    if (!data.type) {
      errs.type = 'Discount type is required.';
    }
    if (data.discount === '' || data.discount === null) {
      errs.discount = 'Discount value is required.';
    } else {
      const val = Number(data.discount);
      if (isNaN(val) || val <= 0) {
        errs.discount = 'Discount must be a positive number.';
      } else if (data.type === 'percentage' && val > 100) {
        errs.discount = 'Percentage discount cannot exceed 100.';
      }
    }
    if (!data.expiry) {
      errs.expiry = 'Expiry date is required.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSuccessMessage('Promo code updated successfully!');
      setTimeout(() => navigate('/admin/promotions'), 1000);
    } catch {
      setErrors({ submit: 'Failed to update promo code. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading promo code...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={styles.container}>
        <div style={styles.breadcrumb}>
          <Link to="/admin/promotions" style={styles.backLink}>
            <img src={chevronLeftIcon} alt="" style={styles.backIcon} />
            Back to Promo Codes
          </Link>
        </div>
        <div style={styles.notFound}>
          <p style={styles.notFoundText}>Promo code not found.</p>
          <Link to="/admin/promotions" style={styles.notFoundLink}>
            Return to list
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.breadcrumb}>
        <Link to="/admin/promotions" style={styles.backLink}>
          <img src={chevronLeftIcon} alt="" style={styles.backIcon} />
          Back to Promo Codes
        </Link>
      </div>

      <h1 style={styles.title}>Edit Promo Code</h1>

      {successMessage && (
        <div style={styles.successBanner}>{successMessage}</div>
      )}

      {errors.submit && (
        <div style={styles.errorBanner}>{errors.submit}</div>
      )}

      <div style={styles.card}>
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="code">
              Promo Code <span style={styles.required}>*</span>
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={form.code}
              onChange={handleChange}
              placeholder="e.g. SUMMER20"
              style={{
                ...styles.input,
                borderColor: errors.code ? '#dc2626' : '#d1d5db',
              }}
              autoComplete="off"
            />
            {errors.code && <p style={styles.fieldError}>{errors.code}</p>}
            <p style={styles.hint}>Use uppercase letters, numbers, hyphens, or underscores (3–20 characters).</p>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label} htmlFor="type">
                Discount Type <span style={styles.required}>*</span>
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  borderColor: errors.type ? '#dc2626' : '#d1d5db',
                }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
              {errors.type && <p style={styles.fieldError}>{errors.type}</p>}
            </div>

            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label} htmlFor="discount">
                Discount Value <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputPrefix}>
                  {form.type === 'percentage' ? '%' : '$'}
                </span>
                <input
                  id="discount"
                  name="discount"
                  type="number"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder={form.type === 'percentage' ? '0–100' : '0.00'}
                  min="0"
                  max={form.type === 'percentage' ? 100 : undefined}
                  step={form.type === 'fixed' ? '0.01' : '1'}
                  style={{
                    ...styles.input,
                    borderColor: errors.discount ? '#dc2626' : '#d1d5db',
                    paddingLeft: '36px',
                  }}
                />
              </div>
              {errors.discount && <p style={styles.fieldError}>{errors.discount}</p>}
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="expiry">
              Expiry Date <span style={styles.required}>*</span>
            </label>
            <input
              id="expiry"
              name="expiry"
              type="date"
              value={form.expiry}
              onChange={handleChange}
              style={{
                ...styles.input,
                borderColor: errors.expiry ? '#dc2626' : '#d1d5db',
              }}
            />
            {errors.expiry && <p style={styles.fieldError}>{errors.expiry}</p>}
          </div>

          <div style={styles.checkboxGroup}>
            <input
              id="active"
              name="active"
              type="checkbox"
              checked={form.active}
              onChange={handleChange}
              style={styles.checkbox}
            />
            <label htmlFor="active" style={styles.checkboxLabel}>
              Active
            </label>
          </div>

          <div style={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/admin/promotions')}
              style={styles.cancelButton}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '680px',
    margin: '0 auto',
    fontFamily: 'Inter, sans-serif',
  },
  breadcrumb: {
    marginBottom: '16px',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
  },
  backIcon: {
    width: '16px',
    height: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '24px',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  notFound: {
    textAlign: 'center',
    padding: '64px 0',
  },
  notFoundText: {
    color: '#6b7280',
    fontSize: '16px',
    marginBottom: '12px',
  },
  notFoundLink: {
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600',
    textDecoration: 'none',
  },
  successBanner: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  fieldGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    gap: '16px',
    marginBottom: '0',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  required: {
    color: '#dc2626',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputPrefix: {
    position: 'absolute',
    left: '12px',
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '600',
    pointerEvents: 'none',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  fieldError: {
    fontSize: '12px',
    color: '#dc2626',
    marginTop: '4px',
    fontWeight: '500',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#2563eb',
  },
  checkboxLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '10px 20px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  submitButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
};
