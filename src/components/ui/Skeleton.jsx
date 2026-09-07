import React from 'react';

/**
 * Generic skeleton placeholder.
 * variant: 'text' | 'rect' | 'circle'
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
}) => {
  const base =
    'animate-pulse bg-gray-200 rounded';

  if (variant === 'circle') {
    const size = width || height || '2.5rem';
    return (
      <span
        aria-hidden="true"
        className={`${base} rounded-full inline-block ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (variant === 'rect') {
    return (
      <span
        aria-hidden="true"
        className={`${base} block ${className}`}
        style={{
          width: width || '100%',
          height: height || '1rem',
        }}
      />
    );
  }

  // text — supports multiple lines
  return (
    <div aria-hidden="true" className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          className={`${base} block h-4`}
          style={{
            width:
              lines > 1 && i === lines - 1
                ? width || '75%'
                : width || '100%',
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
