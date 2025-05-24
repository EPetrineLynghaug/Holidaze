import React from "react";
import { useNavigate } from "react-router";
import { FAC_OPTIONS } from "../constants/VenueFormConfig";

export default function VenueCardCompact({ venue })  {
  const navigate = useNavigate();
  const {
    id,
    name,
    media = [],
    location = {},
    maxGuests = 0,
    type = "Venue",
    bookings = [],
    facilities = [],
  } = venue;

  const { city = "", country = "" } = location;
  const imgUrl = media[0]?.url || "https://via.placeholder.com/400x240.png?text=No+Image";

  const now = new Date();
  const isBookedNow = bookings?.some(
    (b) => new Date(b.dateFrom) <= now && new Date(b.dateTo) >= now
  );

  const facilityIcons = facilities
    .map((key) => FAC_OPTIONS.find((f) => f.key === key))
    .filter(Boolean)
    .slice(0, 3);

  const extraCount = facilities.length - facilityIcons.length;

  return (
    <div
      onClick={() => navigate(`/venues/${id}`)}
      className="cursor-pointer rounded-2xl border border-gray-200 bg-white shadow hover:shadow-md transition overflow-hidden max-w-[360px] w-full"
      role="button"
      tabIndex={0}
      aria-label={`View venue ${name}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={imgUrl}
          alt={name}
          className="object-cover w-full h-full"
        />
        <span
          className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isBookedNow
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isBookedNow ? "Booked" : "Available"}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-500 mb-2 truncate">
          {[city, country].filter(Boolean).join(", ")}
        </p>

        <div className="flex gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">home</span>
            {type}
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">king_bed</span>
            {maxGuests} Beds
          </div>
        </div>

        <div className="flex gap-2 text-purple-700">
          {facilityIcons.map((fac) => (
            <span
              key={fac.key}
              className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100"
              title={fac.label}
              aria-label={fac.label}
            >
              <span className="material-symbols-outlined text-base">{fac.icon}</span>
            </span>
          ))}
          {extraCount > 0 && (
            <span className="w-7 h-7 flex items-center justify-center text-xs text-gray-500 bg-gray-50 rounded-full">
              +{extraCount}
            </span>
          )}
        </div>

        <span className="text-sm text-purple-700 font-medium underline block mt-3">
          View
        </span>
      </div>
    </div>
  );
}
