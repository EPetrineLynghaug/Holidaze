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
import CalendarModal from "../components/venue/venuedetail/CalendarModal";
import { BOOKINGS_URL } from "../components/constants/api";
import { getAccessToken } from "../services/tokenService";
import RatingStars from "../components/ui/RatingStars";
import VenueSkeleton from "../components/venue/venuedetail/VenueSkeleton";
import StatsIcons from "../components/venue/venuedetail/StatsIcons";
import BookingBar from "../components/venue/venuedetail/BookingBar";
import useBookingRanges from "../hooks/useBookingRanges";
import ImageCarousel from "../components/venue/venuedetail/Carousel";



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

  
  // Hent disabledDates og bookingRanges fra hook
  const { disabledDates, bookingRanges } = useBookingRanges(venue?.bookings || []);

  // Kalkuler antall netter
  const nights = useMemo(() => {
    const diffMs = selection.endDate - selection.startDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays > 0 ? Math.round(diffDays) : 1;
  }, [selection]);

  // Totalpris
  const totalPrice = venue?.price ? venue.price * nights : 0;
  const priceString = usd(totalPrice);

  // Handle booking
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

  // Lukk kalender hvis klikk utenfor
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) return <VenueSkeleton />;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!venue) return null;

  const {
    name,
    media = [],
    description,
    maxGuests,
    location = {},
    reviews = [],
    owner,
  } = venue;

  return (
    <div className="relative w-full min-h-screen bg-white pb-32">
      {/* Slideshow */}
      <ImageCarousel
  media={media}
  name={name}
  slide={slide}
  setSlide={setSlide}
/>


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
        <CalendarModal
          selection={selection}
          onSelectRange={handleSelectRange}
          disabledDates={disabledDates}
          bookingRanges={bookingRanges}
          onClose={handleCloseCalendar}
          onConfirm={handleBook}
          pricePerNight={venue.price}
        />
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