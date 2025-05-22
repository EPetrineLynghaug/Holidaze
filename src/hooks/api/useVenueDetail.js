import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "../../services/tokenService";
import { VENUE_BY_ID_URL } from "../../components/constants/api";

export default function useVenueDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVenue = useCallback(
    async (signal) => {
      if (!id) {
        setError("Invalid venue ID");
        return;
      }
      setLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        const url = `${VENUE_BY_ID_URL(
          id
        )}?_owner=true&_reviews=true&_bookings=true`;

        const response = await fetch(url, {
          signal,
          headers: {
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          const message = `Failed to fetch venue: ${response.status} ${response.statusText}`;
          throw new Error(message);
        }

        const result = await response.json();
        setData(result.data ?? {});
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("useVenueDetail error:", err);
          setError(
            err.message ||
              "An unexpected error occurred while loading the venue."
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchVenue(controller.signal);
    return () => controller.abort();
  }, [fetchVenue]);

  const refetch = () => {
    const controller = new AbortController();
    fetchVenue(controller.signal);
    return () => controller.abort();
  };

  return { data, loading, error, refetch };
}
