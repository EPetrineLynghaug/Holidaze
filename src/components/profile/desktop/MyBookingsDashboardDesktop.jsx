import  { useState } from 'react';
import useBookings from '../../../hooks/api/useBookings';
import { OrderCancelledPopup } from '../../ui/popup/OrderCancelledPopup';

const FILTERS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'expired',  label: 'Past'     },
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

export default function MyBookingsDashboardDesktop({ onClose, userName }) {
  const { bookings, loading, error, cancelBooking } = useBookings(userName);

  const [filter, setFilter]                 = useState('upcoming');
  const [selectedId, setSelectedId]         = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);

  // Partition into upcoming vs expired
  const today        = new Date();
  const isExpired    = b => new Date(b.dateTo) < today;
  const upcomingList = bookings.filter(b => !isExpired(b));
  const pastList     = bookings.filter(isExpired);
  const list         = filter === 'expired' ? pastList : upcomingList;
  const current      = list.find(b => b.id === selectedId);

  const handleDelete = (id, reason) => {
    cancelBooking(id);
    setCancelBookingId(null);
    if (selectedId === id) setSelectedId(null);
    console.log('Cancelled with reason:', reason);
  };

  return (
    <main className="w-full pl-2 pr-2">
      {/* Cancel Popup */}
      {cancelBookingId && (
        <OrderCancelledPopup
          onClose={() => setCancelBookingId(null)}
          onConfirm={reason => handleDelete(cancelBookingId, reason)}
        />
      )}

      {/* Header */}
      <header className="flex justify-between items-center my-8">
        <div className="space-y-2 text-left">
          <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Your bookings and history.</p>
        </div>
       
      </header>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setSelectedId(null); }}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${
              filter === f.key
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 ring-1 ring-gray-300'
            }`}
          >
            {f.label} ({f.key === 'upcoming' ? upcomingList.length : pastList.length})
          </button>
        ))}
      </div>

      {/* Status */}
      {error   && <p className="text-red-600 mt-4">Error: {error}</p>}
      {loading && <p className="text-gray-500 mt-4">Loading bookings...</p>}

      {/* Empty state */}
      {!loading && bookings.length === 0 && (
        <Section icon="info" title="No Bookings Yet">
          <p className="text-gray-600">You haven't made any bookings yet.</p>
        </Section>
      )}

      {/* Bookings Section */}
      {bookings.length > 0 && (
        <Section
          icon={filter === 'upcoming' ? 'event_available' : 'history'}
          title={filter === 'upcoming' ? 'Upcoming Bookings' : 'Past Bookings'}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* List */}
            <div className="md:col-span-8 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 pr-3 max-h-[calc(100vh-250px)]">
              <ul className="space-y-5">
                {list.map(b => (
                  <li
                    key={b.id}
                    onClick={() => setSelectedId(b.id)}
                    className={`w-full p-5 border rounded-xl flex flex-col gap-1 min-h-[80px] cursor-pointer transition hover:shadow-md ${
                      b.id === selectedId ? 'bg-purple-50 border-purple-600' : 'border-gray-300'
                    }`}
                  >
                    <div className="text-gray-800 font-medium text-sm md:text-base">
                      {b.venue?.name}
                    </div>
                    <div className="text-gray-500 text-xs md:text-sm">
                      {new Date(b.dateFrom).toLocaleDateString()} –{' '}
                      {new Date(b.dateTo).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Details panel */}
            <div className="md:col-span-4 self-start mt-[-1.5rem] overflow-y-auto max-h-[calc(100vh-250px)] flex flex-col ">
              {current ? (
                <Section
                  icon={filter === 'upcoming' ? 'event' : 'history'}
                  title={filter === 'upcoming' ? 'Upcoming Booking' : 'Past Booking'}
                >
                  {/* Image */}
                  <div className="relative h-62 lg:h-40 min-w-70 overflow-hidden rounded-lg">
                    {current.venue?.media?.[0]?.url ? (
                      <img
                        src={current.venue.media[0].url}
                        alt={current.venue.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                        <span className="material-symbols-outlined text-5xl">image</span>
                      </div>
                    )}
                  </div>

                  {/* Key details */}
                  <div className="mt-4 space-y-2 text-gray-600 text-sm">
                    <p>
                      <span className="font-semibold">
                        {new Date(current.dateFrom).toLocaleDateString()} –{' '}
                        {new Date(current.dateTo).toLocaleDateString()}
                      </span>
                    </p>
                    {current.venue?.location?.address && (
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined">location_on</span>
                        {current.venue.location.address}
                      </p>
                    )}
                    {current.venue?.owner?.name && (
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined">person</span>
                        Host: {current.venue.owner.name}
                      </p>
                    )}
                    {current.venue?.price && (
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined">payments</span>
                        {current.venue.price.toLocaleString()} NOK per night
                      </p>
                    )}
                    {current.venue?.maxGuests && (
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined">group</span>
                        {current.venue.maxGuests} guests
                      </p>
                    )}
                    {current.guests && (
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined">event_seat</span>
                        {current.guests} guests booked
                      </p>
                    )}
                  </div>

                  {/* Cancel button */}
                  {filter === 'upcoming' && (
                    <button
                      onClick={() => setCancelBookingId(current.id)}
                      className="mt-6 px-5 py-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
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
      )}
    </main>
  );
}
