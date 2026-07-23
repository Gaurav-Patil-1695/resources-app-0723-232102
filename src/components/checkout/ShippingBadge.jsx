import React from 'react';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 49;

/**
 * ShippingBadge
 * Props:
 *   cartTotal   {number} - current cart value in INR
 *   showProgress {boolean} - show how much more to spend for free shipping
 *   className   {string}
 */
const ShippingBadge = ({ cartTotal = 0, showProgress = true, className = '' }) => {
  const isFree = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const remaining = FREE_SHIPPING_THRESHOLD - cartTotal;
  const progressPercent = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className={`shipping-badge ${isFree ? 'shipping-badge--free' : 'shipping-badge--paid'} ${className}`.trim()}>
      <div className="shipping-badge__row">
        <span className="shipping-badge__icon" aria-hidden="true">
          {isFree ? '🚚' : '📦'}
        </span>
        <div className="shipping-badge__content">
          {isFree ? (
            <span className="shipping-badge__text shipping-badge__text--free">
              You qualify for <strong>FREE delivery!</strong>
            </span>
          ) : (
            <span className="shipping-badge__text shipping-badge__text--paid">
              Add <strong>{formatPrice(remaining)}</strong> more for free delivery
              <span className="shipping-badge__fee"> (currently {formatPrice(SHIPPING_FEE)} shipping)</span>
            </span>
          )}
        </div>
      </div>

      {showProgress && !isFree && (
        <div className="shipping-badge__progress-wrap" role="progressbar" aria-valuenow={Math.round(progressPercent)} aria-valuemin={0} aria-valuemax={100} aria-label="Free shipping progress">
          <div
            className="shipping-badge__progress-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <style>{`
        .shipping-badge {
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          line-height: 1.4;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .shipping-badge--free {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }
        .shipping-badge--paid {
          background: #fffbeb;
          border: 1px solid #fde68a;
        }
        .shipping-badge__row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .shipping-badge__icon {
          font-size: 18px;
          flex-shrink: 0;
          line-height: 1;
        }
        .shipping-badge__content {
          flex: 1;
        }
        .shipping-badge__text {
          display: block;
        }
        .shipping-badge__text--free {
          color: #15803d;
        }
        .shipping-badge__text--paid {
          color: #92400e;
        }
        .shipping-badge__fee {
          color: #a16207;
          font-size: 12px;
        }
        .shipping-badge__progress-wrap {
          height: 5px;
          background: #fde68a;
          border-radius: 99px;
          overflow: hidden;
        }
        .shipping-badge__progress-bar {
          height: 100%;
          background: #16a34a;
          border-radius: 99px;
          transition: width 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ShippingBadge;
