import React, { useState } from "react";
import EditVenueButton from "../../ui/buttons/EditVenueButton";
import DeleteVenueButton from "../../ui/buttons/DeleteVenueButton";
import { FAC_OPTIONS } from "../../constants/VenueFormConfig";

export default function VenueCard({ venue, onDeleteVenue, onEditVenue, onViewVenue }) {
  if (!venue) return null;

  const [showBookings, setShowBookings] = useState(false);

  const facilities = venue.facilities || [];
  const icons = facilities
    .map(key => FAC_OPTIONS.find(opt => opt.key === key))
    .filter(Boolean);

  const maxGuests = venue.maxGuests || 1;
  const bookingCount = venue.bookings?.length || 0;
  const badgeColor = bookingCount > 0 ? "bg-green-600" : "bg-red-600";

  const imageUrl = venue.media?.[0]?.url || "https://via.placeholder.com/400x250?text=No+Image";
  const imageAlt = venue.media?.[0]?.alt || venue.name || "Venue image";

  // Klikk på kortet for å gå til venue (ikke hvis klikker på action-knappene)
  const handleCardClick = e => {
    if (
      e.target.closest(".action-btn") ||
      e.target.closest(".delete-btn") ||
      e.target.closest(".dropdown-bookings")
    ) return;
    if (onViewVenue) onViewVenue(venue.id);
  };

  return (
    <article
      className="group flex flex-row items-stretch bg-white border border-gray-100 rounded-2xl shadow hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer w-full max-w-2xl h-full min-h-[190px]"
      tabIndex={0}
      role="button"
      aria-label={`View venue ${venue.name}`}
      onClick={handleCardClick}
    >
      {/* Bilde til venstre */}
      <div className="relative w-44 h-44 min-w-[11rem] flex-shrink-0 bg-gray-100">
        <img
          src={imageUrl}
          alt={imageAlt}
          className="object-cover w-full h-full rounded-l-2xl transition-transform duration-300 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full text-white shadow border ${badgeColor}`}
          aria-label={`${bookingCount} booking${bookingCount !== 1 ? "s" : ""}`}
        >
          {bookingCount} booking{bookingCount !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Info og actions */}
      <div className="flex-1 flex flex-col justify-between px-6 py-4 h-full">
        <div>
          <h3 className="text-lg font-bold text-gray-900 truncate mb-0.5">{venue.name}</h3>
          <p className="text-xs text-gray-500 truncate mb-1">
            {[venue.location?.city, venue.location?.country].filter(Boolean).join(', ')}
          </p>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
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

        {/* Actions og bookings */}
        <div className="flex justify-end gap-3 pt-2 relative">
          <EditVenueButton
            onClick={e => {
              e.stopPropagation();
              onEditVenue(venue.id);
            }}
            className="action-btn"
            aria-label="Edit venue"
            title="Edit venue"
          />
          {/* Kalender dropdown */}
          <button
            onClick={e => {
              e.stopPropagation();
              setShowBookings(v => !v);
            }}
            className="action-btn flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-teal-100 text-teal-700 transition shadow"
            title="Show bookings"
            aria-label="Show bookings"
            type="button"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              event
            </span>
          </button>
          {/* Bookings dropdown */}
          {showBookings && bookingCount > 0 && (
            <div
              className="dropdown-bookings absolute z-20 right-0 top-12 bg-white shadow-xl border rounded-xl px-5 py-3 w-72 space-y-3"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
              aria-label="Bookings"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">Bookings</span>
                <button
                  className="text-gray-400 hover:text-red-400 focus:outline-none"
                  aria-label="Close"
                  onClick={() => setShowBookings(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {venue.bookings.map(b => (
                <div key={b.id} className="border-b pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-gray-700">
                      {new Date(b.dateFrom).toLocaleDateString()} - {new Date(b.dateTo).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {b.customer?.name || "Unknown"}
                    </span>
                  </div>
                  <button
                    onClick={() => window.confirm("Implement cancel booking her!")}
                    className="mt-1 px-2 py-0.5 rounded bg-red-50 text-red-600 text-xs hover:bg-red-100"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}

          <DeleteVenueButton
            venueId={venue.id}
            onDeleted={() => onDeleteVenue(venue.id)}
            className="delete-btn"
            aria-label="Delete venue"
            title="Delete venue"
          />
        </div>
      </div>
    </article>
  );
}
