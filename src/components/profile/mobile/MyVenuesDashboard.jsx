import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PROFILE_BY_NAME_VENUES_URL } from '../../constants/api';
import { getAccessToken } from '../../../services/tokenService';
import BookingCancelledPopup from '../../ui/mobildemodal/BookingCancelledPopup';

function VenueCard({ venue, onDeleteVenue, onEditVenue, onViewVenue, onAskCancel }) {
  const [open, setOpen] = useState(false);
  const now = new Date();

  const current = venue.bookings?.find(b => new Date(b.dateFrom) <= now && new Date(b.dateTo) >= now);
  const next = venue.bookings?.find(b => new Date(b.dateFrom) > now);
  const latest = venue.bookings?.slice().sort((a, b) => new Date(b.dateTo) - new Date(a.dateTo))[0];

  let status = 'Never booked';
  let statusDetail = '—';

  if (current) {
    status = 'Rented';
    const daysLeft = Math.ceil((new Date(current.dateTo) - now) / (1000 * 60 * 60 * 24));
    statusDetail = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  } else if (next) {
    status = 'Upcoming';
    const daysUntil = Math.ceil((new Date(next.dateFrom) - now) / (1000 * 60 * 60 * 24));
    statusDetail = `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  } else if (latest) {
    status = 'Previously booked';
    const daysAgo = Math.ceil((now - new Date(latest.dateTo)) / (1000 * 60 * 60 * 24));
    statusDetail = `last booked ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  }

  const bookingCount = venue.bookings?.length || 0;
  const badgeColor = bookingCount > 0 ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex items-start gap-4">
        <img
          src={venue.media[0]?.url || 'https://via.placeholder.com/150'}
          alt={venue.media[0]?.alt || venue.name}
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="flex-1 space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{venue.name}</h3>
          <p className="text-sm text-gray-500">{venue.location?.city}, {venue.location?.country}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">{status}</span>
            <span className="text-xs italic text-gray-400">{statusDetail}</span>
            <span className={`text-xs font-medium text-white px-2 py-0.5 rounded-full ${badgeColor}`}>{bookingCount} booking{bookingCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-3 text-sm">
        {bookingCount > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="text-purple-600 hover:underline"
            aria-expanded={open}
            aria-controls={`bookings-${venue.id}`}
            aria-label={open ? 'Hide bookings' : 'Show bookings'}
          >
            {open ? 'Hide bookings' : 'Show bookings'}
          </button>
        )}
        <button onClick={() => onViewVenue(venue.id)} className="text-blue-600 hover:underline">View</button>
        <button onClick={() => onEditVenue(venue.id)} className="text-yellow-600 hover:underline">Edit</button>
        <button onClick={() => onDeleteVenue(venue.id)} className="text-red-600 hover:underline">Delete</button>
      </div>

      {open && bookingCount > 0 && (
        <div
          id={`bookings-${venue.id}`}
          className="mt-4 space-y-3"
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
                className="mt-2 text-xs font-medium text-red-600 hover:underline"
              >
                Cancel booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyVenuesDashboard({ onClose }) {
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
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Venues</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-8">Loading venues...</p>
      ) : error ? (
        <p className="text-center text-red-600 py-8">{error}</p>
      ) : venues.length === 0 ? (
        <p className="italic text-gray-500 text-center">You haven’t listed any venues yet.</p>
      ) : (
        <div className="space-y-6">
          {venues.map(v => (
            <VenueCard
              key={v.id}
              venue={v}
              onDeleteVenue={delV}
              onEditVenue={edit}
              onViewVenue={view}
              onAskCancel={(bid) => setSelectedBookingId(bid)}
            />
          ))}
        </div>
      )}

      {selectedBookingId && (
        <BookingCancelledPopup
          onClose={() => setSelectedBookingId(null)}
          onConfirm={() => delB(selectedBookingId)}
        />
      )}
    </div>
  );
}
