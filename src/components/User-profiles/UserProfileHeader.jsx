import React from "react";

export default function UserProfileHeader({
  name,
  email = "",
  avatarUrl = "/images/default-avatar.jpg",
  bannerUrl = "/images/default-banner.jpg",
  isVenueManager = true,
  venuesCount = 0,
  bookingsCount = 0,
  reviewsCount = 0,
  location = "",
  socials = {},
}) {
  const badgeText = isVenueManager ? "Venue" : "Traveler";
  const badgeClass = isVenueManager
    ? "bg-indigo-700 text-white"
    : "bg-gray-200 text-gray-600";

  return (
    <section className="relative w-full mb-10 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow">
      {/* Banner */}
      <div className="relative h-36 md:h-56">
        <img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        {/* Avatar */}
        <div className="absolute left-1/2 -bottom-14 transform -translate-x-1/2 z-20">
          <img
            src={avatarUrl}
            alt={name}
            className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-white object-cover shadow"
          />
          <span
            className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full uppercase text-xs font-bold tracking-wider shadow ${badgeClass}`}
          >
            {badgeText}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center pt-20 px-4 pb-6">
        {/* Name + Location */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-indigo-700 capitalize">
            {name}
          </h1>
          {location && (
            <span className="inline-flex items-center gap-1 text-sm text-gray-400">
              <span className="material-symbols-outlined text-base">location_on</span>
              {location}
            </span>
          )}
        </div>

        {/* Email */}
        {email && (
          <p className="text-sm text-gray-700 mt-2 break-all">{email}</p>
        )}

        {/* Stats */}
        <div className="flex gap-10 mt-6">
          <StatItem label="Venues" value={venuesCount} />
          <StatItem label="Bookings" value={bookingsCount} />
          <StatItem label="Reviews" value={reviewsCount} />
        </div>

        {/* Socials */}
        {Object.keys(socials).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {Object.entries(socials).map(([key, url]) =>
              url ? (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-indigo-700/10 px-3 py-1 text-xs text-indigo-700 hover:bg-indigo-700 hover:text-white transition"
                >
                  <span className="material-symbols-outlined mr-1 text-sm">
                    {key === "instagram" ? "photo_camera" : key}
                  </span>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              ) : null
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className="text-xl md:text-2xl font-bold text-indigo-700">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
