import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import DeleteVenueButton from '../../ui/buttons/DeleteVenueButton';
import { getAccessToken } from '../../../services/tokenService';
import { FAC_OPTIONS } from '../../constants/VenueFormConfig';

export default function ActiveVenuesSection({ venues, loading, error, onDelete, onEdit }) {
  const navigate = useNavigate();
  
  const [localVenues, setLocalVenues] = useState(venues || []);

 
  useEffect(() => {
    setLocalVenues(venues || []);
  }, [venues]);


  const handleUpdated = updatedVenue => {
    setLocalVenues(prev => prev.map(v => (v.id === updatedVenue.id ? updatedVenue : v)));
  };

  if (loading) return <p className="text-center text-gray-500">Loading venues...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!localVenues.length) return <p className="text-center text-gray-500">No active venues.</p>;

  return (
    <section className="mt-6">
      <h3 className="text-2xl font-semibold mb-4">Active Venues</h3>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {localVenues.map(venue => {
          const {
            id,
            name = 'Untitled Venue',
            maxGuests = 0,
            media = [],
            location = {},
            bookings = [],
            type = 'House',
            facilities = []
          } = venue;

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
            <article key={id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
              <div className="relative h-52 w-full">
                <Link to={`/venues/${id}`} className="block h-full w-full">
                  <img
                    src={imgUrl}
                    alt={name}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                  <span
                    className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-md text-white"
                    style={{ backgroundColor: bgColor }}
                  >
                    {bookingText}
                  </span>
                </Link>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                  <h4 className="text-xl font-bold text-gray-900 truncate">{name}</h4>
                  {(city || country) && (
                    <p className="text-sm text-gray-500 truncate mb-1">
                      {[city, country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 text-gray-700 text-sm mb-4">
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
                <nav className="mt-auto pt-3 border-t border-gray-200 flex justify-between text-sm text-indigo-600">
                  <button
                    onClick={() => navigate(`/venues/${id}`)}
                    className="hover:underline"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(venue, handleUpdated)}
                    className="hover:underline"
                  >
                    Edit
                  </button>
                  <DeleteVenueButton
                    venueId={id}
                    accessToken={getAccessToken()}
                    onDeleted={() => setLocalVenues(vs => vs.filter(v => v.id !== id))}
                    className="hover:underline text-red-600"
                  >
                    Delete
                  </DeleteVenueButton>
                </nav>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
