import { useState, useEffect } from "react";
import { getAccessToken } from "../../services/tokenService";
import {
  PROFILE_BY_NAME_BOOKINGS_URL,
  BOOKING_BY_ID_URL,
  BOOKING_REVIEW_URL,
} from "../../components/constants/api";
export default function useBookings(passedUserName) {
  const stored = localStorage.getItem("user");
  const userName = passedUserName || (stored && JSON.parse(stored).name);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userName) return;

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchBookings() {
      setLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_BOOKINGS_URL(userName)}?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            },
            signal,
          }
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const { data } = await res.json();
        setBookings(data);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
    return () => controller.abort();
  }, [userName]);

  // Cancel (delete) a booking
  const cancelBooking = async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await fetch(`${BOOKING_BY_ID_URL(bookingId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
      });
      if (!res.ok) throw new Error(`Cancel failed: ${res.status}`);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit a review for a booking
  const submitReview = async (bookingId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await fetch(BOOKING_REVIEW_URL(bookingId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Review failed: ${res.status}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, cancelBooking, submitReview };
}
