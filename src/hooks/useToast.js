import { useCallback } from 'react';
import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { addToast, removeToast, clearToasts } = context;

  const toast = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'info', ...options });
    },
    [addToast]
  );

  const toastSuccess = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'success', ...options });
    },
    [addToast]
  );

  const toastError = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'error', ...options });
    },
    [addToast]
  );

  const toastWarning = useCallback(
    (message, options = {}) => {
      addToast({ message, type: 'warning', ...options });
    },
    [addToast]
  );

  return {
    toast,
    toastSuccess,
    toastError,
    toastWarning,
    removeToast,
    clearToasts,
  };
}
