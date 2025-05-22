import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import useVenueDetail      from "../hooks/api/useVenueDetail";
import CalendarModal       from "../components/venue/venuedetail/CalendarModal";
import ImageCarousel       from "../components/venue/venuedetail/ImageCarousel";
import VenueInfo           from "../components/venue/venuedetail/VenueInfo";
import BookingBar          from "../components/venue/venuedetail/BookingBar";
import BookingBottomSheet  from "../components/venue/venuedetail/Booking";
import VenueSkeleton       from "../components/venue/venuedetail/VenueSkeleton";
import useBookingRanges    from "../hooks/data/useBookingRanges";

import BookingSuccessPopup from "../components/ui/popup/BookingSuccessPopup";
import LoginPromptPopup    from "../components/ui/popup/LoginPromptPopup";

import { BOOKINGS_URL }    from "../components/constants/api";
import { getAccessToken }  from "../services/tokenService";

const formatNOK = n =>
  `${new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 0 }).format(n)} NOK`;

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hent venue-data
  const { data: venue, loading, error } = useVenueDetail(id);

  // UI-state for modaler
  const [showCalendar,    setShowCalendar]    = useState(false);
  const [showSheet,       setShowSheet]       = useState(false);
  const [showSuccess,     setShowSuccess]     = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Booking-datoer
  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate:   new Date(),
    key:       "selection",
  });

  // For å lukke kalender ved klikking utenfor
  const calendarRef = useRef(null);

  // Derived: rating, ranges og antall netter
  const ratingNum = useMemo(() => {
    const r = parseFloat(venue?.rating);
    return isNaN(r) ? 0 : r;
  }, [venue]);

  const { disabledDates, bookingRanges } = useBookingRanges(venue?.bookings || []);

  const nights = useMemo(() => {
    const diff = selection.endDate - selection.startDate;
    return diff > 0 ? Math.round(diff / 86_400_000) : 1;
  }, [selection]);

  const priceString = formatNOK((venue?.price || 0) * nights);

  // Lukk kalender ved utenfor-klikk
  useEffect(() => {
    const onClick = e => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // API-kall for booking
  const [submitting, setSubmitting] = useState(false);
  const [errMsg,     setErrMsg]     = useState("");

  const handleBook = async formData => {
    const token = getAccessToken();
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    const body = {
      venueId:       id,
      dateFrom:      selection.startDate.toISOString().slice(0, 10),
      dateTo:        selection.endDate.toISOString().slice(0, 10),
      guests:        formData.guests || 1,
      firstName:     formData.firstName,
      lastName:      formData.lastName,
      phone:         formData.phone,
      paymentMethod: formData.paymentMethod,
    };

    try {
      setSubmitting(true);
      const res = await fetch(BOOKINGS_URL, {
        method:  "POST",
        headers: {
          "Content-Type":     "application/json",
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          Authorization:      `Bearer ${token}`,
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

  if (loading) return <VenueSkeleton />;
  if (error)   return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!venue)  return null;

  const {
    name,
    media       = [],
    description,
    maxGuests,
    location    = {},
    reviews     = [],
    owner,
  } = venue;

  return (
    <div className="
      max-w-full
      px-2 sm:px-6 md:px-18 xl:px-20
      py-8 pb-28
      bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen
    ">
      {/* Bildekarusell */}
      <ImageCarousel media={media} name={name} />

      {/* Info-seksjon */}
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

      {/* Booking-knapp nederst */}
      <BookingBar
        priceString={priceString}
        nights={nights}
        onBook={() => {
          if (!getAccessToken()) {
            setShowLoginPrompt(true);
          } else {
            setShowSheet(true);
          }
        }}
        submitting={submitting}
      />

      {/* Kalender-modal */}
      {showCalendar && (
        <div ref={calendarRef}>
          <CalendarModal
            selection={selection}
            disabledDates={disabledDates}
            bookingRanges={bookingRanges}
            pricePerNight={venue.price}
            onSelectRange={(s,e) => setSelection({ startDate: s, endDate: e, key: "selection" })}
            onClose={() => setShowCalendar(false)}
            onConfirm={() => setShowCalendar(false)}
          />
        </div>
      )}

      {/* Booking-modal */}
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

      {/* Suksess-popup */}
      {showSuccess && (
        <BookingSuccessPopup
          onClose={() => {
            setShowSuccess(false);
            navigate("/profile");
          }}
        />
      )}

      {/* Login-prompt */}
      {showLoginPrompt && (
        <LoginPromptPopup onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* Feilmelding */}
      {errMsg && (
        <p className="fixed bottom-20 inset-x-0 text-center text-red-500 text-xs">
          {errMsg}
        </p>
      )}
    </div>
  );
}
