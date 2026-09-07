import React, { useId } from 'react';
import chevronDown from '@/assets/icons/chevron-down.svg';

const Select = ({
  label,
  error,
  hint,
  id: idProp,
  required = false,
  disabled = false,
  children,
  className = '',
  selectClassName = '',
  ...rest
}) => {
  const autoId = useId();
  const id = idProp || autoId;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = [
    error ? errorId : null,
    hint ? hintId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={[
            'block w-full appearance-none rounded-md border px-3 py-2 pr-8 text-sm text-gray-900',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            error
              ? 'border-red-400 focus-visible:ring-red-400'
              : 'border-gray-300 focus-visible:ring-blue-500',
            disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white',
            selectClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        >
          {children}
        </select>
        <img
          src={chevronDown}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        />
      </div>
      {hint && !error && (
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
