import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import useVenues from '../../../hooks/api/useVenues';
import BookingCancelledPopup from '../../ui/mobildemodal/BookingCancelledPopup';
import VenueCard from '../shared/VenueCard'; 

export default function MyVenuesDashboard() {
  const navigate = useNavigate();
  const { venues, loading, error, setVenues } = useVenues(navigate);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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
