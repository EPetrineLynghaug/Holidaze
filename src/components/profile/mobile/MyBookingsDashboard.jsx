import React, { useState, useCallback } from 'react';
import useBookings from '../../../hooks/api/useBookings';
import { OrderCancelledPopup } from '../../ui/mobildemodal/OrderCancelledPopup';
import BottomSheet from '../../../components/ui/mobildemodal/BottomSheet';

const REVIEW_ASPECTS = ['Location', 'Price', 'Host', 'Accuracy', 'Cleanliness'];
const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'expired',  label: 'Past'     },
];

export default function MyBookingsDashboard({ onClose, userName }) {
  const {
    bookings,
    loading,
    error,
    cancelBooking,
    submitReview,
  } = useBookings(userName);

  const [filter, setFilter]                   = useState('upcoming');
  const [reviews, setReviews]                 = useState({});
  const [selectedId, setSelectedId]           = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);

  const now       = new Date();
  const isExpired = b => new Date(b.dateTo) < now;
  const expired   = bookings.filter(isExpired);
  const upcoming  = bookings.filter(b => !isExpired(b));
  const displayed = filter === 'expired' ? expired : upcoming;

  /* ---------------- HELPERS ---------------- */
  const pillClass = active =>
    `px-6 py-2 rounded-md text-sm font-medium transition ${
      active ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-300'
    }`;

  const handleRating = useCallback((bid, aspect, value) => {
    setReviews(prev => ({
      ...prev,
      [bid]: { ...prev[bid], [aspect]: value },
    }));
  }, []);

  const handleComment = useCallback((bid, text) => {
    setReviews(prev => ({
      ...prev,
      [bid]: { ...prev[bid], comment: text },
    }));
  }, []);

  const handleSubmitReview = useCallback(async bid => {
    const payload = reviews[bid] || {};
    await submitReview(bid, payload);
    setSelectedId(null);
  }, [reviews, submitReview]);

  const handleDeleteConfirmed = (id, reason) => {
    cancelBooking(id);
    setCancelBookingId(null);
    setSelectedId(null);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <BottomSheet title="My Bookings" onClose={onClose}>
      <div className="px-6 py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-purple-700">My Bookings</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">×</button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setSelectedId(null); }}
              className={pillClass(filter === f.key)}
            >
              {f.label} ({f.key === 'upcoming' ? upcoming.length : expired.length})
            </button>
          ))}
        </div>

        {/* Status */}
        {loading && <p className="text-center py-4 text-gray-500">Loading bookings...</p>}
        {error   && <p className="text-center py-4 text-red-500">{error}</p>}

        {/* Booking List */}
        {!loading && !error && (
          <ul className="space-y-3 max-h-[50vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 pr-1">
            {displayed.map(b => (
              <li key={b.id}>
                <button
                  onClick={() => setSelectedId(selectedId === b.id ? null : b.id)}
                  className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition ${
                    selectedId === b.id
                      ? 'bg-purple-50 border-purple-600 shadow-md'
                      : 'bg-white border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <span className="font-medium text-gray-900">{b.venue?.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                  </span>
                </button>

                {/* Booking Details (only show when selected) */}
                {selectedId === b.id && (
                  <div className="mt-3 w-full bg-white rounded-lg ring-1 ring-gray-100 shadow p-4">
                    {/* Image */}
                    <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      {b.venue?.media?.[0]?.url ? (
                        <img
                          src={b.venue.media[0].url}
                          alt={b.venue.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                          <span className="material-symbols-outlined text-5xl">image</span>
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="space-y-2 text-sm text-gray-600 mt-3">
                      <p>
                        <span className="font-semibold">
                          {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                        </span>
                      </p>
                      {b.venue?.location?.address && <p>📍 {b.venue.location.address}</p>}
                      {b.venue?.price && <p>💰 {b.venue.price.toLocaleString()} NOK per night</p>}
                      {b.venue?.maxGuests && <p>👥 {b.venue.maxGuests} guests</p>}
                    </div>

                    {/* Cancel button for upcoming bookings */}
                    {filter === 'upcoming' && (
                      <button onClick={() => setCancelBookingId(b.id)} className="w-full py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 mt-4">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Cancel confirmation popup */}
        {cancelBookingId && (
          <OrderCancelledPopup
            onClose={() => setCancelBookingId(null)}
            onConfirm={reason => handleDeleteConfirmed(cancelBookingId, reason)}
          />
        )}
      </div>
    </BottomSheet>
  );
}
