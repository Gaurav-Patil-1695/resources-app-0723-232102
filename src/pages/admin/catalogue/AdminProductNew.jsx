import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';

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
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formGroupFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    gridColumn: '1 / -1',
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
    minHeight: '100px',
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
    marginTop: '2px',
  },
  retryLink: {
    color: '#4c6ef5',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
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
  skeletonInput: {
    height: '44px',
    backgroundColor: '#e9ecef',
    borderRadius: '6px',
  },
  addSkuBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    color: '#4c6ef5',
    border: '1px dashed #4c6ef5',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: '44px',
    marginTop: '12px',
  },
  skuRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '12px',
    alignItems: 'end',
    marginBottom: '12px',
  },
  trashBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

const MOCK_CATEGORIES = [
  { id: 1, name: 'Apparel' },
  { id: 2, name: 'Accessories' },
  { id: 3, name: 'Footwear' },
];

const MOCK_BRANDS = [
  { id: 1, name: 'CoreWear' },
  { id: 2, name: 'SpeedFit' },
  { id: 3, name: 'NovaCraft' },
];

const INITIAL_SKU = { sku: '', size: '', colour: '', stock: '', price: '' };

export default function AdminProductNew() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', slug: '', description: '', categoryId: '', brandId: '',
    basePrice: '', taxRate: '', active: true,
  });
  const [skus, setSkus] = useState([{ ...INITIAL_SKU }]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refLoading, setRefLoading] = useState(true);
  const [refError, setRefError] = useState(null);

  const loadRefData = () => {
    setRefLoading(true);
    setRefError(null);
    setTimeout(() => {
      setCategories(MOCK_CATEGORIES);
      setBrands(MOCK_BRANDS);
      setRefLoading(false);
    }, 700);
  };

  useEffect(() => { loadRefData(); }, []);

  const slugify = (val) => val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setForm(prev => {
      const updated = { ...prev, [name]: newVal };
      if (name === 'name' && !prev.slug) {
        updated.slug = slugify(value);
      }
      return updated;
    });
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSkuChange = (idx, field, value) => {
    setSkus(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const addSku = () => setSkus(prev => [...prev, { ...INITIAL_SKU }]);

  const removeSku = (idx) => setSkus(prev => prev.filter((_, i) => i !== idx));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    if (!form.basePrice) errs.basePrice = 'Base price is required.';
    if (!form.taxRate && form.taxRate !== 0) errs.taxRate = 'Tax rate is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSubmitError('Product could not be saved.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    setTimeout(() => {
      setSubmitting(false);
      navigate('/admin/catalogue/products/1/edit', { state: { successToast: 'Product created successfully.' } });
    }, 800);
  };

  return (
    <div style={styles.page}>
      <Link to="/admin/catalogue/products" style={styles.backLink}>
        <img src={chevronLeftIcon} alt="" width={14} height={14} />
        Back to Products
      </Link>

      <h1 style={styles.title}>New Product</h1>

      {submitError && (
        <div style={styles.errorBanner} role="alert">
          <strong>{submitError}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Basic Information</h2>
          <div style={styles.formGrid}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="name">Product Name *</label>
              <input
                style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                id="name" name="name" value={form.name}
                onChange={handleChange} placeholder="e.g. Classic White Tee"
              />
              {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="slug">Slug</label>
              <input
                style={styles.input}
                id="slug" name="slug" value={form.slug}
                onChange={handleChange} placeholder="auto-generated from name"
              />
            </div>

            <div style={styles.formGroupFull}>
              <label style={styles.label} htmlFor="description">Description</label>
              <textarea
                style={styles.textarea}
                id="description" name="description" value={form.description}
                onChange={handleChange} placeholder="Product description…"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="categoryId">Category</label>
              {refLoading ? (
                <div style={styles.skeletonInput} />
              ) : refError ? (
                <span style={styles.fieldError}>
                  Could not load options —{' '}
                  <span style={styles.retryLink} onClick={loadRefData} role="button" tabIndex={0}>retry</span>
                </span>
              ) : (
                <select style={styles.select} id="categoryId" name="categoryId" value={form.categoryId} onChange={handleChange}>
                  <option value="">Select category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="brandId">Brand</label>
              {refLoading ? (
                <div style={styles.skeletonInput} />
              ) : refError ? (
                <span style={styles.fieldError}>
                  Could not load options —{' '}
                  <span style={styles.retryLink} onClick={loadRefData} role="button" tabIndex={0}>retry</span>
                </span>
              ) : (
                <select style={styles.select} id="brandId" name="brandId" value={form.brandId} onChange={handleChange}>
                  <option value="">Select brand…</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="basePrice">Base Price (£) *</label>
              <input
                style={{ ...styles.input, ...(errors.basePrice ? styles.inputError : {}) }}
                id="basePrice" name="basePrice" type="number" min="0" step="0.01"
                value={form.basePrice} onChange={handleChange} placeholder="0.00"
              />
              {errors.basePrice && <span style={styles.fieldError}>{errors.basePrice}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="taxRate">Tax Rate (%) *</label>
              <input
                style={{ ...styles.input, ...(errors.taxRate ? styles.inputError : {}) }}
                id="taxRate" name="taxRate" type="number" min="0" step="0.01"
                value={form.taxRate} onChange={handleChange} placeholder="20"
              />
              {errors.taxRate && <span style={styles.fieldError}>{errors.taxRate}</span>}
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
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>SKUs / Variants</h2>
          {skus.map((sku, idx) => (
            <div key={idx} style={styles.skuRow}>
              <div style={styles.formGroup}>
                {idx === 0 && <label style={styles.label}>SKU Code</label>}
                <input
                  style={styles.input}
                  value={sku.sku}
                  onChange={e => handleSkuChange(idx, 'sku', e.target.value)}
                  placeholder="e.g. CWT-WHT-S"
                />
              </div>
              <div style={styles.formGroup}>
                {idx === 0 && <label style={styles.label}>Size</label>}
                <input
                  style={styles.input}
                  value={sku.size}
                  onChange={e => handleSkuChange(idx, 'size', e.target.value)}
                  placeholder="S / M / L…"
                />
              </div>
              <div style={styles.formGroup}>
                {idx === 0 && <label style={styles.label}>Colour</label>}
                <input
                  style={styles.input}
                  value={sku.colour}
                  onChange={e => handleSkuChange(idx, 'colour', e.target.value)}
                  placeholder="White"
                />
              </div>
              <div style={styles.formGroup}>
                {idx === 0 && <label style={styles.label}>Stock</label>}
                <input
                  style={styles.input}
                  type="number" min="0"
                  value={sku.stock}
                  onChange={e => handleSkuChange(idx, 'stock', e.target.value)}
                  placeholder="0"
                />
              </div>
              <button
                type="button"
                style={styles.trashBtn}
                onClick={() => removeSku(idx)}
                aria-label="Remove SKU"
                disabled={skus.length === 1}
              >
                <img src={trashIcon} alt="Remove" width={16} height={16} />
              </button>
            </div>
          ))}
          <button type="button" style={styles.addSkuBtn} onClick={addSku}>
            <img src={plusIcon} alt="" width={14} height={14} />
            Add SKU
          </button>
        </div>

        <div style={styles.actions}>
          <Link to="/admin/catalogue/products" style={styles.btnSecondary}>Cancel</Link>
          <button type="submit" style={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Saving…' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
