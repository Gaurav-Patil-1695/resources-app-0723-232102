import React, { useId } from 'react';

const Input = ({
  label,
  error,
  hint,
  id: idProp,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  inputClassName = '',
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
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <input
        id={id}
        type={type}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm text-gray-900 placeholder-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
          error
            ? 'border-red-400 focus-visible:ring-red-400'
            : 'border-gray-300 focus-visible:ring-blue-500',
          disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white',
          inputClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      />
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

export default Input;
