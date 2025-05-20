import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import useVenueDetail        from "../hooks/useVenueDetail";
import CalendarModal         from "../components/venue/venuedetail/CalendarModal";
import ImageCarousel         from "../components/venue/venuedetail/Carousel";
import VenueInfo             from "../components/venue/venuedetail/VenueInfo";
import BookingBar            from "../components/venue/venuedetail/BookingBar";
import BookingBottomSheet    from "../components/venue/venuedetail/Booking";
import VenueSkeleton         from "../components/venue/venuedetail/VenueSkeleton";
import useBookingRanges      from "../hooks/useBookingRanges";

import BookingSuccessPopup   from "../components/ui/popup/BookingSuccessPopup";
import LoginPromptPopup      from "../components/ui/popup/LoginPromptPopup";

import { BOOKINGS_URL }      from "../components/constants/api";
import { getAccessToken }    from "../services/tokenService";

/* NOK → USD (whole dollars) */
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

  /* UI state */
  const [slide, setSlide]                 = useState(0);
  const [showCalendar,    setShowCalendar]    = useState(false);
  const [showSheet,       setShowSheet]       = useState(false);
  const [showSuccess,     setShowSuccess]     = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  /* Booking state */
  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate:   new Date(),
    key: "selection",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg]         = useState("");

  const ref = useRef(null);

  /* derived values */
  const ratingNum = useMemo(() => {
    const r = parseFloat(venue?.rating);
    return isNaN(r) ? 0 : r;
  }, [venue]);

  const { disabledDates, bookingRanges } = useBookingRanges(
    venue?.bookings || []
  );

  const nights = useMemo(() => {
    const diff = selection.endDate - selection.startDate;
    return diff > 0 ? Math.round(diff / 86_400_000) : 1; // ms per day
  }, [selection]);

  const priceString = usd((venue?.price || 0) * nights);

  /* --------------- API call ---------------- */
  const handleBook = async (formData = {}) => {
    const token = getAccessToken();
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const body = {
      venueId: id,
      dateFrom: selection.startDate.toISOString().slice(0, 10),
      dateTo:   selection.endDate  .toISOString().slice(0, 10),
      guests: formData.guests || 1,
      firstName: formData.firstName,
      lastName:  formData.lastName,
      phone:     formData.phone,
      paymentMethod: formData.paymentMethod,
    };

    try {
      setSubmitting(true);
      const res = await fetch(BOOKINGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());

      setShowSheet(false);
      setShowSuccess(true);
    } catch (e) {
      setErrMsg(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* close calendar on outside-click */
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* loading & error states */
  if (loading) return <VenueSkeleton />;
  if (error)   return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!venue)  return null;

  const {
    name,
    media = [],
    description,
    maxGuests,
    location = {},
    reviews = [],
    owner,
  } = venue;

  /* ---------------- JSX ---------------- */
  return (
    <div className="relative w-full min-h-screen bg-white pb-32">
      <ImageCarousel
        media={media}
        name={name}
        slide={slide}
        setSlide={setSlide}
      />

      <VenueInfo
        name={name}
        location={location}
        rating={ratingNum}
        reviewCount={reviews.length}
        owner={owner}
        maxGuests={maxGuests}
        description={description}
        onOpenCalendar={() => setShowCalendar(true)}
      />

      {/* bottom booking bar */}
      <BookingBar
        priceString={priceString}
        nights={nights}
        onBook={() => {
          if (!getAccessToken()) {
            setShowLoginPrompt(true);
            return;
          }
          setShowSheet(true);
        }}
        submitting={false}
      />

      {/* calendar modal */}
      {showCalendar && (
        <div ref={ref}>
          <CalendarModal
            selection={selection}
            onSelectRange={(s, e) =>
              setSelection({ startDate: s, endDate: e, key: "selection" })
            }
            disabledDates={disabledDates}
            bookingRanges={bookingRanges}
            onClose={() => setShowCalendar(false)}
            onConfirm={() => setShowCalendar(false)}
            pricePerNight={venue.price}
          />
        </div>
      )}

      {/* wizard modal */}
      {showSheet && (
        <BookingBottomSheet
          startDate={selection.startDate}
          endDate={selection.endDate}
          nights={nights}
          priceString={priceString}
          onClose={() => setShowSheet(false)}
          onComplete={handleBook}
        />
      )}

      {/* success popup */}
      {showSuccess && (
        <BookingSuccessPopup
          onClose={() => {
            setShowSuccess(false);
            navigate("/profile");
          }}
        />
      )}

      {/* login / register popup */}
      {showLoginPrompt && (
        <LoginPromptPopup onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* generic error message */}
      {errMsg && (
        <p className="fixed bottom-20 inset-x-0 text-center text-red-500 text-xs">
          {errMsg}
        </p>
      )}
    </div>
  );
}
