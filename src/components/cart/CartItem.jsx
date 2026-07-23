import React from 'react';
import placeholderProduct from '@/assets/images/placeholder-product.svg';
import trashIcon from '@/assets/icons/trash.svg';
import plusIcon from '@/assets/icons/plus.svg';
import minusIcon from '@/assets/icons/minus.svg';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const {
    id,
    image,
    name,
    sku,
    variant,
    quantity,
    price,
    originalPrice,
  } = item;

  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(id, quantity + 1);
  };

  const handleRemove = () => {
    onRemove(id);
  };

  const lineTotal = (price * quantity).toFixed(2);

  return (
    <div className="cart-item">
      <div className="cart-item__image-wrapper">
        <img
          src={image || placeholderProduct}
          alt={name}
          className="cart-item__image"
          onError={(e) => { e.currentTarget.src = placeholderProduct; }}
        />
      </div>

      <div className="cart-item__details">
        <div className="cart-item__header">
          <div className="cart-item__info">
            <h3 className="cart-item__name">{name}</h3>
            {sku && (
              <p className="cart-item__sku">SKU: {sku}</p>
            )}
            {variant && (
              <p className="cart-item__variant">{variant}</p>
            )}
          </div>
          <button
            type="button"
            className="cart-item__remove"
            onClick={handleRemove}
            aria-label={`Remove ${name} from cart`}
          >
            <img src={trashIcon} alt="Remove" className="cart-item__remove-icon" />
          </button>
        </div>

        <div className="cart-item__footer">
          <div className="cart-item__pricing">
            <span className="cart-item__price">₹{price.toFixed(2)}</span>
            {originalPrice && originalPrice > price && (
              <span className="cart-item__original-price">₹{originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="cart-item__qty-stepper">
            <button
              type="button"
              className="cart-item__qty-btn cart-item__qty-btn--decrease"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <img src={minusIcon} alt="Decrease" />
            </button>
            <span className="cart-item__qty-value" aria-label="Quantity">{quantity}</span>
            <button
              type="button"
              className="cart-item__qty-btn cart-item__qty-btn--increase"
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              <img src={plusIcon} alt="Increase" />
            </button>
          </div>

          <div className="cart-item__line-total">
            <span className="cart-item__line-total-label">Total:</span>
            <span className="cart-item__line-total-value">₹{lineTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
