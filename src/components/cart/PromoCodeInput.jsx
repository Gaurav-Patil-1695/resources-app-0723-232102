import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';

const PromoCodeInput = ({ onApply, onRemove, appliedCode, appliedDiscount }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCodeChange = (e) => {
    setCode(e.target.value.toUpperCase());
    if (error) setError('');
  };

  const handleApply = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError('Please enter a promo code.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await onApply(trimmed);
      setCode('');
    } catch (err) {
      setError(err?.message || 'Invalid or expired promo code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  const handleRemove = () => {
    setError('');
    onRemove();
  };

  return (
    <div className="promo-code">
      <h3 className="promo-code__title">Promo Code</h3>

      {appliedCode ? (
        <div className="promo-code__applied">
          <div className="promo-code__applied-badge">
            <img src={checkIcon} alt="Applied" className="promo-code__applied-icon" />
            <div className="promo-code__applied-info">
              <span className="promo-code__applied-code">{appliedCode}</span>
              {appliedDiscount > 0 && (
                <span className="promo-code__applied-discount">
                  &minus;₹{Number(appliedDiscount).toFixed(2)} off
                </span>
              )}
            </div>
            <button
              type="button"
              className="promo-code__remove-btn"
              onClick={handleRemove}
              aria-label="Remove promo code"
            >
              <img src={closeIcon} alt="Remove" className="promo-code__remove-icon" />
            </button>
          </div>
        </div>
      ) : (
        <div className="promo-code__input-wrapper">
          <input
            type="text"
            className={`promo-code__input${error ? ' promo-code__input--error' : ''}`}
            placeholder="Enter promo code"
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            aria-label="Promo code"
            autoComplete="off"
            maxLength={30}
          />
          <button
            type="button"
            className="promo-code__apply-btn"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? 'Applying…' : 'Apply'}
          </button>
        </div>
      )}

      {error && (
        <p className="promo-code__error" role="alert">{error}</p>
      )}
    </div>
  );
};

export default PromoCodeInput;
