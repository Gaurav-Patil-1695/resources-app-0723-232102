import React, { useState } from 'react';
import checkIcon from '@/assets/icons/check.svg';
import closeIcon from '@/assets/icons/close.svg';

/**
 * ReturnApprovalPanel
 * Props:
 *   returnRequest {object}    - { id, order_id, reason, items, requested_at }
 *   onApprove     {function}  - async (id, refundNote) => void
 *   onReject      {function}  - async (id, refundNote) => void
 */
const ReturnApprovalPanel = ({ returnRequest, onApprove, onReject }) => {
  const [refundNote, setRefundNote] = useState('');
  const [loading, setLoading] = useState(null); // 'approve' | 'reject' | null
  const [error, setError] = useState(null);
  const [done, setDone] = useState(null); // 'approved' | 'rejected'

  if (!returnRequest) return null;

  const handleAction = async (action) => {
    setError(null);
    setLoading(action);
    try {
      if (action === 'approve') {
        await onApprove(returnRequest.id, refundNote);
        setDone('approved');
      } else {
        await onReject(returnRequest.id, refundNote);
        setDone('rejected');
      }
    } catch (err) {
      setError(err?.message || 'Action failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (done) {
    return (
      <div
        className={`rounded-2xl p-6 text-center font-semibold ${
          done === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}
      >
        Return request <strong>#{returnRequest.id}</strong> has been{' '}
        {done === 'approved' ? 'approved' : 'rejected'}.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Return Request #{returnRequest.id}</h2>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <dt className="text-gray-500">Order</dt>
        <dd className="text-gray-800 font-medium">#{returnRequest.order_id}</dd>

        <dt className="text-gray-500">Reason</dt>
        <dd className="text-gray-800">{returnRequest.reason || '—'}</dd>

        <dt className="text-gray-500">Requested</dt>
        <dd className="text-gray-800">
          {returnRequest.requested_at
            ? new Date(returnRequest.requested_at).toLocaleDateString()
            : '—'}
        </dd>
      </dl>

      {returnRequest.items?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {returnRequest.items.map((item, i) => (
              <li key={i} className="flex justify-between items-center px-4 py-2 text-sm">
                <span>{item.name} {item.sku ? <span className="text-gray-400">({item.sku})</span> : null}</span>
                <span className="text-gray-600">Qty: {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Refund Note</label>
        <textarea
          rows={3}
          value={refundNote}
          onChange={(e) => setRefundNote(e.target.value)}
          placeholder="Optional note to customer…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3 justify-end">
        <button
          onClick={() => handleAction('reject')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          <img src={closeIcon} alt="" className="w-4 h-4 invert" />
          {loading === 'reject' ? 'Rejecting…' : 'Reject'}
        </button>
        <button
          onClick={() => handleAction('approve')}
          disabled={loading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          <img src={checkIcon} alt="" className="w-4 h-4 invert" />
          {loading === 'approve' ? 'Approving…' : 'Approve'}
        </button>
      </div>
    </div>
  );
};

export default ReturnApprovalPanel;
