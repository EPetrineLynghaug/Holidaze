import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useBookings from '../../../hooks/api/useBookings';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'expired', label: 'Past' },
];

const Section = ({ icon, title, children }) => (
  <section className="w-full bg-white shadow rounded-lg p-6 space-y-5 ring-1 ring-gray-100">
    <h2 className="flex items-center gap-2 text-xl font-semibold text-purple-700">
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
  const { bookings, setBookings, loading, error } = useBookings(userName);

  const [filter, setFilter] = useState('upcoming');
  const [selected, setSelected] = useState(null);

  const today = new Date();
  const upcomingList = bookings.filter(b => new Date(b.dateTo) >= today);
  const pastList = bookings.filter(b => new Date(b.dateTo) < today);
  const list = filter === 'expired' ? pastList : upcomingList;
  const current = list.find(b => b.id === selected);

  return (
    <main className="w-full pl-2 pr-2">
      {/* Header */}
      <header className="flex justify-between items-center my-8">
        <div className="space-y-2 text-left">
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Your bookings and history.</p>
        </div>
        <div className="flex gap-4">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setSelected(null); }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                filter === f.key ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-300'
              }`}
            >
              {f.label} ({f.key === 'upcoming' ? upcomingList.length : pastList.length})
            </button>
          ))}
        </div>
      </header>

      {error && <p className="text-red-600 mt-4">Error: {error}</p>}
      {loading && <p className="text-gray-500 mt-4">Loading bookings...</p>}

      <Section icon="calendar_month" title="Booking Overview">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Booking list – fixed 8/12 width */}
          <div className="md:col-span-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 pr-3 max-h-[calc(100vh-250px)]">
            <ul className="space-y-5">
              {list.map(b => (
                <li
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`w-full p-5 border rounded-xl flex flex-col gap-1 min-h-[80px] cursor-pointer transition hover:shadow-md ${
                    b.id === selected ? 'bg-purple-50 border-purple-600' : 'border-gray-300'
                  }`}
                >
                  <div className="text-gray-800 font-medium text-sm md:text-base">{b.venue?.name}</div>
                  <div className="text-gray-500 text-xs md:text-sm">
                    {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Details panel – fixed 4/12 width */}
          <div className="md:col-span-4 overflow-y-auto max-h-[calc(100vh-250px)] space-y-6">
            {current ? (
              <Section
                icon={filter === 'upcoming' ? 'event' : 'history'}
                title={filter === 'upcoming' ? 'Upcoming Booking' : 'Past Booking'}
              >
                <img
                  src={current.venue?.media[0]?.url}
                  alt={current.venue?.name}
                  className="w-full h-72 object-cover rounded-lg "
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
            ) : (
              <Section icon="info" title="Booking Details">
                <p className="text-gray-500">Select a booking to view details.</p>
              </Section>
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}