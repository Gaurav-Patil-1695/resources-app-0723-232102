import React, { useId } from 'react';

const Checkbox = ({
  label,
  error,
  id: idProp,
  required = false,
  disabled = false,
  className = '',
  checked,
  onChange,
  ...rest
}) => {
  const autoId = useId();
  const id = idProp || autoId;
  const errorId = `${id}-error`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          required={required}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={[
            'h-4 w-4 rounded border-gray-300 text-blue-600',
            'transition-colors duration-150',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {label && (
          <label
            htmlFor={id}
            className={[
              'select-none text-sm text-gray-700',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            ].join(' ')}
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="ml-6 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
