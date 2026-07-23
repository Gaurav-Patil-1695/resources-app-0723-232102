import React from 'react';
import { Link } from 'react-router-dom';
import '@/assets/icons/chevron-right.svg';

const STATUS_BADGE_STYLES = {
  confirmed: {
    label: 'Confirmed',
    className: 'bg-blue-100 text-blue-800',
  },
  packed: {
    label: 'Packed',
    className: 'bg-yellow-100 text-yellow-800',
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800',
  },
  return_requested: {
    label: 'Return Requested',
    className: 'bg-orange-100 text-orange-800',
  },
};

function StatusBadge({ status }) {
  const config = STATUS_BADGE_STYLES[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function OrderCard({ order }) {
  const {
    id,
    created_at,
    status,
    total_amount,
    items_count,
  } = order;

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTotal =
    typeof total_amount === 'number'
      ? `$${total_amount.toFixed(2)}`
      : total_amount;

  return (
    <Link
      to={`/orders/${id}`}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
      aria-label={`View order ${id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">Order #{id}</span>
            <StatusBadge status={status} />
          </div>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{formattedTotal}</p>
            {items_count !== undefined && (
              <p className="text-xs text-gray-500">
                {items_count} {items_count === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
          <img
            src="@/assets/icons/chevron-right.svg"
            alt=""
            className="w-4 h-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
}

export default OrderCard;
