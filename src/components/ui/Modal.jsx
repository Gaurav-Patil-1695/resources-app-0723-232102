import React, { useEffect, useRef, useCallback } from 'react';
import closeIcon from '@/assets/icons/close.svg';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const Modal = ({
  open = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  className = '',
}) => {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const trapFocus = useCallback((e) => {
    if (!dialogRef.current) return;
    const focusable = Array.from(
      dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      const focusable = dialogRef.current
        ? dialogRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
        : [];
      if (focusable.length > 0) {
        focusable[0].focus();
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', trapFocus);
    } else {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', trapFocus);
    };
  }, [open, trapFocus]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      if (onClose) onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="presentation"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={[
          'relative flex w-full flex-col rounded-lg bg-white',
          'shadow-[0_20px_60px_-10px_rgba(0,0,0,0.35)]', // elevation-3
          'focus:outline-none',
          'max-h-[90vh] overflow-y-auto',
          sizeClasses[size] || sizeClasses.md,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          {title && (
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={() => { if (onClose) onClose(); }}
            aria-label="Close dialog"
            className="ml-auto rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <img src={closeIcon} alt="" aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
