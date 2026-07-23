import React, { useState } from 'react';

/**
 * OrderStatusAdvancer
 * Props:
 *   orderId       {string|number}
 *   currentStatus {string}
 *   allowedRoles  {string[]}  - roles permitted to advance status
 *   userRole      {string}    - current user's role
 *   onAdvance     {function}  - async (orderId, newStatus) => void
 */

const STATUS_FLOW = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const OrderStatusAdvancer = ({
  orderId,
  currentStatus,
  allowedRoles = ['admin', 'manager'],
  userRole,
  onAdvance,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isAuthorized = allowedRoles.includes(userRole);

  const availableStatuses = STATUS_FLOW.filter((s) => s !== currentStatus);

  const handleAdvance = async () => {
    if (selectedStatus === currentStatus) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await onAdvance(orderId, selectedStatus);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || 'Failed to update order status.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-gray-100 text-gray-500 text-sm">
        <img src="/src/assets/icons/package.svg" alt="" className="w-4 h-4" />
        <span>Status: <strong>{STATUS_LABELS[currentStatus] || currentStatus}</strong></span>
        <span className="text-xs">(read-only)</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-medium">
          Current: <strong>{STATUS_LABELS[currentStatus] || currentStatus}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setSuccess(false);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value={currentStatus}>{STATUS_LABELS[currentStatus] || currentStatus} (current)</option>
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status] || status}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdvance}
          disabled={loading || selectedStatus === currentStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Updating…' : 'Update Status'}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-600">Status updated successfully.</p>
      )}
    </div>
  );
};

export default OrderStatusAdvancer;
