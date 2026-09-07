import React, { useState } from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import checkIcon from '@/assets/icons/check.svg';

function ReturnItemRow({ item, checked, onChange }) {
  const { id, name, image_url, quantity, unit_price, variant_label } = item;

  const displayPrice =
    typeof unit_price === 'number' ? `$${unit_price.toFixed(2)}` : unit_price;

  return (
    <label
      htmlFor={`return-item-${id}`}
      className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
        checked
          ? 'border-blue-400 bg-blue-50'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      {/* Custom checkbox */}
      <div className="flex-shrink-0">
        <input
          id={`return-item-${id}`}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(id, e.target.checked)}
          className="sr-only"
          aria-label={`Select ${name} for return`}
        />
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            checked ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
          }`}
          aria-hidden="true"
        >
          {checked && (
            <img src={checkIcon} alt="" className="w-3 h-3 invert" aria-hidden="true" />
          )}
        </div>
      </div>

      {/* Product image */}
      <img
        src={image_url || placeholderProduct}
        alt={name}
        className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
        onError={(e) => {
          e.currentTarget.src = placeholderProduct;
        }}
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        {variant_label && (
          <p className="text-xs text-gray-500 mt-0.5">{variant_label}</p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          Qty: {quantity} &middot; {displayPrice} each
        </p>
      </div>
    </label>
  );
}

function ReturnItemSelector({ items, selectedIds, onChange, onSubmit, submitting }) {
  const [internalSelected, setInternalSelected] = useState(
    selectedIds ? new Set(selectedIds) : new Set()
  );

  const isControlled = onChange !== undefined;
  const selected = isControlled ? new Set(selectedIds || []) : internalSelected;

  function handleChange(itemId, checked) {
    if (isControlled) {
      const next = new Set(selected);
      if (checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      onChange(Array.from(next));
    } else {
      setInternalSelected((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(itemId);
        } else {
          next.delete(itemId);
        }
        return next;
      });
    }
  }

  function handleSelectAll() {
    const allIds = (items || []).map((item) => item.id);
    if (isControlled) {
      onChange(allIds);
    } else {
      setInternalSelected(new Set(allIds));
    }
  }

  function handleDeselectAll() {
    if (isControlled) {
      onChange([]);
    } else {
      setInternalSelected(new Set());
    }
  }

  const eligibleItems = items || [];
  const allSelected =
    eligibleItems.length > 0 && eligibleItems.every((item) => selected.has(item.id));
  const noneSelected = selected.size === 0;

  function handleSubmit() {
    if (onSubmit) {
      onSubmit(Array.from(selected));
    }
  }

  if (eligibleItems.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4">
        No eligible items available for return.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selected.size} of {eligibleItems.length} item{eligibleItems.length !== 1 ? 's' : ''} selected
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={allSelected}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-default transition-colors"
          >
            Select all
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={noneSelected}
            className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-default transition-colors"
          >
            Deselect all
          </button>
        </div>
      </div>

      {/* Item list */}
      <div className="space-y-2">
        {eligibleItems.map((item) => (
          <ReturnItemRow
            key={item.id}
            item={item}
            checked={selected.has(item.id)}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* Submit */}
      {onSubmit && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={noneSelected || submitting}
            className="w-full py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting && (
              <svg
                className="animate-spin w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {submitting ? 'Submitting Return…' : 'Submit Return Request'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ReturnItemSelector;
