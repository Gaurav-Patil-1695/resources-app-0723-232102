import React, { useState } from 'react';
import packageIcon from '@/assets/icons/package.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import placeholderProduct from '@/assets/images/placeholder-product.svg';

/**
 * OrderSummaryPanel
 * Props:
 *   items        {Array<{ id, name, image, quantity, price }>}
 *   subtotal     {number}
 *   discount     {number}
 *   shippingFee  {number}  0 for free shipping
 *   couponSaving {number}
 *   collapsible  {boolean} - show/hide items toggle
 */
const OrderSummaryPanel = ({
  items = [],
  subtotal = 0,
  discount = 0,
  shippingFee = 0,
  couponSaving = 0,
  collapsible = false,
}) => {
  const [expanded, setExpanded] = useState(true);

  const total = subtotal - discount - couponSaving + shippingFee;

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <aside className="order-summary">
      <div className="order-summary__header">
        <div className="order-summary__header-left">
          <img src={packageIcon} alt="" className="order-summary__header-icon" aria-hidden="true" />
          <h2 className="order-summary__title">Order Summary</h2>
          {items.length > 0 && (
            <span className="order-summary__item-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {collapsible && (
          <button
            type="button"
            className={`order-summary__toggle${expanded ? ' order-summary__toggle--open' : ''}`}
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide order items' : 'Show order items'}
          >
            <img src={chevronDownIcon} alt="" className="order-summary__chevron" aria-hidden="true" />
          </button>
        )}
      </div>

      {(!collapsible || expanded) && items.length > 0 && (
        <ul className="order-summary__items">
          {items.map((item) => (
            <li key={item.id} className="order-summary__item">
              <img
                src={item.image || placeholderProduct}
                alt={item.name}
                className="order-summary__item-img"
                onError={(e) => { e.currentTarget.src = placeholderProduct; }}
              />
              <div className="order-summary__item-details">
                <span className="order-summary__item-name">{item.name}</span>
                <span className="order-summary__item-qty">Qty: {item.quantity}</span>
              </div>
              <span className="order-summary__item-price">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="order-summary__totals">
        <div className="order-summary__row">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="order-summary__row order-summary__row--saving">
            <span>Product Discount</span>
            <span>− {formatPrice(discount)}</span>
          </div>
        )}
        {couponSaving > 0 && (
          <div className="order-summary__row order-summary__row--saving">
            <span>Coupon Saving</span>
            <span>− {formatPrice(couponSaving)}</span>
          </div>
        )}
        <div className="order-summary__row">
          <span>Shipping</span>
          <span className={shippingFee === 0 ? 'order-summary__free' : ''}>
            {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="order-summary__divider" />
        <div className="order-summary__row order-summary__row--total">
          <span>Total Payable</span>
          <span>{formatPrice(total)}</span>
        </div>
        {(discount > 0 || couponSaving > 0) && (
          <p className="order-summary__saving-note">
            You save {formatPrice(discount + couponSaving)} on this order!
          </p>
        )}
      </div>

      <style>{`
        .order-summary {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        .order-summary__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          background: #f9fafb;
        }
        .order-summary__header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .order-summary__header-icon {
          width: 18px;
          height: 18px;
        }
        .order-summary__title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        .order-summary__item-count {
          font-size: 12px;
          color: #6b7280;
          background: #e5e7eb;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .order-summary__toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .order-summary__chevron {
          width: 18px;
          height: 18px;
          transition: transform 0.2s ease;
        }
        .order-summary__toggle--open .order-summary__chevron {
          transform: rotate(180deg);
        }
        .order-summary__items {
          list-style: none;
          margin: 0;
          padding: 8px 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        .order-summary__item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f9fafb;
        }
        .order-summary__item:last-child {
          border-bottom: none;
        }
        .order-summary__item-img {
          width: 48px;
          height: 48px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e5e7eb;
          flex-shrink: 0;
        }
        .order-summary__item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .order-summary__item-name {
          font-size: 13px;
          font-weight: 500;
          color: #111827;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .order-summary__item-qty {
          font-size: 12px;
          color: #6b7280;
        }
        .order-summary__item-price {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
          white-space: nowrap;
        }
        .order-summary__totals {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .order-summary__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #374151;
        }
        .order-summary__row--saving {
          color: #16a34a;
          font-size: 13px;
        }
        .order-summary__row--total {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
        }
        .order-summary__free {
          color: #16a34a;
          font-weight: 600;
        }
        .order-summary__divider {
          border: none;
          border-top: 1px dashed #e5e7eb;
          margin: 4px 0;
        }
        .order-summary__saving-note {
          font-size: 12px;
          color: #16a34a;
          font-weight: 500;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 6px;
          padding: 8px 12px;
          margin: 0;
          text-align: center;
        }
      `}</style>
    </aside>
  );
};

export default OrderSummaryPanel;
