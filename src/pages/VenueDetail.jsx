import React, { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import useVenueDetail from "../hooks/useVenueDetail";
import ProfileUserLink from "../components/profile/mobile/ProfileUserSearch";
import { BOOKINGS_URL } from "../components/constants/api";
import { getAccessToken } from "../services/tokenService";


const NOK_TO_USD = 0.1;
const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n * NOK_TO_USD);

/** Skeleton loader that maintains layout while data is fetched */
const VenueSkeleton = () => (
  <div className="animate-pulse select-none">
    <div className="w-full aspect-video bg-gray-200" />
    <div className="px-4 pt-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
    </div>
  </div>
);

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: venue, loading, error } = useVenueDetail(id);

  // slideshow state
  const [slide, setSlide] = useState(0);

  // booking form state
  const [form, setForm] = useState({ dateFrom: "", dateTo: "", guests: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });

  const nextImg = useCallback(() => {
    if (!venue?.media?.length) return;
    setSlide((i) => (i + 1) % venue.media.length);
  }, [venue]);

  const handleInput = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { dateFrom, dateTo, guests } = form;
      if (!dateFrom || !dateTo || guests < 1) {
        setMsg({ err: "Fill all fields", ok: "" });
        return;
      }
      if (!localStorage.getItem("user")) {
        setMsg({ err: "Login required", ok: "" });
        return;
      }
      try {
        setSubmitting(true);
        const token = getAccessToken();
        const res = await fetch(BOOKINGS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ venueId: id, dateFrom, dateTo, guests }),
        });
        if (!res.ok) throw new Error(await res.text());
        setMsg({ ok: "Booked successfully!", err: "" });
        setTimeout(() => navigate("/profile"), 1200);
      } catch (e) {
        setMsg({ err: e.message, ok: "" });
      } finally {
        setSubmitting(false);
      }
    },
    [form, id, navigate]
  );

  if (loading) return <VenueSkeleton />;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!venue) return null;

  const {
    name,
    media = [],
    description,
    price,
    maxGuests,
    rating = 0,
    location = {},
    reviews = [],
    owner,
  } = venue;

  return (
    <div className="font-figtree tracking-tight  bg-white pb-28">
      {/* Slideshow */}
      {media.length ? (
        <div className="relative w-full aspect-video">
          <img
            src={media[slide]?.url}
            alt={media[slide]?.alt || name}
            className=" inset-0 w-full h-full object-cover"
            onClick={nextImg}
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/90 rounded-full p-2 shadow"
          >
            ←
          </button>
          <span className="absolute bottom-4 right-4 text-xs bg-black/70 text-white px-2 py-0.5 rounded-full">
            {slide + 1}/{media.length}
          </span>
        </div>
      ) : (
        <div className="w-full aspect-video bg-gray-100" />
      )}

      {/* Content */}
      <section className="px-4 pt-4 space-y-4">
        <header className="space-y-0.5">
          <h1 className="text-xl font-semibold truncate">{name}</h1>
          <p className="text-sm text-gray-600 truncate">
            {location.city}, {location.country}
          </p>
        </header>

        {/* Rating */}
        <div className="flex items-center text-yellow-500 text-sm">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="material-symbols-outlined text-base">
              {i < Math.round(rating) ? "star" : "star_border"}
            </span>
          ))}
          <span className="ml-1 text-gray-800">{rating.toFixed(1)}</span>
          <a href="#reviews" className="ml-2 text-indigo-600">
            ({reviews.length})
          </a>
        </div>

        <ProfileUserLink
          user={owner}
          size="xs"
          className="text-xs opacity-80 hover:opacity-100"
        />

        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {description}
        </p>

        <ul className="flex justify-between text-gray-600 text-sm px-1">
          {[
            ["bed", `${maxGuests} guests`],
            ["bathtub", "1 bath"],
            ["garage", "Parking"],
          ].map(([icon, label]) => (
            <li key={icon} className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-lg">{icon}</span>
              <span>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Booking bar */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between gap-4 shadow-lg"
      >
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50 text-sm font-medium"
        >
          {submitting ? "Booking…" : "Book now"}
        </button>
        <span className="text-sm font-semibold">{usd(price)} / night</span>
      </form>

      {/* Toast messages */}
      {msg.err && (
        <p className="fixed bottom-20 inset-x-0 text-center text-red-500 text-xs">
          {msg.err}
        </p>
      )}
      {msg.ok && (
        <p className="fixed bottom-20 inset-x-0 text-center text-green-600 text-xs">
          {msg.ok}
        </p>
      )}
    </div>
  );
}
