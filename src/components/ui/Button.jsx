import React from 'react';
import Spinner from './Spinner';

const variantClasses = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-300',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-400',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-300',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded',
  md: 'px-4 py-2 text-sm rounded-md',
  lg: 'px-6 py-3 text-base rounded-md',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  onClick,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-busy={loading}
      {...rest}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
};

export default Button;
