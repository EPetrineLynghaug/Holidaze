import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import useVenueDetail      from "../hooks/api/useVenueDetail";
import CalendarModal       from "../components/venue/venuedetail/CalendarModal";
import ImageCarousel       from "../components/venue/venuedetail/ImageCarousel";
import VenueInfo           from "../components/venue/venuedetail/VenueInfo";
import BookingBar          from "../components/venue/venuedetail/BookingBar";
import BookingBottomSheet  from "../components/venue/venuedetail/Booking";
import VenueSkeleton       from "../components/venue/venuedetail/VenueSkeleton";
import VenueDescription    from "../components/venue/venuedetail/VenueDescription";

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

  const { data: venue, loading, error } = useVenueDetail(id);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [selection, setSelection] = useState({
    startDate: new Date(),
    endDate:   new Date(),
    key:       "selection",
  });

  // Desktop-sjekk (oppdateres på resize)
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const calendarRef = useRef(null);

  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
      // Om du bytter til mobil: lukk inline-calendar!
      if (window.innerWidth < 1024) setShowCalendar(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    const onClick = e => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // --- MOBIL: Kalender -> booking-sheet ---
  function handleCalendarConfirm() {
    setShowCalendar(false);
    setTimeout(() => setShowSheet(true), 200); // smooth overgang
  }

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
    media = [],
    description,
    maxGuests,
    location = {},
    reviews = [],
    owner,
  } = venue;

  // --- NY LOGIKK: onBook ---
  function handleBookingBarClick() {
    if (!getAccessToken()) {
      setShowLoginPrompt(true);
    } else if (!isDesktop) {
      // Sjekk om dato faktisk er valgt
      if (
        selection.startDate &&
        selection.endDate &&
        selection.endDate > selection.startDate
      ) {
        setShowSheet(true);
      } else {
        setShowCalendar(true);
      }
    } else {
      setShowSheet(true);
    }
  }

  return (
    <div className="
      max-w-full
      px-2 sm:px-6 md:px-18 xl:px-20
      py-8 pb-28
      bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen
    ">
      {/* Image Carousel */}
      <ImageCarousel media={media} name={name} />

      {/* Info section */}
      <VenueInfo
        name={name}
        location={location}
        rating={ratingNum}
        reviewCount={reviews.length}
        owner={owner}
        maxGuests={maxGuests}
        onOpenCalendar={() => setShowCalendar(true)}
      />

      {/* GRID: Description + Kalender på desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        {/* Beskrivelse */}
        <div className="col-span-1 lg:col-span-2">
          <VenueDescription description={description} />
        </div>
        {/* Kalender på desktop */}
        {isDesktop && (
          <div className="col-span-1 flex justify-end">
            <div className="max-w-xs w-full">
              <CalendarModal
                selection={selection}
                disabledDates={disabledDates}
                bookingRanges={bookingRanges}
                pricePerNight={venue.price}
                onSelectRange={(s, e) =>
                  setSelection({ startDate: s, endDate: e, key: "selection" })
                }
                onClose={() => setShowCalendar(false)}
                onConfirm={() => setShowCalendar(false)}
                isInline
              />
            </div>
          </div>
        )}
      </div>

      {/* Kalender-popup på mobil/tablet */}
      {showCalendar && !isDesktop && (
        <div ref={calendarRef}>
          <CalendarModal
            selection={selection}
            disabledDates={disabledDates}
            bookingRanges={bookingRanges}
            pricePerNight={venue.price}
            onSelectRange={(s, e) =>
              setSelection({ startDate: s, endDate: e, key: "selection" })
            }
            onClose={() => setShowCalendar(false)}
            onConfirm={handleCalendarConfirm}
          />
        </div>
      )}

      {/* Booking bar */}
      <BookingBar
        priceString={priceString}
        nights={nights}
        onBook={handleBookingBarClick}
        submitting={submitting}
      />

      {/* Booking modal */}
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

      {/* Popups */}
      {showSuccess && (
        <BookingSuccessPopup
          onClose={() => {
            setShowSuccess(false);
            navigate("/profile");
          }}
        />
      )}

      {showLoginPrompt && (
        <LoginPromptPopup onClose={() => setShowLoginPrompt(false)} />
      )}

      {/* Error message */}
      {errMsg && (
        <p className="fixed bottom-20 inset-x-0 text-center text-red-500 text-xs">
          {errMsg}
        </p>
      )}
    </div>
  );
}
