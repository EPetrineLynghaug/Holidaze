import React from "react";
import { useParams } from "react-router";
import useProfileDetail from "../hooks/api/useProfileDetail";
import UserProfileHeader from "../components/User-profiles/UserProfileHeader";
import VenueCardCompact from "../components/User-profiles/VenueCardCompact"; 

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

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Profil-header */}
      <UserProfileHeader
        name={profile.name}
        avatarUrl={profile.avatar?.url}
        bannerUrl={profile.banner?.url}
        isVenueManager={profile.venueManager}
        activeSince={profile.created}
        venuesCount={venues.length}
        bookingsCount={profile._count?.bookings || 0}
        reviewsCount={profile._count?.reviews || 0}
        email={profile.email}
        location={profile.location}
        socials={{
          instagram: profile.instagram,
          facebook: profile.facebook,
        }}
      />

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
          {venues.map((venue) => (
            <VenueCardCompact key={venue.id} venue={venue} />
          ))}
        </div>
      </section>
    </div>
  );
}
