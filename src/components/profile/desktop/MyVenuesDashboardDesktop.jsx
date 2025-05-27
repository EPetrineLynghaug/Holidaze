import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingCancelledPopup from "../../ui/popup/BookingCancelledPopup";
import VenueCard from "../shared/VenueCard";
import useManageVenues from "../../../hooks/api/useVenues";



const Section = ({ icon, title, children }) => (
  <section className="bg-white shadow rounded-lg p-6 md:p-8 space-y-6 ring-1 ring-gray-100">
    <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-purple-700">
      <span className="material-symbols-outlined text-purple-600" aria-hidden>
        {icon}
      </span>
      {title}
    </h2>
    {children}
  </section>
);

export default function MyVenuesDashboardDesktop() {
  const navigate = useNavigate();
  const { venues, setVenues, loading, error } = useManageVenues(); 
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const view = id => navigate(`/venues/${id}`);
  const edit = id => navigate(`/venues/${id}/edit`);
  const delV = id => setVenues(prev => prev.filter(v => v.id !== id));

  // Sletter booking fra rett venue sitt bookings-array
  const delB = bookingId => {
    setVenues(prev =>
      prev.map(v => ({
        ...v,
        bookings: Array.isArray(v.bookings)
          ? v.bookings.filter(b => b.id !== bookingId)
          : []
      }))
    );
    setSelectedBookingId(null);
  };

  return (
    <main className="w-full max-h-screen overflow-y-auto scrollbar-hide bg-gray-50">
      <div className="w-full max-w-7xl mx-auto mt-10 mb-20 px-4 md:px-8 space-y-10">
        <header className="space-y-2 text-left">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            My Venues
          </h1>
          <p className="text-gray-600">
            All your listings and booking history.
          </p>
        </header>
        <Section icon="location_city" title="Your Venues">
          <div className="w-full flex flex-col gap-8">
            {loading ? (
              <p className="text-center text-gray-500 py-20">Loading…</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : venues.length === 0 ? (
              <div className="text-gray-600 text-sm">
                <p>You haven't listed any venues yet.</p>
              </div>
            ) : (
              venues.filter(Boolean).map(v => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  onDeleteVenue={delV}
                  onEditVenue={edit}
                  onViewVenue={view}
                  onRequestCancelBooking={setSelectedBookingId}
                />
              ))
            )}
          </div>
        </Section>

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
