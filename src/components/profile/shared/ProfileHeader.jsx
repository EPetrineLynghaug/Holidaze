import React from 'react';

export default function ProfileHeader({ user }) {
  if (!user) return null;

  // Always use the user prop directly to avoid cross-user storage issues
  const bannerSrc = user.banner?.url || '/images/default-banner.jpg';
  const avatarSrc = user.avatar?.url || '/images/default-avatar.jpg';
  const role = user.venueManager ? 'Venue' : 'Guest';

  return (
    <header className="mb-8 lg:hidden">
      {/* Banner – full width, fixed heights */}
      <section className="w-full" aria-labelledby="banner-heading">
        <div className="h-[150px] md:h-[300px] lg:h-[300px] overflow-hidden">
          <img
            id="banner-image"
            src={bannerSrc}
            alt="Profile banner"
            className="w-full object-cover"
          />
        </div>
      </section>

      <div className="flex flex-col items-center -mt-20 px-4">
        {/* Avatar with role badge */}
        <div className="relative">
          <img
            src={avatarSrc}
            alt={user.name || 'Avatar'}
            className="w-32 h-32 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow"
          />

          <span
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-white rounded-full uppercase text-xs tracking-wider"
            style={{ backgroundColor: 'var(--color-btn-dark)' }}
          >
            {role}
          </span>
        </div>

        <h1 className="mt-2 text-lg font-semibold text-gray-900 capitalize">
          {user.name}
        </h1>
      </div>
    </header>
  );
}
