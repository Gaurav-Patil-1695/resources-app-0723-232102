import React from 'react';
import { Link } from 'react-router-dom';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

/**
 * Breadcrumb component.
 *
 * Props:
 * - items: Array of { label: string, href?: string }
 *   The last item is treated as the current page (no link, aria-current).
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1rem' }}>
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.25rem',
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={index}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {index > 0 && (
                <img
                  src={chevronRightIcon}
                  alt=""
                  aria-hidden="true"
                  style={{ width: '14px', height: '14px', opacity: 0.4, flexShrink: 0 }}
                />
              )}
              {isLast ? (
                <span
                  aria-current="page"
                  style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href || '#'}
                  style={{
                    fontSize: '0.875rem',
                    color: '#1d4ed8',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
