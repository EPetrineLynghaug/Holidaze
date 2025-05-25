import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteVenueButton from '../../ui/buttons/DeleteVenueButton';
import EditVenueButton from '../../ui/buttons/EditVenueButton';
import BookingBadge from '../../ui/styles/BookingBadge'; 
import { getAccessToken } from '../../../services/tokenService';
import { FAC_OPTIONS } from '../../constants/VenueFormConfig';

export default function ActiveItemsSection({ venues, loading, error, onDelete, onEdit }) {
  const navigate = useNavigate();
  const [items, setItems] = useState(venues || []);

  useEffect(() => {
    setItems(venues || []);
  }, [venues]);

  const handleUpdated = updated => {
    setItems(prev => prev.map(v => (v.id === updated.id ? updated : v)));
  };

  if (loading) return <p className="text-center text-gray-500" aria-live="polite">Loading...</p>;
  if (error) return <p className="text-center text-red-600" role="alert">{error}</p>;
  if (!items.length) return <p className="text-center text-gray-500" aria-live="polite">No active items.</p>;

  return (
    <section className="mt-8 mb-[40px]">
      <h3 className="text-2xl font-semibold mb-6">Your Active Listings</h3>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => {
          const {
            id,
            name = 'Untitled',
            maxGuests = 0,
            media = [],
            location = {},
            bookings = [],
            type = 'House',
            facilities = [],
          } = item;

          const imgUrl = media[0]?.url || 'https://via.placeholder.com/400x200?text=No+Image';
          const { city = '', country = '' } = location;
          const bookingCount = bookings.length;

          const facilityOptions = facilities
            .map(key => FAC_OPTIONS.find(o => o.key === key))
            .filter(Boolean);
          const iconsToShow = facilityOptions.slice(0, 3);
          const extraCount = facilityOptions.length - iconsToShow.length;

          return (
            <article
              key={id}
              tabIndex={0}
              role="button"
              aria-label={`View venue ${name}`}
              onClick={e => {
                if (
                  e.target.closest('.action-btn') ||
                  e.target.closest('.delete-btn')
                ) {
                  return;
                }
                navigate(`/venues/${id}`);
              }}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-200 overflow-hidden cursor-pointer relative focus:ring-2 focus:ring-purple-300 mb-10"
            >
              {/* Bilde */}
              <div className="relative w-full aspect-[3/2] overflow-hidden">
                <img
                  src={imgUrl}
                  alt={name}
                  className="object-cover w-full h-full rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                />
                {/* Booking badge (NY) */}
                <div className="absolute top-4 left-4">
                  <BookingBadge count={bookingCount} />
                </div>
              </div>

              {/* Innhold */}
              <div className="flex-1 flex flex-col gap-1 px-5 py-4 pb-5 relative">
                <h4 className="text-lg font-bold text-gray-900 truncate mb-0.5">{name}</h4>
                {(city || country) && (
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    {[city, country].filter(Boolean).join(', ')}
                  </p>
                )}

                {/* Facilities & type */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-700">
                    <span className="material-symbols-outlined text-base" aria-hidden="true">home</span>
                    {type}
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-xs text-gray-700">
                    <span className="material-symbols-outlined text-base" aria-hidden="true">king_bed</span>
                    {maxGuests}
                  </span>
                  {iconsToShow.map(opt => (
                    <span
                      key={opt.key}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-purple-700"
                      title={opt.label}
                    >
                      <span className="material-symbols-outlined text-base" aria-hidden="true">{opt.icon}</span>
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-50 text-gray-400 text-xs">
                      +{extraCount}
                    </span>
                  )}
                </div>

                {/* Edit & Delete knappene */}
                <div className="absolute bottom-7 right-5 flex gap-4 z-10">
                  <EditVenueButton
                    onClick={() => onEdit(item, handleUpdated)}
                    className="action-btn"
                  />
                  <DeleteVenueButton
                    venueId={id}
                    accessToken={getAccessToken()}
                    onDeleted={() => setItems(prev => prev.filter(v => v.id !== id))}
                    className="delete-btn"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
