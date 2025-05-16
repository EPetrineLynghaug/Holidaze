import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { getAccessToken } from '../../../services/tokenService';
import { PROFILE_BY_NAME_BOOKINGS_URL } from '../../constants/api';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'expired',  label: 'Expired'  },
];

const RATING_ASPECTS = [
  'Location', 'Price', 'Host', 'Accuracy', 'Cleanliness',
];

export default function MyBookingsDashboardDesktop() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/', { replace: true }); return; }
    (async () => {
      try {
        setLoading(true); setError('');
        const user = JSON.parse(stored);
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`,
          { headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY }}
        );
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const { data } = await res.json();
        setBookings(data);
      } catch (e) {
        setError(e.message || 'Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const today = new Date();
  const upcoming = bookings.filter(b => new Date(b.dateTo) >= today);
  const expired = bookings.filter(b => new Date(b.dateTo) < today);
  const list = filter === 'expired' ? expired : upcoming;
  const current = list.find(b => b.id === selected);

  const setRating = (id, aspect, value) =>
    setDraft(prev => ({ ...prev, [id]: { ...prev[id], [aspect]: value } }));
  const setComment = (id, text) =>
    setDraft(prev => ({ ...prev, [id]: { ...prev[id], comment: text } }));
  const submitReview = id => console.log('Review →', draft[id]);

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 mb-20 px-4 md:px-8">
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">All your bookings and reservation history.</p>
      </header>

      <div className="flex gap-6 mb-6">
        {FILTERS.map(f => (
          <motion.button
            key={f.key}
            onClick={() => { setFilter(f.key); setSelected(null); }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-shadow focus:outline-none focus:ring-4 focus:ring-purple-200
              ${filter === f.key
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 shadow hover:shadow-md'
              }`}
          >
            {f.label} ({f.key === 'upcoming' ? upcoming.length : expired.length})
          </motion.button>
        ))}
      </div>

      <div className="flex gap-8 h-[calc(100vh-250px)]">
        {/* Sidebar */}
        <div className="w-72 shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300">
          <ul className="space-y-4 p-2">
            {list.map(b => (
              <motion.li
                key={b.id}
                onClick={() => setSelected(b.id)}
                whileHover={{ scale: 1.02 }}
                className={`w-full flex items-center justify-between px-6 py-3 border transition-colors cursor-pointer
                  ${b.id === selected
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                  } rounded-full`}
              >
                <div className="flex items-center">
                  <span className={`h-2 w-2 rounded-full ${b.id === selected ? 'bg-purple-600' : 'bg-gray-300'}`} />
                  <span className="flex-1 ml-3 text-md font-medium text-gray-800">
                    {b.venue?.name}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-y-auto">
          {!current ? (
            <div className="flex h-full items-center justify-center text-gray-400 italic">
              Select a booking to view details.
            </div>
          ) : filter === 'upcoming' ? (
            <form
              onSubmit={e => { e.preventDefault(); /* handle */ }}
              className="w-full mx-auto p-4 md:p-8 max-h-[calc(100vh-250px)] overflow-y-auto space-y-8 bg-white rounded-3xl shadow-lg"
            >
              <header className="space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900">Upcoming Booking</h1>
                <p className="text-gray-600">Review or cancel your upcoming stay.</p>
              </header>
              <img
                src={current.venue?.media[0]?.url}
                alt={current.venue?.name}
                className="w-full h-48 object-cover rounded-2xl"
              />
              <h2 className="text-2xl font-semibold text-gray-900">{current.venue?.name}</h2>
              <p className="text-gray-600">
                <strong>{new Date(current.dateFrom).toLocaleDateString()}</strong> – <strong>{new Date(current.dateTo).toLocaleDateString()}</strong>
              </p>
              <button
                onClick={() => setBookings(prev => prev.filter(b => b.id !== current.id))}
                className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200"
              >
                Cancel Booking
              </button>
            </form>
          ) : (
            <form
              onSubmit={e => { e.preventDefault(); submitReview(current.id); }}
              className="w-full mx-auto p-4 md:p-8 max-h-[calc(100vh-250px)] overflow-y-auto space-y-8 bg-white rounded-3xl shadow-lg"
            >
              <header className="space-y-2">
                <h1 className="text-3xl font-extrabold text-gray-900">Review Your Stay</h1>
                <p className="text-gray-600">Help future guests by sharing your experience.</p>
              </header>
              <h2 className="text-xl font-semibold text-gray-900">
                Stay at <span className="text-purple-600">{current.venue?.name}</span>
              </h2>
              {RATING_ASPECTS.map(a => (
                <div key={a} className="flex items-center space-x-4">
                  <span className="w-28 text-sm font-medium text-gray-700">{a}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => {
                      const filled = (draft[current.id]?.[a] || 0) >= i;
                      return (
                        <motion.span
                          key={i}
                          onClick={() => setRating(current.id, a, i)}
                          whileTap={{ scale: 0.9 }}
                          className={`material-symbols-outlined text-xl cursor-pointer
                            ${filled ? 'text-purple-600' : 'text-gray-300'}`}
                          style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}` }}
                        >star</motion.span>
                      );
                    })}
                  </div>
                </div>
              ))}
              <textarea
                value={draft[current.id]?.comment || ''}
                onChange={e => setComment(current.id, e.target.value)}
                placeholder="Write your review…"
                className="w-full h-24 p-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-purple-200 resize-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
