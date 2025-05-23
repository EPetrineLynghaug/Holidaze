import React from "react";

export default function UserProfileHeader({
  name,
  avatarUrl = "/images/default-avatar.jpg",
  bannerUrl = "/images/default-banner.jpg",
  isVenueManager = true,
  venuesCount = 0,
  bookingsCount = 0,
  reviewsCount = 0,
  about = "",
  location = "",
  socials = {},
}) {
  const badgeText = isVenueManager ? "Venue" : "Traveler";
  const badgeClass = isVenueManager
    ? "bg-[#3E35A2] text-white"
    : "bg-gray-200 text-gray-600";

  return (
    <section className="relative mb-10 w-full rounded-2xl overflow-hidden shadow border border-[#F2F2F2] bg-[#F4F5FA]">
      {/* Banner */}
      <div className="h-[140px] md:h-[230px] w-full overflow-hidden relative">
        <img
          src={bannerUrl}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Avatar + Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 px-6 pb-6 -mt-16 md:-mt-20">
        {/* Avatar */}
        <div className="relative z-20 md:ml-12">
          <img
            src={avatarUrl}
            alt={name}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white object-cover shadow"
          />
          <span
            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full uppercase text-xs font-bold tracking-wider shadow ${badgeClass}`}
            style={{ letterSpacing: ".08em" }}
          >
            {badgeText}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col md:pt-6 gap-3 text-center md:text-left items-center md:items-start">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-[#3E35A2] capitalize">{name}</h1>
            {location && (
              <span className="inline-flex items-center gap-1 text-sm text-[#a3a3a3]">
                <span className="material-symbols-outlined text-base">location_on</span>
                {location}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 md:gap-8">
            <StatItem label="Venues" value={venuesCount} />
            <StatItem label="Bookings" value={bookingsCount} />
            <StatItem label="Reviews" value={reviewsCount} />
          </div>

          {/* About */}
          {about && (
            <p className="text-sm text-gray-700 max-w-2xl">{about}</p>
          )}

          {/* Socials */}
          {Object.keys(socials).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              {Object.entries(socials).map(([key, url]) => (
                url && (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full bg-[#3E35A2]/10 px-3 py-1 text-xs text-[#3E35A2] hover:bg-[#3E35A2] hover:text-white transition"
                  >
                    <span className="material-symbols-outlined mr-1 text-sm">
                      {key === "instagram" ? "photo_camera" : key}
                    </span>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className="text-xl md:text-2xl font-bold text-[#3E35A2]">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}
