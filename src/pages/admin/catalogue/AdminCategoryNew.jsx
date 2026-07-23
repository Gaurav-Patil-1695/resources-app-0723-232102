import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';

const styles = {
  page: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '32px',
    color: '#212529',
  },
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#4c6ef5',
    textDecoration: 'none',
    fontSize: '14px',
    marginBottom: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: '32px',
    margin: '0 0 24px',
  },
  errorBanner: {
    backgroundColor: '#ffe3e3',
    color: '#f03e3e',
    padding: '12px 16px',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '14px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '24px',
    maxWidth: '640px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#495057',
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    minHeight: '44px',
  },
  inputError: {
    borderColor: '#f03e3e',
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    resize: 'vertical',
    minHeight: '80px',
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #868e96',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    color: '#212529',
    backgroundColor: '#ffffff',
    outline: 'none',
    minHeight: '44px',
    cursor: 'pointer',
  },
  fieldError: {
    fontSize: '12px',
    color: '#f03e3e',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  btnPrimary: {
    backgroundColor: '#4c6ef5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    color: '#343a40',
    border: '1px solid #868e96',
    borderRadius: '10px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    minHeight: '44px',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
};

const MOCK_PARENT_CATEGORIES = [
  { id: 1, name: 'Apparel' },
  { id: 2, name: 'Accessories' },
  { id: 3, name: 'Footwear' },
];

export default function AdminCategoryNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', slug: '', description: '', parentId: '', active: true });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    setTimeout(() => setParents(MOCK_PARENT_CATEGORIES), 500);
  }, []);

  const slugify = (val) => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setForm(prev => {
      const updated = { ...prev, [name]: newVal };
      if (name === 'name' && !prev.slug) updated.slug = slugify(value);
      return updated;
    });
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Category name is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitError('Category could not be saved.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/admin/catalogue/categories', { state: { successToast: 'Category created successfully.' } });
    }, 600);
  };

  return (
    <div style={styles.page}>
      <Link to="/admin/catalogue/categories" style={styles.backLink}>
        <img src={chevronLeftIcon} alt="" width={14} height={14} />
        Back to Categories
      </Link>

      <h1 style={styles.title}>New Category</h1>

      {submitError && (
        <div style={styles.errorBanner} role="alert">
          <strong>{submitError}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={styles.card}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Category Name *</label>
            <input
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              id="name" name="name" value={form.name}
              onChange={handleChange} placeholder="e.g. Apparel"
            />
            {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="slug">Slug</label>
            <input
              style={styles.input}
              id="slug" name="slug" value={form.slug}
              onChange={handleChange} placeholder="auto-generated"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="description">Description</label>
            <textarea
              style={styles.textarea}
              id="description" name="description" value={form.description}
              onChange={handleChange} placeholder="Optional description…"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="parentId">Parent Category</label>
            <select style={styles.select} id="parentId" name="parentId" value={form.parentId} onChange={handleChange}>
              <option value="">None (top-level)</option>
              {parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="active">
              <input
                type="checkbox" id="active" name="active"
                checked={form.active} onChange={handleChange}
                style={{ marginRight: '8px' }}
              />
              Active
            </label>
          </div>
        </div>

        <div style={styles.actions}>
          <Link to="/admin/catalogue/categories" style={styles.btnSecondary}>Cancel</Link>
          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Saving…' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
}
