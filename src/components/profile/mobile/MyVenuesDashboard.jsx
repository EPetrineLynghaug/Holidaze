import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PROFILE_BY_NAME_VENUES_URL } from '../../constants/api';
import { getAccessToken } from '../../../services/tokenService';
import BookingCancelledPopup from '../../ui/mobildemodal/BookingCancelledPopup';
import VenueCard from '../shared/VenueCard'; 
export default function MyVenuesDashboard() {
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
              'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
            },
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
    <div className="p-4 max-w-xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Venues</h1>
        <p className="text-gray-600 text-sm">All your listings and booking history.</p>
      </header>

      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-gray-500 py-20">Loading…</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : venues.length === 0 ? (
          <p className="italic text-gray-500 text-center">You haven’t listed any venues yet.</p>
        ) : (
          venues.map(v => (
            <VenueCard
              key={v.id}
              venue={v}
              onDeleteVenue={delV}
              onEditVenue={edit}
              onViewVenue={view}
              onAskCancel={bid => setSelectedBookingId(bid)}
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
