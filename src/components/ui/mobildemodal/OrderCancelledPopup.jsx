import React, { useState } from 'react';

const ORDER_CANCEL_REASONS = [
  { key: 'mind', label: 'Changed my mind' },
  { key: 'price', label: 'Found a better price elsewhere' },
  { key: 'other', label: 'Other reason' },
  { key: 'host', label: 'Issue with host or venue' },
];

export function OrderCancelledPopup({ onClose, onConfirm }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (onConfirm && reason) onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

                {/* Cancel Icon */}
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="material-symbols-outlined text-4xl text-red-600">block</span>
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-lg font-semibold text-gray-800">Cancel booking?</h2>

        {/* Body text */}
        <p className="text-left text-sm text-gray-600 mb-6 mt-3">
          You're about to cancel your stay. Your refund will be processed within <span className="font-semibold">3–4 business days</span>, and your host will be notified. Any cancellation policies will apply.
        </p>

        {/* Reason selector */}
        <div className="mt-4 text-left">
          <label
            htmlFor="order-reason-select"
            className="block text-sm font-semibold text-gray-600 mb-1"
          >
            Why are you cancelling?
          </label>
          <select
            id="order-reason-select"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>Select a reason...</option>
            {ORDER_CANCEL_REASONS.map(r => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Keep booking
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason}
            className={`flex-1 py-2 rounded-lg text-white font-medium ${
              reason ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'
            }`}
          >
            Cancel booking
          </button>
        </div>
      </div>
    </div>
  );
}