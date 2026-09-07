import React, { useState } from 'react';

/**
 * PromoCodeForm - Create / edit a promo code
 * Props:
 *   initialData {object}    - existing promo code for edit mode (optional)
 *   onSubmit    {function}  - async (formData) => void
 *   onCancel    {function}
 */
const PROMO_TYPES = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'flat', label: 'Flat Amount ($)' },
];

const PromoCodeForm = ({ initialData, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    code: initialData?.code || '',
    type: initialData?.type || 'percentage',
    value: initialData?.value || '',
    min_order_amount: initialData?.min_order_amount || '',
    max_uses: initialData?.max_uses || '',
    expiry_date: initialData?.expiry_date
      ? initialData.expiry_date.split('T')[0]
      : '',
    is_active: initialData?.is_active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.code.trim()) errs.code = 'Promo code is required.';
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) {
      errs.value = 'A valid discount value is required.';
    }
    if (form.type === 'percentage' && Number(form.value) > 100) {
      errs.value = 'Percentage value cannot exceed 100.';
    }
    if (!form.expiry_date) errs.expiry_date = 'Expiry date is required.';
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
      await onSubmit({
        ...form,
        value: Number(form.value),
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : null,
        max_uses: form.max_uses ? Number(form.max_uses) : null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4" noValidate>
      <h2 className="text-lg font-semibold text-gray-800">
        {initialData ? 'Edit Promo Code' : 'New Promo Code'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
          <input
            type="text"
            value={form.code}
            onChange={(e) => handleField('code', e.target.value.toUpperCase())}
            placeholder="e.g. SUMMER20"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.code && <p className="text-xs text-red-600 mt-1">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
          <select
            value={form.type}
            onChange={(e) => handleField('type', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PROMO_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {form.type === 'percentage' ? 'Discount Percentage *' : 'Flat Discount Amount *'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {form.type === 'percentage' ? '%' : '$'}
            </span>
            <input
              type="number"
              min="0"
              max={form.type === 'percentage' ? 100 : undefined}
              step="0.01"
              value={form.value}
              onChange={(e) => handleField('value', e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {errors.value && <p className="text-xs text-red-600 mt-1">{errors.value}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
          <input
            type="date"
            value={form.expiry_date}
            onChange={(e) => handleField('expiry_date', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.expiry_date && <p className="text-xs text-red-600 mt-1">{errors.expiry_date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.min_order_amount}
            onChange={(e) => handleField('min_order_amount', e.target.value)}
            placeholder="No minimum"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
          <input
            type="number"
            min="1"
            step="1"
            value={form.max_uses}
            onChange={(e) => handleField('max_uses', e.target.value)}
            placeholder="Unlimited"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
          {loading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Promo Code'}
        </button>
      </div>
    </form>
  );
};

export default PromoCodeForm;
