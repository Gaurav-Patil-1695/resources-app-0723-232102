import React from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

function OrderItemRow({ item }) {
  const {
    id: _id,
    name,
    image_url,
    quantity,
    unit_price,
    subtotal,
    variant_label,
  } = item;

  const displayPrice =
    typeof unit_price === 'number' ? `$${unit_price.toFixed(2)}` : unit_price;
  const displaySubtotal =
    typeof subtotal === 'number'
      ? `$${subtotal.toFixed(2)}`
      : typeof unit_price === 'number' && typeof quantity === 'number'
      ? `$${(unit_price * quantity).toFixed(2)}`
      : '—';

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={image_url || placeholderProduct}
            alt={name}
            className="w-12 h-12 object-cover rounded-md border border-gray-200 flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = placeholderProduct;
            }}
          />
          <div>
            <p className="text-sm font-medium text-gray-900">{name}</p>
            {variant_label && (
              <p className="text-xs text-gray-500 mt-0.5">{variant_label}</p>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm text-gray-700 text-center">{quantity}</td>
      <td className="py-3 px-4 text-sm text-gray-700 text-right">{displayPrice}</td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
        {displaySubtotal}
      </td>
    </tr>
  );
}

function OrderItemsList({ items, total_amount }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 text-sm">
        No items found for this order.
      </div>
    );
  }

  const formattedTotal =
    typeof total_amount === 'number' ? `$${total_amount.toFixed(2)}` : total_amount;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full min-w-[480px]" aria-label="Order items">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Item
            </th>
            <th
              scope="col"
              className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Qty
            </th>
            <th
              scope="col"
              className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Unit Price
            </th>
            <th
              scope="col"
              className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {items.map((item) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </tbody>
        {formattedTotal && (
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td colSpan={3} className="py-3 px-4 text-sm font-semibold text-gray-700 text-right">
                Total
              </td>
              <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                {formattedTotal}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default OrderItemsList;
