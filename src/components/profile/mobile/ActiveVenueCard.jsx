import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import DeleteVenueButton from '../../ui/buttons/DeleteVenueButton';
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

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!items.length) return <p className="text-center text-gray-500">No active items.</p>;

  return (
    <section className="mt-8">
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
          const bookingText = `${bookingCount} booking${bookingCount !== 1 ? 's' : ''}`;
          const bgColor = bookingCount > 0 ? '#4CAF50' : '#DC3545';

          const facilityOptions = facilities
            .map(key => FAC_OPTIONS.find(o => o.key === key))
            .filter(Boolean);
          const iconsToShow = facilityOptions.slice(0, 3);
          const extraCount = facilityOptions.length - iconsToShow.length;

          return (
            <article
              key={id}
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition duration-300 flex flex-col overflow-hidden"
            >
              <Link to={`/venues/${id}`} className="relative block w-full h-40 overflow-hidden">
                <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
                <span
                  className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: bgColor }}
                >
                  {bookingText}
                </span>
              </Link>

              <div className="p-5 flex flex-col flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{name}</h4>
                {(city || country) && (
                  <p className="text-sm text-gray-500 mb-3 truncate">
                    {[city, country].filter(Boolean).join(', ')}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">home</span>
                    {type}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">king_bed</span>
                    {maxGuests}
                  </div>
                  {iconsToShow.map(opt => (
                    <span key={opt.key} className="material-symbols-outlined text-base" title={opt.label}>
                      {opt.icon}
                    </span>
                  ))}
                  {extraCount > 0 && (
                    <span className="text-xs text-gray-400">+{extraCount}</span>
                  )}
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-4 justify-end text-sm">
                    <button
                      onClick={() => navigate(`/venues/${id}`)}
                      className="text-indigo-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => onEdit(item, handleUpdated)}
                      className="text-gray-600 hover:underline"
                    >
                      Edit
                    </button>
                    <DeleteVenueButton
                      venueId={id}
                      accessToken={getAccessToken()}
                      onDeleted={() => setItems(prev => prev.filter(v => v.id !== id))}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </DeleteVenueButton>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
