
import React from 'react';
import { Link } from 'react-router';
import DeleteVenueButton from '../buttons/DeleteVenueButton';
import { getAccessToken } from '../../services/tokenService';


export default function ActiveVenuesSection({ venues, loading, error, onDelete }) {
  const ActiveVenueCard = ({ venue, onDelete }) => {
    if (!venue) return null;

    const {
      id,
      name = 'Untitled venue',
      maxGuests = 0,
      media = [],
      location = {},
      bookings = [],
    } = venue;
    const { city = '', country = '' } = location;
    const booking = bookings[0];

    // hent ut første bilde eller fallback
    const imgUrl =
      media[0]?.url ||
      'https://via.placeholder.com/400x200?text=No+Image';

    return (
      <article className="flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden">
        {/* bilde-banner */}
        <Link to={`/venues/${id}`}>
          <img
            src={imgUrl}
            alt={media[0]?.alt || name}
            className="w-full h-40 object-cover"
          />
        </Link>

        <div className="p-4 space-y-2">
          {/* navn + badge */}
          <div className="flex justify-between items-start">
            <h4 className="text-base font-medium text-gray-900">{name}</h4>
            {booking && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                ● {booking.from}–{booking.to}
              </span>
            )}
          </div>

          {/* lokasjon */}
          {(city || country) && (
            <p className="text-xs text-gray-500">
              {city}{city && country ? ', ' : ''}{country}
            </p>
          )}

          {/* facts-linje */}
          <div className="flex items-center gap-4 pt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-thin">holiday_village</span>
              House
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-thin">bed</span>
              {maxGuests}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-thin">groups</span>
              +{maxGuests}
            </span>
          </div>

          {/* handlinger */}
          <nav className="mt-3 border-t border-gray-100 pt-2 flex justify-between text-xs">
            <Link to={`/venues/${id}`} className="hover:text-violet-600">
              View
            </Link>
            <Link to={`/venues/${id}/edit`} className="hover:text-violet-600">
              Edit
            </Link>
            <DeleteVenueButton
              venueId={id}
              accessToken={getAccessToken()}
              onDeleted={() => onDelete(id)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </DeleteVenueButton>
          </nav>
        </div>
      </article>
    );
  };

  return (
    <section className="mt-6 md:hidden">
      <h3 className="text-xl font-semibold mb-3">Active Venues</h3>

      {loading ? (
        <p className="text-sm">Loading your venues…</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : venues.length === 0 ? (
        <p className="text-sm">You have no active venues.</p>
      ) : (
        <div className="space-y-4">
          {venues.filter(Boolean).map(v => (
            <ActiveVenueCard
              key={v.id}
              venue={v}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
