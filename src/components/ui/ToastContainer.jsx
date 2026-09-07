import React from 'react';
import Toast from './Toast';

/**
 * Renders active toasts anchored to the bottom-right corner of the viewport.
 * Expects `toasts` array: [{ id, type, message, duration? }]
 * and `onDismiss(id)` callback.
 */
const ToastContainer = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
