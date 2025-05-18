import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useBookings from '../../../hooks/api/useBookings';
import { OrderCancelledPopup } from '../../ui/mobildemodal/OrderCancelledPopup';

const REVIEW_ASPECTS = ['Location', 'Price', 'Host', 'Accuracy', 'Cleanliness'];

export default function MyBookingsDashboard({ onClose, userName }) {
  const navigate = useNavigate();
  const {
    bookings,
    loading,
    error,
    cancelBooking,
    submitReview,
  } = useManageBookings(userName);

  const [filter, setFilter] = useState('upcoming');
  const [reviews, setReviews] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  // Redirect if no user
  if (!userName) {
    navigate('/', { replace: true });
    return null;
  }

  const now = new Date();
  const isExpired = b => new Date(b.dateTo) < now;
  const expired = bookings.filter(isExpired);
  const upcoming = bookings.filter(b => !isExpired(b));
  const displayed = filter === 'expired' ? expired : upcoming;

  const handleRating = useCallback((bookingId, aspect, value) => {
    setReviews(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], [aspect]: value },
    }));
  }, []);

  const handleComment = useCallback((bookingId, text) => {
    setReviews(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], comment: text },
    }));
  }, []);

  const handleSubmitReview = useCallback(async (bookingId) => {
    const payload = reviews[bookingId];
    await submitReview(bookingId, payload);
    setSelectedId(null);
  }, [submitReview, reviews]);

  const selected = bookings.find(b => b.id === selectedId);
  const review = reviews[selectedId] || {};

  return (
    <BottomSheet title="My Bookings" onClose={onClose}>
      <div className="px-6 py-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Bookings</h2>
          <button onClick={onClose} className="text-xl text-gray-600 hover:text-gray-900">×</button>
        </div>

        <select
          value={filter}
          onChange={e => { setFilter(e.target.value); setSelectedId(null); }}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="upcoming">Upcoming ({upcoming.length})</option>
          <option value="expired">Expired ({expired.length})</option>
        </select>

        {loading && <p className="text-center py-4 text-gray-500">Loading bookings...</p>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}

        {!loading && !error && (
          <ul className="space-y-2">
            {displayed.map(b => (
              <li key={b.id}>
                <button
                  onClick={() => setSelectedId(b.id)}
                  className={`w-full text-left p-3 rounded-lg shadow-sm flex justify-between items-center transition ${
                    selectedId === b.id ? 'bg-indigo-100' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium text-gray-800">{b.venue?.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {selected && filter === 'upcoming' && (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-2">
            <p className="text-gray-600">
              Upcoming stay from <strong>{new Date(selected.dateFrom).toLocaleDateString()}</strong> to <strong>{new Date(selected.dateTo).toLocaleDateString()}</strong>
            </p>
            <button
              onClick={() => { cancelBooking(selected.id); setSelectedId(null); }}
              className="text-red-500 font-medium hover:underline"
            >
              Cancel Booking
            </button>
          </div>
        )}

        {selected && filter === 'expired' && (
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h3 className="text-lg font-semibold">
              Review your stay at <span className="text-indigo-600">{selected.venue?.name}</span>
            </h3>
            <div className="space-y-3">
              {REVIEW_ASPECTS.map(aspect => (
                <div key={aspect} className="flex items-center">
                  <span className="w-24 text-sm font-medium text-gray-700">{aspect}</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <span
                        key={i}
                        className={`material-symbols-outlined cursor-pointer transition-transform active:scale-90 hover:scale-110 ${
                          review[aspect] >= i ? 'icon-purple filled' : 'icon-gray'
                        }`}
                        onClick={() => handleRating(selected.id, aspect, i)}
                      >
                        {review[aspect] >= i ? 'star' : 'star_outline'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <textarea
              value={review.comment || ''}
              onChange={e => handleComment(selected.id, e.target.value)}
              placeholder="Write your review..."
              className="w-full border border-gray-300 rounded-lg p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={() => handleSubmitReview(selected.id)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}