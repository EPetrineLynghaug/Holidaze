
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
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
  const navigate   = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter,   setFilter]   = useState('upcoming');
  const [selected, setSelected] = useState(null);
  const [draft,    setDraft]    = useState({});
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/', { replace:true }); return; }

    (async () => {
      try {
        setLoading(true); setError('');
        const user  = JSON.parse(stored);
        const token = getAccessToken();
        const res   = await fetch(
          `${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`,
          { headers:{ Authorization:`Bearer ${token}`,
                      'X-Noroff-API-Key':import.meta.env.VITE_NOROFF_API_KEY } }
        );
        if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
        const { data } = await res.json();
        setBookings(data);
      } catch (e) { setError(e.message || 'Failed to load bookings.'); }
      finally      { setLoading(false); }
    })();
  }, [navigate]);

  const today    = new Date();
  const upcoming = bookings.filter(b => new Date(b.dateTo) >= today);
  const expired  = bookings.filter(b => new Date(b.dateTo) <  today);
  const list     = filter === 'expired' ? expired : upcoming;
  const current  = list.find(b => b.id === selected);

  const setRating  = (id,a,v) => setDraft(p => ({ ...p, [id]:{ ...p[id], [a]:v }}));
  const setComment = (id,t)   => setDraft(p => ({ ...p, [id]:{ ...p[id], comment:t }}));
  const submitReview = id     => console.table('review →', draft[id]);

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 mb-20 p-6 md:p-8 bg-gray-50 rounded-2xl max-h-[calc(100vh-200px)] overflow-y-auto">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">My Bookings</h1>
          <p className="mt-1 text-gray-600">Manage&nbsp;&amp;&nbsp;review your upcoming and past bookings.</p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          {FILTERS.map(f => (
            <button key={f.key}
              onClick={() => { setFilter(f.key); setSelected(null); }}
              className={`px-4 py-1.5 rounded-md border text-sm font-semibold transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                filter===f.key
                  ? 'bg-purple-600 text-white border-transparent'
                  : 'bg-white text-gray-700 border-gray-300'
              }`}>
              {f.label} ({f.key==='upcoming' ? upcoming.length : expired.length})
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <p className="flex justify-center py-24 text-gray-500">Loading …</p>
      ) : error ? (
        <p className="flex justify-center py-24 text-red-500">{error}</p>
      ) : list.length === 0 ? (
        <p className="flex justify-center py-24 text-gray-600">No&nbsp;{filter}&nbsp;bookings.</p>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[350px_1fr]">
          <ul className="space-y-2 pr-1">
            {list.map(b => (
              <li key={b.id}>
                <button
                  onClick={() => setSelected(b.id)}
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-2xl border border-gray-200 shadow-sm transition ${
                    b.id===selected ? 'bg-purple-50 ring-2 ring-purple-300 text-purple-700'
                                     : 'bg-white hover:bg-gray-50 text-gray-900'
                  }`}>
                  <span className={`mr-2 h-2 w-2 rounded-full ${b.id===selected ? 'bg-purple-600' : 'bg-transparent'}`}/>
                  <span className="flex-1 truncate">{b.venue?.name}</span>
                  <span className="text-xs text-gray-500 shrink-0">
                    {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {!current ? (
            <div className="h-full flex items-center justify-center text-gray-500">Select a booking to see details</div>
          ) : filter==='upcoming' ? (
            <div className="bg-white rounded-3xl shadow p-10 space-y-6 max-w-full break-words">
              <h2 className="text-2xl font-semibold text-gray-900 break-words">{current.venue?.name}</h2>
              <p className="text-gray-600">
                <strong>{new Date(current.dateFrom).toLocaleDateString()}</strong> – <strong>{new Date(current.dateTo).toLocaleDateString()}</strong>
              </p>
              <button
                onClick={() => setBookings(prev=>prev.filter(b=>b.id!==current.id))}
                className="px-5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition font-medium">
                Cancel booking
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow p-4 space-y-6 max-w-full overflow-wrap:break-word">
          <h2 className="text-xl font-semibold break-words whitespace-normal max-w-[32ch]">
                Review your stay at <span className="text-purple-600">{current.venue?.name}</span>
              </h2>

              {RATING_ASPECTS.map(a => (
                <div key={a} className="flex items-center">
                  <span className="w-32 text-sm font-medium text-gray-700">{a}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => {
                      const filled = (draft[current.id]?.[a] || 0) >= i;
                      return (
                        <span key={i}
                          onClick={() => setRating(current.id,a,i)}
                          className={`material-symbols-outlined text-xl cursor-pointer select-none transition-transform hover:scale-110 ${filled ? 'text-purple-600' : 'text-gray-300'}`}
                          style={{fontVariationSettings:`'FILL' ${filled?1:0}`}}>
                          star
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}

              <textarea
                value={draft[current.id]?.comment || ''}
                onChange={e => setComment(current.id,e.target.value)}
                placeholder="Write your review…"
                className="w-full h-24 rounded-2xl border border-gray-300 p-4 focus:ring-4 focus:ring-purple-200 outline-none resize-none" />

              <button
                onClick={() => submitReview(current.id)}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
                Submit Review
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
