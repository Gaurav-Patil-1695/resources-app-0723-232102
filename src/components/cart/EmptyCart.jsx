import React from 'react';
import { useNavigate } from 'react-router-dom';
import emptyStateImage from '@/assets/images/empty-state.svg';

const EmptyCart = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <div className="empty-cart">
      <div className="empty-cart__illustration">
        <img
          src={emptyStateImage}
          alt="Your cart is empty"
          className="empty-cart__image"
        />
      </div>

      <div className="empty-cart__content">
        <h2 className="empty-cart__title">Your cart is empty</h2>
        <p className="empty-cart__description">
          Looks like you haven&apos;t added anything to your cart yet.
          Browse our products and find something you love!
        </p>
        <button
          type="button"
          className="empty-cart__cta"
          onClick={handleShopNow}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default EmptyCart;
