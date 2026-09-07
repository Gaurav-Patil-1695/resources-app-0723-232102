import React, { useState } from 'react';
import plusIcon from '@/assets/icons/plus.svg';
import trashIcon from '@/assets/icons/trash.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

/**
 * ProductForm - Create / edit a product including SKU variant management
 * Props:
 *   initialData  {object}   - existing product data for edit mode (optional)
 *   categories   {array}    - [{id, name}]
 *   brands       {array}    - [{id, name}]
 *   onSubmit     {function} - async (formData) => void
 *   onCancel     {function}
 */

const emptyVariant = () => ({
  id: crypto.randomUUID(),
  sku: '',
  size: '',
  color: '',
  price: '',
  stock: '',
});

const ProductForm = ({ initialData, categories = [], brands = [], onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category_id: initialData?.category_id || '',
    brand_id: initialData?.brand_id || '',
    base_price: initialData?.base_price || '',
    image_url: initialData?.image_url || '',
    is_active: initialData?.is_active ?? true,
  });

  const [variants, setVariants] = useState(
    initialData?.variants?.length
      ? initialData.variants.map((v) => ({ ...v, id: v.id || crypto.randomUUID() }))
      : [emptyVariant()]
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleVariantField = (id, key, value) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [key]: value } : v))
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);

  const removeVariant = (id) =>
    setVariants((prev) => prev.filter((v) => v.id !== id));

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product name is required.';
    if (!form.base_price || isNaN(Number(form.base_price))) errs.base_price = 'Valid base price is required.';
    if (!form.category_id) errs.category_id = 'Category is required.';
    variants.forEach((v, i) => {
      if (!v.sku.trim()) errs[`variant_sku_${i}`] = 'SKU is required.';
      if (!v.price || isNaN(Number(v.price))) errs[`variant_price_${i}`] = 'Valid price is required.';
    });
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
      await onSubmit({ ...form, variants });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Basic Info */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleField('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.base_price}
              onChange={(e) => handleField('base_price', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.base_price && <p className="text-xs text-red-600 mt-1">{errors.base_price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={form.category_id}
              onChange={(e) => handleField('category_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-600 mt-1">{errors.category_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <select
              value={form.brand_id}
              onChange={(e) => handleField('brand_id', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select brand…</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => handleField('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={form.image_url}
              onChange={(e) => handleField('image_url', e.target.value)}
              placeholder="https://…"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <img
              src={form.image_url || placeholderProduct}
              alt="preview"
              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
              onError={(e) => { e.target.src = placeholderProduct; }}
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
          Active (visible to customers)
        </label>
      </section>

      {/* SKU Variants */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">SKU Variants</h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            <img src={plusIcon} alt="" className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        {variants.map((variant, i) => (
          <div
            key={variant.id}
            className="border border-gray-200 rounded-xl p-4 space-y-3 relative"
          >
            <button
              type="button"
              onClick={() => removeVariant(variant.id)}
              disabled={variants.length === 1}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 disabled:opacity-30"
              aria-label="Remove variant"
            >
              <img src={trashIcon} alt="Remove" className="w-4 h-4" />
            </button>

            <p className="text-xs font-semibold text-gray-500 uppercase">Variant {i + 1}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
                <input
                  type="text"
                  value={variant.sku}
                  onChange={(e) => handleVariantField(variant.id, 'sku', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[`variant_sku_${i}`] && (
                  <p className="text-xs text-red-600 mt-1">{errors[`variant_sku_${i}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => handleVariantField(variant.id, 'size', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => handleVariantField(variant.id, 'color', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={variant.price}
                  onChange={(e) => handleVariantField(variant.id, 'price', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[`variant_price_${i}`] && (
                  <p className="text-xs text-red-600 mt-1">{errors[`variant_price_${i}`]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={variant.stock}
                  onChange={(e) => handleVariantField(variant.id, 'stock', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
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
          {loading ? 'Saving…' : initialData ? 'Save Changes' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
