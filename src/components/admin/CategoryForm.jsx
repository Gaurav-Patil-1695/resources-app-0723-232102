import React, { useState } from 'react';

/**
 * CategoryForm - Create / edit a category with optional parent selector
 * Props:
 *   initialData {object}    - existing category for edit mode (optional)
 *   categories  {array}     - [{id, name}] for parent selector (excluding self)
 *   onSubmit    {function}  - async (formData) => void
 *   onCancel    {function}
 */
const CategoryForm = ({ initialData, categories = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    parent_id: initialData?.parent_id || '',
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
    if (!form.name.trim()) errs.name = 'Category name is required.';
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
      await onSubmit({ ...form, parent_id: form.parent_id || null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4" noValidate>
      <h2 className="text-lg font-semibold text-gray-800">
        {initialData ? 'Edit Category' : 'New Category'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
        <select
          value={form.parent_id}
          onChange={(e) => handleField('parent_id', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">None (top-level)</option>
          {categories
            .filter((c) => !initialData || c.id !== initialData.id)
            .map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
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
          {loading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Category'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
