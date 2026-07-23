import React from 'react';
import checkIcon from '@/assets/icons/check.svg';

const STEPS = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Payment' },
  { id: 3, label: 'Review' },
];

/**
 * CheckoutStepper
 * Props:
 *   currentStep {number} - 1 | 2 | 3
 */
const CheckoutStepper = ({ currentStep = 1 }) => {
  return (
    <nav aria-label="Checkout progress" className="checkout-stepper">
      <ol className="checkout-stepper__list">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === STEPS.length - 1;

          let stepState = 'upcoming';
          if (isCompleted) stepState = 'completed';
          else if (isActive) stepState = 'active';

          return (
            <React.Fragment key={step.id}>
              <li
                className={`checkout-stepper__step checkout-stepper__step--${stepState}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="checkout-stepper__indicator">
                  {isCompleted ? (
                    <img
                      src={checkIcon}
                      alt=""
                      className="checkout-stepper__check-icon"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="checkout-stepper__number" aria-hidden="true">
                      {step.id}
                    </span>
                  )}
                </div>
                <span className="checkout-stepper__label">{step.label}</span>
              </li>
              {!isLast && (
                <li
                  className={`checkout-stepper__connector${
                    isCompleted ? ' checkout-stepper__connector--completed' : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>

      <style>{`
        .checkout-stepper {
          width: 100%;
          padding: 16px 0;
        }
        .checkout-stepper__list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .checkout-stepper__step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .checkout-stepper__connector {
          flex: 1;
          height: 2px;
          background-color: #e5e7eb;
          margin: 0 8px;
          margin-bottom: 20px;
          transition: background-color 0.2s ease;
        }
        .checkout-stepper__connector--completed {
          background-color: #16a34a;
        }
        .checkout-stepper__indicator {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        .checkout-stepper__step--upcoming .checkout-stepper__indicator {
          background-color: #f3f4f6;
          border: 2px solid #d1d5db;
          color: #9ca3af;
        }
        .checkout-stepper__step--active .checkout-stepper__indicator {
          background-color: #16a34a;
          border: 2px solid #16a34a;
          color: #ffffff;
        }
        .checkout-stepper__step--completed .checkout-stepper__indicator {
          background-color: #16a34a;
          border: 2px solid #16a34a;
        }
        .checkout-stepper__check-icon {
          width: 16px;
          height: 16px;
          filter: brightness(0) invert(1);
        }
        .checkout-stepper__number {
          line-height: 1;
        }
        .checkout-stepper__label {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          white-space: nowrap;
        }
        .checkout-stepper__step--active .checkout-stepper__label {
          color: #15803d;
          font-weight: 600;
        }
        .checkout-stepper__step--completed .checkout-stepper__label {
          color: #16a34a;
        }
      `}</style>
    </nav>
  );
};

export default CheckoutStepper;
