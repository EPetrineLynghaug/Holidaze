
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useBookings from '../../../hooks/api/useBookings';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'expired', label: 'Past' },
];

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
  const storedUser = localStorage.getItem('user');
  const userName = storedUser ? JSON.parse(storedUser).name : null;
  const { bookings, setBookings, loading, error, refetch } = useBookings(userName);
  const [filter, setFilter] = useState('upcoming');
  const [selected, setSelected] = useState(null);

  const today = new Date();
  const upcomingList = bookings.filter(b => new Date(b.dateTo) >= today);
  const pastList = bookings.filter(b => new Date(b.dateTo) < today);
  const list = filter === 'expired' ? pastList : upcomingList;
  const current = list.find(b => b.id === selected);

  return (
    <main className="w-full max-w-7xl mx-auto max-h-screen overflow-y-auto px-6">
      <header className="space-y-2 text-left">
        <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600">Your bookings and history.</p>
      </header>

      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
      {loading && <p className="text-gray-500 mt-4">Loading bookings...</p>}

      <div className="flex gap-4 mt-6">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setSelected(null); }}
            className={`px-6 py-2 rounded-full text-sm font-medium transition ${
              filter === f.key ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-300'
            }`}
          >
            {f.label} ({f.key === 'upcoming' ? upcomingList.length : pastList.length})
          </button>
        ))}
      </div>

      <Section icon="calendar_month" title="Booking Overview">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Booking List */}
          <div className="md:col-span-6 overflow-y-auto max-h-[calc(100vh-260px)]">
            <ul className="space-y-4">
              {list.map(b => (
                <li
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
                    b.id === selected ? 'bg-purple-50 border-purple-600' : 'border-gray-300'
                  }`}
                >
                  <div className="text-gray-800 font-medium">{b.venue?.name}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Details Section */}
          <div className={`md:col-span-6 space-y-6 ${!current ? 'flex items-center justify-center text-gray-500' : ''}`}>
            {!current && 'Select a booking to view details.'}

            {current && (
              <Section
                icon={filter === 'upcoming' ? 'event' : 'history'}
                title={filter === 'upcoming' ? 'Upcoming Booking' : 'Past Booking'}
              >
                <img
                  src={current.venue?.media[0]?.url}
                  alt={current.venue?.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-gray-600 mt-4">
                  <strong>{new Date(current.dateFrom).toLocaleDateString()}</strong> –{' '}
                  <strong>{new Date(current.dateTo).toLocaleDateString()}</strong>
                </p>
                {filter === 'upcoming' && (
                  <button
                    onClick={() => setBookings(prev => prev.filter(item => item.id !== current.id))}
                    className="mt-4 px-5 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  >
                    Cancel Booking
                  </button>
                )}
              </Section>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}
