import React, { useState } from 'react';

const OUTCOMES = [
  { value: 'success', label: 'Simulate Success', description: 'Payment authorised immediately' },
  { value: 'failure', label: 'Simulate Failure', description: 'Card declined / payment failed' },
  { value: 'pending', label: 'Simulate Pending', description: 'Payment held for review (async)' },
];

const METHODS = [
  { value: 'card', label: 'Credit / Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'cod', label: 'Cash on Delivery' },
];

const PROCESSING_DELAY_MS = 1500;

/**
 * PaymentMockForm — TEST MODE ONLY
 * Props:
 *   onPaymentComplete {(result: { outcome, method, transactionId }) => void}
 *   amount           {number}
 */
const PaymentMockForm = ({ onPaymentComplete, amount = 0 }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [selectedOutcome, setSelectedOutcome] = useState('success');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const formatPrice = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const generateTransactionId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'TXN';
    for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
  };

  const handlePay = () => {
    if (processing) return;
    setResult(null);
    setProcessing(true);

    setTimeout(() => {
      const txnResult = {
        outcome: selectedOutcome,
        method: selectedMethod,
        transactionId: selectedOutcome !== 'failure' ? generateTransactionId() : null,
      };
      setResult(txnResult);
      setProcessing(false);
      if (onPaymentComplete) onPaymentComplete(txnResult);
    }, PROCESSING_DELAY_MS);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedOutcome('success');
  };

  const outcomeConfig = {
    success: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', icon: '✓', label: 'Payment Successful' },
    failure: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '✗', label: 'Payment Failed' },
    pending: { color: '#d97706', bg: '#fffbeb', border: '#fde68a', icon: '⏳', label: 'Payment Pending' },
  };

  if (result) {
    const cfg = outcomeConfig[result.outcome];
    return (
      <div className="pmf">
        <div className="pmf__test-banner">🧪 TEST MODE — No real payment processed</div>
        <div className="pmf__result" style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          <span className="pmf__result-icon" style={{ color: cfg.color }}>{cfg.icon}</span>
          <div className="pmf__result-body">
            <p className="pmf__result-title" style={{ color: cfg.color }}>{cfg.label}</p>
            {result.transactionId && (
              <p className="pmf__result-txn">Transaction ID: <code>{result.transactionId}</code></p>
            )}
            <p className="pmf__result-method">Method: {METHODS.find((m) => m.value === result.method)?.label}</p>
            {result.outcome === 'pending' && (
              <p className="pmf__result-note">You will be notified once the payment is confirmed.</p>
            )}
            {result.outcome === 'failure' && (
              <p className="pmf__result-note">Please try again with a different payment method.</p>
            )}
          </div>
        </div>
        <button type="button" className="pmf__reset-btn" onClick={handleReset}>
          Try Another Payment
        </button>
        <style>{pmfStyles}</style>
      </div>
    );
  }

  return (
    <div className="pmf">
      <div className="pmf__test-banner">🧪 TEST MODE — No real payment processed</div>

      <h2 className="pmf__title">Payment</h2>
      {amount > 0 && (
        <p className="pmf__amount">Amount Payable: <strong>{formatPrice(amount)}</strong></p>
      )}

      <fieldset className="pmf__fieldset">
        <legend className="pmf__legend">Payment Method</legend>
        <div className="pmf__method-grid">
          {METHODS.map((m) => (
            <label
              key={m.value}
              className={`pmf__method-option${selectedMethod === m.value ? ' pmf__method-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={m.value}
                checked={selectedMethod === m.value}
                onChange={() => setSelectedMethod(m.value)}
                className="pmf__radio"
              />
              <span className="pmf__method-label">{m.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="pmf__fieldset">
        <legend className="pmf__legend">Simulate Outcome</legend>
        <div className="pmf__outcome-list">
          {OUTCOMES.map((o) => (
            <label
              key={o.value}
              className={`pmf__outcome-option${selectedOutcome === o.value ? ' pmf__outcome-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="paymentOutcome"
                value={o.value}
                checked={selectedOutcome === o.value}
                onChange={() => setSelectedOutcome(o.value)}
                className="pmf__radio"
              />
              <div>
                <span className="pmf__outcome-label">{o.label}</span>
                <span className="pmf__outcome-desc">{o.description}</span>
              </div>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        className={`pmf__pay-btn pmf__pay-btn--${selectedOutcome}${processing ? ' pmf__pay-btn--processing' : ''}`}
        onClick={handlePay}
        disabled={processing}
        aria-busy={processing}
      >
        {processing ? 'Processing…' : `Pay ${amount > 0 ? formatPrice(amount) : ''}`}
      </button>

      <style>{pmfStyles}</style>
    </div>
  );
};

const pmfStyles = `
  .pmf {
    background: #ffffff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    max-width: 480px;
  }
  .pmf__test-banner {
    font-size: 12px;
    font-weight: 600;
    color: #92400e;
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 6px;
    padding: 6px 12px;
    text-align: center;
    margin-bottom: 20px;
    letter-spacing: 0.02em;
  }
  .pmf__title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px;
  }
  .pmf__amount {
    font-size: 14px;
    color: #374151;
    margin: 0 0 20px;
  }
  .pmf__fieldset {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    margin: 0 0 16px;
  }
  .pmf__legend {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    padding: 0 4px;
  }
  .pmf__method-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
  }
  .pmf__method-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    color: #374151;
    background: #f9fafb;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .pmf__method-option--selected {
    border-color: #16a34a;
    background: #f0fdf4;
    color: #15803d;
    font-weight: 500;
  }
  .pmf__outcome-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }
  .pmf__outcome-option {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    background: #f9fafb;
    transition: border-color 0.15s ease, background 0.15s ease;
  }
  .pmf__outcome-option--selected {
    border-color: #6366f1;
    background: #f5f3ff;
  }
  .pmf__outcome-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #111827;
  }
  .pmf__outcome-desc {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-top: 2px;
  }
  .pmf__radio {
    accent-color: #16a34a;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .pmf__pay-btn {
    width: 100%;
    padding: 13px;
    font-size: 15px;
    font-weight: 600;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s ease, opacity 0.15s ease;
    margin-top: 4px;
    color: #ffffff;
  }
  .pmf__pay-btn--success {
    background-color: #16a34a;
  }
  .pmf__pay-btn--success:hover:not(:disabled) {
    background-color: #15803d;
  }
  .pmf__pay-btn--failure {
    background-color: #dc2626;
  }
  .pmf__pay-btn--failure:hover:not(:disabled) {
    background-color: #b91c1c;
  }
  .pmf__pay-btn--pending {
    background-color: #d97706;
  }
  .pmf__pay-btn--pending:hover:not(:disabled) {
    background-color: #b45309;
  }
  .pmf__pay-btn--processing {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .pmf__result {
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 16px;
  }
  .pmf__result-icon {
    font-size: 28px;
    line-height: 1;
    flex-shrink: 0;
  }
  .pmf__result-body {
    flex: 1;
  }
  .pmf__result-title {
    font-size: 16px;
    font-weight: 700;
    margin: 0 0 6px;
  }
  .pmf__result-txn {
    font-size: 13px;
    color: #374151;
    margin: 0 0 4px;
  }
  .pmf__result-txn code {
    font-family: monospace;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .pmf__result-method {
    font-size: 13px;
    color: #374151;
    margin: 0 0 4px;
  }
  .pmf__result-note {
    font-size: 13px;
    color: #6b7280;
    margin: 4px 0 0;
  }
  .pmf__reset-btn {
    width: 100%;
    padding: 11px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #ffffff;
    color: #374151;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  .pmf__reset-btn:hover {
    background: #f9fafb;
  }
`;

export default PaymentMockForm;
