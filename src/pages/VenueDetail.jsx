import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router";
import useVenueDetail from "../hooks/useVenueDetail";
import ProfileUserLink from "../components/profile/mobile/ProfileUserSearch";
import CalendarPicker from "../components/ui/calender/CalendarPicker";
import { BOOKINGS_URL } from "../components/constants/api";
import { getAccessToken } from "../services/tokenService";
import RatingStars from "../components/ui/RatingStars";
import VenueSkeleton from "../components/venue/venuedetail/VenueSkeleton";
import StatsIcons from "../components/venue/venuedetail/StatsIcons";
import BookingBar from "../components/venue/venuedetail/BookingBar";

// NOK → USD uten desimaler
const NOK_TO_USD = 0.1;
const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n * NOK_TO_USD);

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: venue, loading, error } = useVenueDetail(id);

  const [slide, setSlide] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const ref = useRef(null);

  // Parsed numeric rating
  const ratingNum = useMemo(() => {
    const r = parseFloat(venue?.rating);
    return isNaN(r) ? 0 : r;
  }, [venue]);

  // Image slider logic
  const nextImg = useCallback(() => {
    if (!venue?.media?.length) return;
    setSlide((i) => (i + 1) % venue.media.length);
  }, [venue]);
  const prevImg = useCallback(() => {
    if (!venue?.media?.length) return;
    setSlide((i) => (i - 1 + venue.media.length) % venue.media.length);
  }, [venue]);

  // Disable booked dates
  const disabledDates = useMemo(() => {
    if (!venue?.bookings) return [];
    return venue.bookings.flatMap(({ dateFrom, dateTo }) => {
      const arr = [];
      let d = new Date(dateFrom);
      const end = new Date(dateTo);
      while (d <= end) {
        arr.push(new Date(d));
        d.setDate(d.getDate() + 1);
      }
      return arr;
    });
  }, [venue]);

  // Merged booking range for snake display
  const mergedBookingRange = useMemo(() => {
    if (!venue?.bookings?.length) return null;
    const ranges = venue.bookings.map(({ dateFrom, dateTo }) => ({
      startDate: new Date(dateFrom),
      endDate: new Date(dateTo),
    }));
    return {
      startDate: ranges[0].startDate,
      endDate: ranges[ranges.length - 1].endDate,
      key: "booked-snake",
    };
  }, [venue]);

  // Calculate nights
  const nights = useMemo(() => {
    const diffMs = selection.endDate - selection.startDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 0 ? Math.round(diffDays) : 1;
  }, [selection]);

  // Total price
  const totalPrice = venue?.price ? venue.price * nights : 0;
  const priceString = usd(totalPrice);

  // Booking handler
  const handleBook = async () => {
    const from = selection.startDate.toISOString().slice(0, 10);
    const to = selection.endDate.toISOString().slice(0, 10);
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
        body: JSON.stringify({
          venueId: id,
          dateFrom: from,
          dateTo: to,
          guests: 1,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setMsg({ ok: "Booked successfully!", err: "" });
      setTimeout(() => navigate("/profile"), 1200);
    } catch (e) {
      setMsg({ err: e.message, ok: "" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectRange = (start, end) =>
    setSelection({ startDate: start, endDate: end, key: "selection" });
  const handleCloseCalendar = () => setShowCalendar(false);

  // Close calendar on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowCalendar(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) return <VenueSkeleton />;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!venue) return null;

  const { name, media = [], description, maxGuests, location = {}, reviews = [], owner } = venue;

  return (
    <div ref={ref} className="relative w-full min-h-screen bg-white pb-32">
      {/* Slideshow */}
      {media.length ? (
        <div
          className="relative w-full aspect-video"
          onClick={(e) => {
            const { left, width } = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - left;
            x < width / 2 ? prevImg() : nextImg();
          }}
        >
          <img
            src={media[slide].url}
            alt={media[slide].alt || name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition"
          >
            <span className="material-symbols-outlined text-sm text-gray-800">
              arrow_back
            </span>
          </button>
          <span className="absolute bottom-4 left-4 text-xs bg-black/70 text-white px-2 py-0.5 rounded-full">
            {slide + 1}/{media.length}
          </span>
        </div>
      ) : (
        <div className="w-full aspect-video bg-gray-100" />
      )}

      {/* Details Section */}
      <section className="px-4 pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold truncate">{name}</h1>
          <button
            onClick={() => setShowCalendar(true)}
            className="material-symbols-outlined text-xl text-gray-800 hover:text-[#3E35A2]"
          >
            calendar_month
          </button>
        </div>

        <p className="text-sm text-gray-600">
          {location.city}, {location.country}
        </p>

        <div className="flex flex-col items-start space-y-1">
          <RatingStars rating={ratingNum} reviewCount={reviews.length} />
          <ProfileUserLink user={owner} size="xs" className="text-xs" />
        </div>

        {/* Stats row */}
        <StatsIcons maxGuests={maxGuests} />

        <p className="text-base leading-relaxed whitespace-pre-wrap pt-2">
          {description}
        </p>
      </section>

      {/* Booking bar */}
      <BookingBar
        priceString={priceString}
        nights={nights}
        onBook={handleBook}
        submitting={submitting}
      />

      {/* Calendar modal */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
          onClick={handleCloseCalendar}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <CalendarPicker
              selection={selection}
              onSelectRange={handleSelectRange}
              disabledDates={disabledDates}
              mergedBookingRange={mergedBookingRange}
              onClose={handleCloseCalendar}
              onConfirm={handleBook}
              pricePerNight={venue.price}
            />
          </div>
        </div>
      )}

      {/* Messages */}
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
