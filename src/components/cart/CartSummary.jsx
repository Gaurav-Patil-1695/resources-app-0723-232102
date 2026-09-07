import React from 'react';

const CartSummary = ({
  subtotal = 0,
  shippingCharge = 0,
  discount = 0,
  gstRate = 0,
  onCheckout,
}) => {
  const gstAmount = ((subtotal - discount) * gstRate) / 100;
  const grandTotal = subtotal - discount + shippingCharge + gstAmount;

  const formatCurrency = (amount) =>
    `₹${Number(amount).toFixed(2)}`;

  return (
    <div className="cart-summary">
      <h2 className="cart-summary__title">Order Summary</h2>

      <ul className="cart-summary__line-items">
        <li className="cart-summary__line-item">
          <span className="cart-summary__label">Subtotal</span>
          <span className="cart-summary__value">{formatCurrency(subtotal)}</span>
        </li>

        {discount > 0 && (
          <li className="cart-summary__line-item cart-summary__line-item--discount">
            <span className="cart-summary__label">Discount</span>
            <span className="cart-summary__value cart-summary__value--discount">
              &minus;{formatCurrency(discount)}
            </span>
          </li>
        )}

        <li className="cart-summary__line-item">
          <span className="cart-summary__label">Shipping</span>
          <span className="cart-summary__value">
            {shippingCharge === 0 ? 'Free' : formatCurrency(shippingCharge)}
          </span>
        </li>

        {gstRate > 0 && (
          <li className="cart-summary__line-item">
            <span className="cart-summary__label">GST ({gstRate}%)</span>
            <span className="cart-summary__value">{formatCurrency(gstAmount)}</span>
          </li>
        )}
      </ul>

      <div className="cart-summary__divider" />

      <div className="cart-summary__grand-total">
        <span className="cart-summary__grand-total-label">Grand Total</span>
        <span className="cart-summary__grand-total-value">{formatCurrency(grandTotal)}</span>
      </div>

      {shippingCharge === 0 && (
        <p className="cart-summary__free-shipping-note">🎉 You qualify for free shipping!</p>
      )}

      <button
        type="button"
        className="cart-summary__checkout-btn"
        onClick={onCheckout}
        disabled={subtotal <= 0}
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
