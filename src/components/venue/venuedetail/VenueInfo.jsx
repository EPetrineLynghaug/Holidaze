import { useEffect, useState } from "react";
import RatingStars from "../../ui/RatingStars";
import ProfileUserLink from "../../User-profiles/UserProfileLink";
import StatsIcons from "./StatsIcons";
import { getAccessToken } from "../../../services/tokenService";
import LoginToViewProfilePopup from "../../ui/popup/LoginToViewProfilePopup";

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
}) {
  const [starSize, setStarSize] = useState(26);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const isLoggedIn = !!getAccessToken();

  useEffect(() => {
    function handleResize() {
      setStarSize(window.innerWidth < 640 ? 20 : 26);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // avatar & name-fallbacks
  const nameString = owner?.displayName || owner?.name || "";
  const avatar =
    typeof owner?.avatar === "string"
      ? owner.avatar
      : owner?.avatar?.url || "/images/default-avatar.jpg";

  return (
    <section className="px-4 pt-2 pb-4">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-semibold mb-2 mt-3">
          {toTitleCase(name)}
        </h1>
        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="flex items-center justify-center bg-[#3E35A2] hover:bg-[#271e8d] text-white rounded-full w-11 h-11 shadow transition-all duration-200 translate-y-1 md:hidden"
            aria-label="Open calendar"
            style={{ fontSize: "1.7rem" }}
          >
            <span className="material-symbols-outlined text-2xl">
              calendar_month
            </span>
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-3 -mt-1">
        {location.city}
        {location.city && location.country ? ", " : ""}
        {location.country}
      </p>

      <div className="flex flex-col  gap-3 mb-3">
        <RatingStars
          value={rating}
          showValue={true}
          starSize={starSize}
          interactive={false}
          className="cursor-default"
        />

        {isLoggedIn ? (
          <ProfileUserLink
            user={owner}
            size="xs"
            className="text-base font-semibold text-indigo-700 capitalize bg-transparent shadow-none"
          />
        ) : (
          <>
            <button
              type="button"
              className="flex items-center gap-3 text-base font-semibold text-indigo-700 capitalize bg-transparent shadow-none"
              onClick={() => setShowLoginPopup(true)}
              style={{ outline: "none" }}
            >
              <img
                src={avatar}
                onError={e => { e.currentTarget.src = "/images/default-avatar.jpg"; }}
                alt={nameString}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                loading="lazy"
              />
              <span>{nameString}</span>
            </button>
            {showLoginPopup && (
              <LoginToViewProfilePopup onClose={() => setShowLoginPopup(false)} />
            )}
          </>
        )}
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
