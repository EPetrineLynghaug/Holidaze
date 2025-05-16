import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { getAccessToken } from '../../../services/tokenService';
import { PROFILE_BY_NAME_BOOKINGS_URL } from '../../constants/api';
import RatingStars from '../../ui/RatingStars';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'expired', label: 'Expired' },
];

const RATING_ASPECTS = ['Location', 'Price', 'Host', 'Accuracy', 'Cleanliness'];

const Section = ({ icon, title, children }) => (
  <section className="bg-white shadow rounded-lg w-full max-w-6xl p-6 md:p-8 space-y-6 ring-1 ring-gray-100 text-left">
    <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-purple-700">
      <span className="material-symbols-outlined text-purple-600" aria-hidden>
        {icon}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

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
    if (!stored) {
      navigate('/', { replace: true });
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError('');
        const user = JSON.parse(stored);
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
            },
          }
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
  const upcoming = bookings.filter((b) => new Date(b.dateTo) >= today);
  const expired = bookings.filter((b) => new Date(b.dateTo) < today);
  const list = filter === 'expired' ? expired : upcoming;
  const current = list.find((b) => b.id === selected);

  const setRating = (id, aspect, value) =>
    setDraft((prev) => ({ ...prev, [id]: { ...prev[id], [aspect]: value } }));
  const setComment = (id, text) =>
    setDraft((prev) => ({ ...prev, [id]: { ...prev[id], comment: text } }));
  const submitReview = (id) => console.log('Review →', draft[id]);

  return (
    <main className="w-full max-w-none ml-0% max-h-screen overflow-y-auto">
      <header className="space-y-2 text-left">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">My Bookings</h1>
        <p className="text-gray-600">All your bookings and reservation history.</p>
      </header>

      <div className="flex gap-6 mb-6">
        {FILTERS.map((f) => (
          <motion.button
            key={f.key}
            onClick={() => {
              setFilter(f.key);
              setSelected(null);
            }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-shadow focus:outline-none focus:ring-4 focus:ring-purple-200 ${
              filter === f.key ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 shadow hover:shadow-md'
            }`}
          >
            {f.label} ({f.key === 'upcoming' ? upcoming.length : expired.length})
          </motion.button>
        ))}
      </div>

      <Section icon="calendar_month" title="Booking Overview">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-3 w-full max-h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300">
            <ul className="space-y-4 p-2">
              {list.map((b) => (
                <motion.li
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full flex items-center justify-between px-6 py-3 border transition-colors cursor-pointer ${
                    b.id === selected ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  } rounded-lg`}
                >
                  <span className="flex-1 text-md font-medium text-gray-800">{b.venue?.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-9 w-full overflow-y-auto space-y-6">
            {!current ? (
              <div className="flex h-full items-center justify-center text-gray-400 italic">
                Select a booking to view details.
              </div>
            ) : filter === 'upcoming' ? (
              <Section icon="event" title="Upcoming Booking">
                <img src={current.venue?.media[0]?.url} alt={current.venue?.name} className="w-full h-48 object-cover rounded-lg shadow-lg" />
                <p className="text-gray-600">
                  <strong>{new Date(current.dateFrom).toLocaleDateString()}</strong> – <strong>{new Date(current.dateTo).toLocaleDateString()}</strong>
                </p>
                <button onClick={() => setBookings((prev) => prev.filter((b) => b.id !== current.id))} className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold hover:bg-red-200">
                  Cancel Booking
                </button>
              </Section>
            ) : (
              <Section icon="rate_review" title="Review Your Stay">
                {RATING_ASPECTS.map((aspect) => (
                  <div key={aspect} className="mt-0">
                    <p className="font-medium text-gray-700">{aspect}</p>
                    <RatingStars value={draft[current.id]?.[aspect] || 0} onChange={(value) => setRating(current.id, aspect, value)} />
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
