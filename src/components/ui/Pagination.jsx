import React from 'react';
import chevronLeft from '@/assets/icons/chevron-left.svg';
import chevronRight from '@/assets/icons/chevron-right.svg';

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const buildPages = () => {
    const totalNumbers = siblingCount * 2 + 5; // siblings + first + last + 2 dots
    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      return [...range(1, 3 + siblingCount * 2), '...', totalPages];
    }
    if (showLeftDots && !showRightDots) {
      return [1, '...', ...range(totalPages - (2 + siblingCount * 2), totalPages)];
    }
    return [
      1,
      '...',
      ...range(leftSibling, rightSibling),
      '...',
      totalPages,
    ];
  };

  const pages = buildPages();

  const btnBase =
    'inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded px-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1';

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex items-center gap-1 ${className}`}
    >
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${btnBase} border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <img src={chevronLeft} alt="" aria-hidden="true" className="h-4 w-4" />
      </button>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`dots-${idx}`}
            className="inline-flex h-9 min-w-[2.25rem] items-center justify-center px-2 text-sm text-gray-400"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={[
              btnBase,
              page === currentPage
                ? 'bg-blue-600 text-white border border-blue-600'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            ].join(' ')}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${btnBase} border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <img src={chevronRight} alt="" aria-hidden="true" className="h-4 w-4" />
      </button>
    </nav>
  );
};

export default Pagination;
