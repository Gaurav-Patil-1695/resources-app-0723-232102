import React, { useEffect } from 'react';
import closeIcon from '@/assets/icons/close.svg';

const typeConfig = {
  success: {
    containerClass: 'bg-green-50 border-green-400 text-green-800',
    icon: '✓',
    iconClass: 'text-green-500',
  },
  error: {
    containerClass: 'bg-red-50 border-red-400 text-red-800',
    icon: '✕',
    iconClass: 'text-red-500',
  },
  info: {
    containerClass: 'bg-blue-50 border-blue-400 text-blue-800',
    icon: 'ℹ',
    iconClass: 'text-blue-500',
  },
  warning: {
    containerClass: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    icon: '⚠',
    iconClass: 'text-yellow-600',
  },
};

const Toast = ({
  id,
  type = 'info',
  message,
  duration = 4000,
  onDismiss,
}) => {
  const config = typeConfig[type] || typeConfig.info;

  useEffect(() => {
    if (!duration || duration <= 0) return;
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={[
        'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-md text-sm max-w-sm w-full',
        'animate-[fadeInUp_0.2s_ease-out]',
        config.containerClass,
      ].join(' ')}
    >
      <span aria-hidden="true" className={`mt-0.5 text-base leading-none font-bold ${config.iconClass}`}>
        {config.icon}
      </span>
      <p className="flex-1 leading-snug">{message}</p>
      <button
        type="button"
        onClick={() => { if (onDismiss) onDismiss(id); }}
        aria-label="Dismiss notification"
        className="ml-auto shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <img src={closeIcon} alt="" aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Toast;
