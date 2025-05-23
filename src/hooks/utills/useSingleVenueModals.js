import { useState, useRef, useEffect } from "react";

// Generic hook for venue-detail modal state/handlers
export default function useSingleVenueModals() {
  // Modal state
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Desktop vs mobil
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const calendarRef = useRef(null);

  // Håndter resize for desktop/mobil
  useEffect(() => {
    function handleResize() {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth < 1024) setShowCalendar(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lukk kalender om man klikker utenfor (mobil)
  useEffect(() => {
    const onClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Handlers
  function handleCalendarConfirm() {
    setShowCalendar(false);
    setTimeout(() => setShowSheet(true), 200);
  }
  function handleEditDates() {
    setShowSheet(false);
    setTimeout(() => setShowCalendar(true), 200);
  }
  function handleShowSuccess() {
    setShowSuccess(true);
  }
  function handleHideSuccess() {
    setShowSuccess(false);
  }

  function handleShowLoginPrompt() {
    setShowLoginPrompt(true);
  }
  function handleHideLoginPrompt() {
    setShowLoginPrompt(false);
  }

  return {
    showCalendar, setShowCalendar,
    showSheet, setShowSheet,
    showSuccess, setShowSuccess, handleShowSuccess, handleHideSuccess,
    showLoginPrompt, setShowLoginPrompt, handleShowLoginPrompt, handleHideLoginPrompt,
    isDesktop, setIsDesktop,
    calendarRef,
    handleCalendarConfirm,
    handleEditDates,
  };
}
