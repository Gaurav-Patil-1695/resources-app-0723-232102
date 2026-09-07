import React from 'react';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

const Spinner = ({ size = 'md', className = '', label = 'Loading…' }) => (
  <span role="status" aria-label={label} className={`inline-flex ${className}`}>
    <span
      className={[
        'animate-spin rounded-full border-current border-b-transparent',
        sizeClasses[size] || sizeClasses.md,
      ].join(' ')}
    />
    <span className="sr-only">{label}</span>
  </span>
);

export default Spinner;
