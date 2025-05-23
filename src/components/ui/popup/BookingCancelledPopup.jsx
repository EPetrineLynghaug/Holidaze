import { useState } from 'react';
import MobileCloseButton from "../buttons/MobileCloseButton"; 

const HOST_CANCEL_REASONS = [
  { key: 'noshow',      label: 'Guest no-show' },
  { key: 'double',      label: 'Double booking' },
  { key: 'maintenance', label: 'Maintenance issue' },
  { key: 'other',       label: 'Other reason' },
];

export default function BookingCancelledPopup({ onClose, onConfirm }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
        <MobileCloseButton
          onClick={onClose}
          className="!absolute !top-1.5 !right-1.5 sm:!top-2 sm:!right-2"
        />

        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-200">
          <span className="material-symbols-outlined text-4xl text-red-600">cancel</span>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-800">Cancel venue?</h2>

        <p className="mt-2 text-sm text-gray-600 mb-6">
          This will permanently remove the venue and all its bookings. Guests will be notified.
        </p>

        <div className="mb-6 text-left">
          <label
            htmlFor="host-reason-select"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Reason for cancelling
          </label>
          <select
            id="host-reason-select"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="block w-full rounded-lg border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>Select a reason…</option>
            {HOST_CANCEL_REASONS.map(r => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 py-2 text-gray-700 hover:bg-gray-50"
          >
            Keep venue
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason}
            className={`flex-1 rounded-lg text-white py-2 font-medium ${
              reason
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-300 cursor-not-allowed'
            }`}
          >
            Cancel venue
          </button>
        </div>
      </div>
    </div>
  );
}
