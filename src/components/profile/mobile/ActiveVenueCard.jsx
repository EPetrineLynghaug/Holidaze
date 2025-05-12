import React from 'react';
import DeleteVenueButton from '../../ui/buttons/DeleteVenueButton';
import { FAC_OPTIONS } from '../../constants/VenueFormConfig';

export default function ActiveVenuesSection({ venues, loading, error, onDelete, onEdit }) {
  if (loading) return <p className="text-center text-gray-500">Loading venues...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!venues?.length) return <p className="text-center text-gray-500">No active venues.</p>;

  return (
    <section className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Active Venues</h3>
      <div className="grid gap-6">
        {venues.map((venue) => {
          const {
            id,
            name = 'Untitled Venue',
            maxGuests = 0,
            media = [],
            location = {},
            bookings = [],
            type = 'House',
            facilities = [],
          } = venue;

          const imgUrl = media[0]?.url || 'https://via.placeholder.com/400x200?text=No+Image';
          const { city = '', country = '' } = location;
          const bookingCount = bookings.length;
          const bookingText  = `${bookingCount} booking${bookingCount !== 1 ? 's' : ''}`;
          const textColor    = bookingCount > 0 ? '#4B9152' : '#8B1C1C';
          const bgColor      = bookingCount > 0 ? 'rgba(163,217,165,0.6)' : 'rgba(233,107,107,0.4)';

          const facilityOptions = facilities
            .map(key => FAC_OPTIONS.find(o => o.key === key))
            .filter(Boolean);
          const iconsToShow = facilityOptions.slice(0, 3);
          const extraCount = facilityOptions.length - iconsToShow.length;

          return (
            <article
              key={id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <img
                  src={imgUrl}
                  alt={name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xl font-semibold text-gray-900 truncate">{name}</h4>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      backgroundColor: bgColor,
                      borderRadius: '5px',
                    }}
                  >
                    <span style={{ color: textColor }}>●</span>
                    <span className="font-semibold" style={{ color: textColor }}>
                      {bookingText}
                    </span>
                    <span style={{ color: textColor }}>●</span>
                  </span>
                </div>
                {(city || country) && (
                  <p className="text-sm text-gray-500 truncate mb-2">
                    {[city, country].filter(Boolean).join(', ')}
                  </p>
                )}
                <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">home</span>
                    {type}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">king_bed</span>
                    {maxGuests} Beds
                  </span>
                  {iconsToShow.map(opt => (
                    <span key={opt.key} className="material-symbols-outlined text-base" title={opt.label}>
                      {opt.icon}
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="text-xs text-gray-500">+{extraCount}</span>
                  )}
                </div>
                <nav className="mt-auto pt-4 border-t border-gray-100 flex justify-between text-sm text-indigo-600">
                  <button onClick={() => onEdit(venue)} className="hover:underline">Edit</button>
                  <DeleteVenueButton
                    venueId={id}
                    onDeleted={() => onDelete(id)}
                    className="hover:underline text-red-600"
                  >Delete</DeleteVenueButton>
                </nav>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
