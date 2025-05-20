import React, { useState } from "react";
import EditVenueButton from "../../ui/buttons/EditVenueButton";
import DeleteVenueButton from "../../ui/buttons/DeleteVenueButton";
import BookingBadge from "../../ui/styles/BookingBadge";
import { FAC_OPTIONS } from "../../constants/VenueFormConfig";

export default function VenueCard({ venue, onDeleteVenue, onEditVenue, onViewVenue }) {
  if (!venue) return null;
  const [showBookings, setShowBookings] = useState(false);

  const facilities = venue.facilities || [];
  const icons = facilities.map(key => FAC_OPTIONS.find(opt => opt.key === key)).filter(Boolean);
  const maxGuests = venue.maxGuests || 1;
  const bookingCount = venue.bookings?.length || 0;
  const imageUrl = venue.media?.[0]?.url || "https://via.placeholder.com/400x250?text=No+Image";
  const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue image";

  // Card click navigerer, men ikke på knapper/dropdown
  const handleCardClick = e => {
    if (
      e.target.closest(".action-btn") ||
      e.target.closest(".delete-btn")
    ) return;
    if (onViewVenue) onViewVenue(venue.id);
  };

  return (
    <article
      className="group flex flex-col md:flex-row items-stretch bg-white border border-gray-100 rounded-2xl shadow hover:shadow-xl transition-all duration-200 overflow-visible cursor-pointer w-full max-w-4xl mx-auto mb-8"
      tabIndex={0}
      role="button"
      aria-label={`View venue ${venue.name}`}
      onClick={handleCardClick}
      style={{ minHeight: 180 }}
    >
      {/* Bilde til venstre */}
      <div className="relative w-full md:w-60 min-w-[160px] h-44 md:h-auto flex-shrink-0 bg-gray-100">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="object-cover w-full h-full md:rounded-l-2xl rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-10">
          <BookingBadge count={bookingCount} />
        </div>
      </div>

      {/* Info og actions */}
      <div className="flex-1 flex flex-col justify-between px-5 py-4 h-full relative">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 break-words mb-1">
            {venue.name}
          </h3>
          <p className="text-xs text-gray-500 truncate mb-2">
            {[venue.location?.city, venue.location?.country].filter(Boolean).join(', ')}
          </p>
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <div className="flex flex-col items-center" title={`Max guests: ${maxGuests}`}>
              <span className="material-symbols-outlined text-lg text-purple-700">king_bed</span>
              <span className="text-xs text-gray-700">{maxGuests}</span>
            </div>
            {icons.map(opt => (
              <span
                key={opt.key}
                className="flex flex-col items-center"
                title={opt.label}
                aria-label={opt.label}
              >
                <span className="material-symbols-outlined text-lg text-purple-700">{opt.icon}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <EditVenueButton
            onClick={e => {
              e.stopPropagation();
              onEditVenue(venue.id);
            }}
            className="action-btn"
            aria-label="Edit venue"
            title="Edit venue"
          />
          {/* Kalender knapp */}
          <button
            onClick={e => {
              e.stopPropagation();
              setShowBookings(v => !v);
            }}
            className={`action-btn flex items-center justify-center w-9 h-9 rounded-full ${showBookings ? "bg-teal-200" : "bg-gray-100"} hover:bg-teal-100 text-teal-700 transition shadow`}
            title="Show bookings"
            aria-label="Show bookings"
            type="button"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              event
            </span>
          </button>
          <DeleteVenueButton
            venueId={venue.id}
            onDeleted={() => onDeleteVenue(venue.id)}
            className="delete-btn"
            aria-label="Delete venue"
            title="Delete venue"
          />
        </div>

        {/* Bookings accordion/toggle */}
        {showBookings && (
          <div className="w-full mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-inner transition-all max-h-96 overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-lg text-gray-800">Bookings</span>
              <button
                className="text-gray-400 hover:text-red-400 focus:outline-none"
                aria-label="Close"
                onClick={() => setShowBookings(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            {bookingCount === 0 ? (
              <p className="text-gray-500 text-sm">No bookings yet.</p>
            ) : (
              venue.bookings.map(b => (
                <div
                  key={b.id}
                  className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="flex flex-col text-sm w-full">
                    <span className="font-semibold text-gray-700">
                      {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">{b.customer?.name || "Unknown"}</span>
                  </div>
                  <button
                    onClick={() => window.confirm("Implement cancel booking her!")}
                    className="px-3 py-1 rounded bg-red-50 text-red-600 text-xs hover:bg-red-100 whitespace-nowrap"
                  >
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </article>
  );
}
