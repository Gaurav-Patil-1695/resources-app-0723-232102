import React, { useState } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

/**
 * BrandForm - Create / edit a brand
 * Props:
 *   initialData {object}    - existing brand for edit mode (optional)
 *   onSubmit    {function}  - async (formData) => void
 *   onCancel    {function}
 */
const BrandForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    logo_url: initialData?.logo_url || '',
    website: initialData?.website || '',
    description: initialData?.description || '',
    is_active: initialData?.is_active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name' && !initialData) {
        next.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Brand name is required.';
    if (!form.slug.trim()) errs.slug = 'Slug is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4" noValidate>
      <h2 className="text-lg font-semibold text-gray-800">
        {initialData ? 'Edit Brand' : 'New Brand'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleField('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => handleField('slug', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={form.logo_url}
            onChange={(e) => handleField('logo_url', e.target.value)}
            placeholder="https://…"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <img
            src={form.logo_url || placeholderProduct}
            alt="logo preview"
            className="w-12 h-12 rounded-lg object-contain border border-gray-200 bg-gray-50"
            onError={(e) => { e.target.src = placeholderProduct; }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
        <input
          type="url"
          value={form.website}
          onChange={(e) => handleField('website', e.target.value)}
          placeholder="https://brand.com"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => handleField('description', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => handleField('is_active', e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />
        Active
      </label>

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Brand'}
        </button>
      </div>
    </form>
  );
};

export default BrandForm;
