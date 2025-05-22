import React, { useEffect, useState } from "react";
import RatingStars from "../../ui/RatingStars";
import ProfileUserLink from "../../profile/shared/ProfileUserSearch";
import StatsIcons from "./StatsIcons";


function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

export default function VenueInfo({
  name,
  location = {},
  rating,
  reviewCount,
  owner,
  maxGuests,
  description,
  onOpenCalendar,
  onUserRate, 
}) {

  const [starSize, setStarSize] = useState(26);

  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    function handleResize() {
      setStarSize(window.innerWidth < 640 ? 20 : 26);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleRate(val) {
    setSelectedRating(val);
    if (onUserRate) onUserRate(val); // send til parent/backend hvis ønsket
  }

  return (
    <section className="px-4 pt-2 pb-4">
      <div className="flex justify-between items-center mb-1">
     <h1 className="text-2xl font-semibold mb-2 mt-3">
          {toTitleCase(name)}
        </h1>
        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="flex items-center justify-center bg-[#3E35A2] hover:bg-[#271e8d] text-white rounded-full w-11 h-11 shadow transition-all duration-200 translate-y-1"
            aria-label="Open calendar"
            style={{ fontSize: "1.7rem" }}
          >
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3 -mt-1">
        {location.city}
        {location.city && location.country ? ", " : ""}
        {location.country}
      </p>

      <div className="flex flex-col mb-3">
        <RatingStars
          value={selectedRating || rating}
          showValue={true}
          starSize={starSize}
          interactive
          className="cursor-pointer"
          onRate={handleRate}
        />

        <ProfileUserLink
          user={owner}
          size="xs"
          className="text-xs bg-transparent shadow-none"
        />
      </div>

  <div>
  <StatsIcons maxGuests={maxGuests} />
</div>

      {description && (
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      )}
    </section>
  );
}
