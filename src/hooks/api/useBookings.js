import { useState, useEffect } from "react";
import { getAccessToken } from "../../services/tokenService";
import { PROFILE_BY_NAME_BOOKINGS_URL } from "../../components/constants/api";

export default function useBookings(userName) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!userName) return;
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
        }
      );
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const { data } = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userName]);

  return { bookings, setBookings, loading, error, refetch: fetchBookings };
}
