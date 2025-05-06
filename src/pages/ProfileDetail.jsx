import React from 'react';
import { Link, useParams } from 'react-router';
import useProfileDetail from '../hooks/useProfileDetail';
import ProfileHeader from '../components/profile/mobile/ProfileHeader';
import { FAC_OPTIONS } from '../components/constants/VenueFormConfig';

function Loading() {
  return (
    <div className="flex justify-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  );
}

function ErrorFallback({ message, onRetry }) {
  return (
    <div className="text-center py-10">
      <p className="text-red-500 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Retry
      </button>
    </div>
  );
}

function FacilityIcon({ type }) {
  const option = FAC_OPTIONS.find((o) => o.key === type);
  if (!option) return null;
  return (
    <span className="material-symbols-outlined text-base" title={option.label}>
      {option.icon}
    </span>
  );
}

function VenueMeta({ type, maxGuests }) {
  return (
    <div className="flex items-center gap-4 text-gray-600 text-sm flex-wrap">
      <span className="inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-base">home</span>
        {type}
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="material-symbols-outlined text-base">king_bed</span>
        {maxGuests} Beds
      </span>
    </div>
  );
}

function CardActions({ id }) {
  return (
    <nav className="mt-auto pt-4 border-t border-gray-100 text-sm">
      <Link to={`/venues/${id}`} className="text-indigo-600 hover:underline">
        View
      </Link>
    </nav>
  );
}

export default function ProfileDetail() {
  const { username } = useParams();
  const {
    profile,
    venues,
    loadingProfile,
    loadingVenues,
    errorProfile,
    errorVenues,
  } = useProfileDetail(username);

  if (loadingProfile) return <Loading />;
  if (errorProfile)
    return <ErrorFallback message={errorProfile} onRetry={() => window.location.reload()} />;

  const now = Date.now();

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <ProfileHeader user={profile} />

      <section>
        <h2 className="text-2xl font-semibold mb-6">Venues & Availability</h2>
        {loadingVenues && <Loading />}
        {errorVenues && (
          <ErrorFallback message={errorVenues} onRetry={() => window.location.reload()} />
        )}
        {!loadingVenues && venues.length === 0 && (
          <p className="text-center text-gray-500">No venues created yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((v) => {
            const {
              id,
              name = 'Untitled Venue',
              media = [],
              location = {},
              bookings = [],
              type = 'Venue',
              maxGuests = 0,
              facilities = [],
            } = v;

            const imgUrl = media[0]?.url ||
              'https://via.placeholder.com/400x200?text=No+Image';
            const { city = '', country = '' } = location;
            const isBookedNow = bookings.some(
              (b) =>
                new Date(b.dateFrom).getTime() <= now &&
                new Date(b.dateTo).getTime() >= now
            );

            return (
              <article
                key={id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition flex flex-col overflow-hidden"
              >
                <Link to={`/venues/${id}`} className="block h-48 w-full">
                  <img
                    src={imgUrl}
                    alt={media[0]?.alt || name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-semibold text-gray-900 truncate">
                      <Link to={`/venues/${id}`} className="hover:underline">
                        {name}
                      </Link>
                    </h4>
                    <span
                      className={`inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded ${
                        isBookedNow ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}
                    >
                      {isBookedNow ? 'Booked now' : 'Available'}
                    </span>
                  </div>

                  {(city || country) && (
                    <p className="text-sm text-gray-500 truncate mb-2">
                      {[city, country].filter(Boolean).join(', ')}
                    </p>
                  )}

                  <VenueMeta type={type} maxGuests={maxGuests} />
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                    {facilities.slice(0, 3).map((key) => (
                      <FacilityIcon key={key} type={key} />
                    ))}
                    {facilities.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{facilities.length - 3}
                      </span>
                    )}
                  </div>

                  <CardActions id={id} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
