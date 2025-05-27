import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useVenues from "../../../hooks/api/useVenues";
import BookingCancelledPopup from "../../ui/popup/BookingCancelledPopup";
import VenueCard from "../shared/VenueCard";

export default function MyVenuesDashboard() {
  const navigate = useNavigate();
  const { venues, loading, error, setVenues } = useVenues(navigate);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Navigasjonshåndterere
  const view = id => navigate(`/venues/${id}`);
  const edit = id => navigate(`/venues/${id}/edit`);
  const delV = id => setVenues(prev => prev.filter(v => v.id !== id));

  // Slett booking (fra riktig venue)
  const delB = bookingId => {
    setVenues(prev =>
      prev.map(v => ({
        ...v,
        bookings: Array.isArray(v.bookings)
          ? v.bookings.filter(b => b.id !== bookingId)
          : [],
      }))
    );
    setSelectedBookingId(null);
  };

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <div className="w-full max-w-3xl mx-auto mt-10 mb-20 px-4 space-y-10">
        <header className="space-y-2 text-left">
          <h1 className="text-2xl font-extrabold text-gray-900">My Venues</h1>
          <p className="text-gray-600 text-sm">
            All your listings and booking history.
          </p>
        </header>

        <div className="w-full flex flex-col gap-8">
          {loading ? (
            <p className="text-center text-gray-500 py-20">Loading…</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : venues.length === 0 ? (
            <div className="italic text-gray-500 text-center">
              You haven't listed any venues yet.
            </div>
          ) : (
            venues.filter(Boolean).map(v => (
              <VenueCard
                key={v.id}
                venue={v}
                onDeleteVenue={delV}
                onEditVenue={edit}
                onViewVenue={view}
                onRequestCancelBooking={setSelectedBookingId} // Dette åpner popup!
              />
            ))
          )}
        </div>

        {/* Cancel Booking Popup */}
        {selectedBookingId && (
          <BookingCancelledPopup
            onClose={() => setSelectedBookingId(null)}
            onConfirm={() => delB(selectedBookingId)}
          />
        )}
      </div>
    </main>
  );
}
