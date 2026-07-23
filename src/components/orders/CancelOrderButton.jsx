import React, { useState } from 'react';

function CancelOrderButton({ orderId, onCancel, disabled }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleOpenDialog() {
    setError(null);
    setDialogOpen(true);
  }

  function handleCloseDialog() {
    if (loading) return;
    setDialogOpen(false);
    setError(null);
  }

  async function handleConfirmCancel() {
    if (!onCancel) return;
    setLoading(true);
    setError(null);
    try {
      await onCancel(orderId);
      setDialogOpen(false);
    } catch (err) {
      setError(
        err?.message || 'Failed to cancel the order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenDialog}
        disabled={disabled}
        className="inline-flex items-center px-4 py-2 rounded-md border border-red-300 text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Cancel this order"
      >
        Cancel Order
      </button>

      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-desc"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={handleCloseDialog}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h2
              id="cancel-dialog-title"
              className="text-lg font-semibold text-gray-900"
            >
              Cancel Order
            </h2>
            <p
              id="cancel-dialog-desc"
              className="mt-2 text-sm text-gray-600"
            >
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </p>

            {error && (
              <div className="mt-3 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDialog}
                disabled={loading}
                className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={loading}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading && (
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                {loading ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CancelOrderButton;
