import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PROFILE_BY_NAME_VENUES_URL } from '../../constants/api';
import { getAccessToken } from '../../../services/tokenService';
import useBookingRanges from '../../../hooks/useBookingRanges';
import BookingCancelledPopup from '../../ui/mobildemodal/BookingCancelledPopup';

function VenueRow({ venue, onDeleteVenue, onEditVenue, onViewVenue, onAskCancel }) {
  const { bookingRanges } = useBookingRanges(venue.bookings);
  const [open, setOpen] = useState(false);
  const now = new Date();
  const current = bookingRanges.find(r => r.startDate <= now && r.endDate >= now);
  const next = bookingRanges.find(r => r.startDate > now);
  const latest = bookingRanges.at(-1);

  let status = 'Never booked';
  let statusDetail = '—';

  if (current) {
    status = 'Rented';
    const daysLeft = Math.ceil((current.endDate - now) / (1000 * 60 * 60 * 24));
    statusDetail = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  } else if (next) {
    status = 'Upcoming';
    const daysUntil = Math.ceil((next.startDate - now) / (1000 * 60 * 60 * 24));
    statusDetail = `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  } else if (latest) {
    status = 'Previously booked';
    const daysAgo = Math.ceil((now - latest.endDate) / (1000 * 60 * 60 * 24));
    statusDetail = `last booked ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  }

  const bookingCount = venue.bookings.length;
  const badgeColor = bookingCount > 0 ? 'bg-green-600' : 'bg-red-600';

  return (
    <section className="bg-white shadow rounded-xl ring-1 ring-gray-100 p-6 space-y-4">
      <div className="grid grid-cols-12 gap-4 items-center">
        <img
          src={venue.media[0]?.url}
          alt={venue.media[0]?.alt || venue.name}
          className="col-span-2 h-20 w-full object-cover rounded-lg"
        />
        <div className="col-span-4">
          <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
          <p className="text-sm text-gray-500">{venue.location.city}, {venue.location.country}</p>
        </div>
        <div className="col-span-3 space-y-1">
          <p className="text-sm font-medium">{status}</p>
          <p className="text-xs text-gray-500 italic">{statusDetail}</p>
          <span
            className={`inline-block text-xs font-medium text-white px-2 py-0.5 rounded-full ${badgeColor}`}
            aria-label={`${bookingCount} bookings`}
          >
            {bookingCount} booking{bookingCount !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="col-span-3 flex justify-end space-x-3 text-sm">
          {bookingCount > 0 && (
            <button
              onClick={() => setOpen(!open)}
              className="text-purple-600 hover:underline"
              aria-expanded={open}
              aria-controls={`bookings-${venue.id}`}
              aria-label={open ? 'Hide bookings' : 'Show bookings'}
            >
              {open ? 'Hide' : 'Show'}
            </button>
          )}
          <button onClick={() => onViewVenue(venue.id)} className="text-blue-600 hover:underline">
            View
          </button>
          <button onClick={() => onEditVenue(venue.id)} className="text-yellow-600 hover:underline">
            Edit
          </button>
          <button onClick={() => onDeleteVenue(venue.id)} className="text-red-600 hover:underline">
            Delete
          </button>
        </div>
      </div>

      {open && bookingCount > 0 && (
        <div
          id={`bookings-${venue.id}`}
          className="mt-4 space-y-3 max-h-60 overflow-y-auto"
        >
          {venue.bookings.map((b) => (
            <div
              key={b.id}
              className="bg-gray-50 px-4 py-3 rounded-lg"
            >
              <p className="text-sm">
                <strong>Date:</strong>{' '}
                {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Booked by:</strong> {b.customer?.name || 'Unknown'}
              </p>
              {b.customer?.email && (
                <p className="text-xs text-gray-500">
                  <strong>Email:</strong> {b.customer.email}
                </p>
              )}
              <button
                onClick={() => onAskCancel(b.id)}
                className="mt-2 inline-block text-xs font-medium text-red-600 hover:underline"
              >
                Cancel booking
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function MyVenuesDashboardDesktop() {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) return navigate('/', { replace: true });
        const user = JSON.parse(stored);
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true&_customer=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
            }
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const { data } = await res.json();
        const withBookings = data.map(v => ({ ...v, bookings: v.bookings || [] }));
        const sorted = withBookings.sort((a, b) => new Date(b.created) - new Date(a.created));
        setVenues(sorted);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const view = id => navigate(`/venues/${id}`);
  const edit = id => navigate(`/venues/${id}/edit`);
  const delV = id => setVenues(prev => prev.filter(v => v.id !== id));
  const delB = bid => {
    setVenues(prev =>
      prev.map(v => ({
        ...v,
        bookings: v.bookings.filter(b => b.id !== bid),
      }))
    );
    setSelectedBookingId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-10 mb-20 px-4 md:px-8">
      <header className="mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900">My Venues</h1>
        <p className="text-gray-600">All your listings and booking history.</p>
      </header>

      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
        {loading ? (
          <p className="text-center text-gray-500 py-20">Loading…</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : venues.length === 0 ? (
          <p className="italic text-gray-500">You haven't listed any venues yet.</p>
        ) : (
          venues.map(v => (
            <VenueRow
              key={v.id}
              venue={v}
              onDeleteVenue={delV}
              onEditVenue={edit}
              onViewVenue={view}
              onAskCancel={(bid) => setSelectedBookingId(bid)}
            />
          ))
        )}
      </div>

      {selectedBookingId && (
        <BookingCancelledPopup
          onClose={() => setSelectedBookingId(null)}
          onConfirm={() => delB(selectedBookingId)}
        />
      )}
    </div>
  );
}
