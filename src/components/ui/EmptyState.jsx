import React from 'react';
import emptyStateImg from '@/assets/images/empty-state.svg';

const EmptyState = ({
  title = 'Nothing here yet',
  description,
  image,
  ctaLabel,
  onCta,
  className = '',
}) => {
  const imgSrc = image !== undefined ? image : emptyStateImg;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 px-6 text-center ${className}`}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt=""
          aria-hidden="true"
          className="h-32 w-32 object-contain opacity-80"
        />
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && (
          <p className="max-w-sm text-sm text-gray-500">{description}</p>
        )}
      </div>
      {ctaLabel && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 transition-colors duration-150"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
