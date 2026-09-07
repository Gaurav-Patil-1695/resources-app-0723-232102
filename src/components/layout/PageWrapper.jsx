import React from 'react';

/**
 * PageWrapper applies consistent max-width and horizontal padding to page content.
 *
 * Props:
 * - children: React node
 * - maxWidth: CSS max-width value (default '1280px')
 * - padding: CSS padding shorthand (default '2rem 1rem')
 * - className: optional additional class name
 * - style: optional additional inline styles
 */
const PageWrapper = ({
  children,
  maxWidth = '1280px',
  padding = '2rem 1rem',
  className,
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        maxWidth,
        margin: '0 auto',
        padding,
        width: '100%',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
