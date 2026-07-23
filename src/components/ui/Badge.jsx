import React from 'react';

const variantConfig = {
  success: {
    containerClass: 'bg-green-100 text-green-800',
    defaultIcon: '✓',
    defaultLabel: 'Success',
  },
  error: {
    containerClass: 'bg-red-100 text-red-800',
    defaultIcon: '✕',
    defaultLabel: 'Error',
  },
  warning: {
    containerClass: 'bg-yellow-100 text-yellow-800',
    defaultIcon: '⚠',
    defaultLabel: 'Warning',
  },
  info: {
    containerClass: 'bg-blue-100 text-blue-800',
    defaultIcon: 'ℹ',
    defaultLabel: 'Info',
  },
  neutral: {
    containerClass: 'bg-gray-100 text-gray-700',
    defaultIcon: '•',
    defaultLabel: 'Neutral',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
};

/**
 * Badge always renders both an icon and a label to convey meaning beyond colour alone.
 */
const Badge = ({
  variant = 'neutral',
  label,
  icon,
  size = 'md',
  className = '',
}) => {
  const config = variantConfig[variant] || variantConfig.neutral;
  const displayIcon = icon !== undefined ? icon : config.defaultIcon;
  const displayLabel = label !== undefined ? label : config.defaultLabel;

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        config.containerClass,
        sizeClasses[size] || sizeClasses.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true" className="leading-none">
        {displayIcon}
      </span>
      <span>{displayLabel}</span>
    </span>
  );
};

export default Badge;
