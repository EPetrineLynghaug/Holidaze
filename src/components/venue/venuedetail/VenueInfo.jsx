import React from "react";
import RatingStars from "../../ui/RatingStars";
import ProfileUserLink from "../../profile/mobile/ProfileUserSearch";
import StatsIcons from "./StatsIcons";

export default function VenueInfo({
  name,
  location = {},
  rating,
  reviewCount,
  owner,
  maxGuests,
  description,
  onOpenCalendar,
}) {
  return (
    <section className="px-4 pt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold truncate">{name}</h1>
        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="material-symbols-outlined text-xl text-gray-800 hover:text-[#3E35A2]"
          >
            calendar_month
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600">
        {location.city}, {location.country}
      </p>

      <div className="flex flex-col items-start space-y-1">
        <RatingStars rating={rating} reviewCount={reviewCount} />
        <ProfileUserLink user={owner} size="xs" className="text-xs" />
      </div>

      <StatsIcons maxGuests={maxGuests} />

      <p className="text-base leading-relaxed whitespace-pre-wrap pt-2">
        {description}
      </p>
    </section>
  );
}
