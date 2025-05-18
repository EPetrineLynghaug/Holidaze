import { useState, useEffect } from "react";
import { getAccessToken } from "../../services/tokenService";
import {
  PROFILE_BY_NAME_BOOKINGS_URL,
  BOOKING_BY_ID_URL,
} from "../../components/constants/api";

export default function useBookings(userName) {
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

        if (!res.ok) {
          let msg = "Something went wrong. Please try again.";
          if (res.status === 401) msg = "Unauthorized. Please log in again.";
          if (res.status === 404) msg = "No bookings found.";
          if (res.status >= 500) msg = "Server error. Please try again later.";
          throw new Error(msg);
        }

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

  const deleteBooking = async (bookingId) => {
    if (!bookingId) {
      console.error("Booking ID is missing!");
      return;
    }

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

      if (!res.ok) {
        let msg = "Failed to cancel the booking.";
        if (res.status === 401) msg = "Unauthorized.";
        if (res.status === 404) msg = "Booking ID not found.";
        throw new Error(msg);
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (e) {
      setError(e.message || "Error occurred while canceling.");
    } finally {
      setLoading(false);
    }
  };

  return { bookings, loading, error, deleteBooking };
}
