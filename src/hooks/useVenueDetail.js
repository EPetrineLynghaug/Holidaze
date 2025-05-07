import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "../services/tokenService";
import { VENUE_BY_ID_URL } from "../components/constants/api";


export default function useVenueDetail(id) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: "",
  });

  const fetchVenue = useCallback(
    async (signal) => {
      if (!id) return;
      setState((s) => ({ ...s, loading: true, error: "" }));
      try {
        const token = getAccessToken();
        const res = await fetch(
          `${VENUE_BY_ID_URL(id)}?_owner=true&_reviews=true`,
          {
            signal,
            headers: {
              "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText || "Could not load venue");
        const { data } = await res.json();
       
        setState({ data: data ?? {}, loading: false, error: "" });
      } catch (e) {
        if (e.name !== "AbortError")
          setState({ data: null, loading: false, error: e.message });
      }
    },
    [id]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchVenue(controller.signal);
    return () => controller.abort();
  }, [fetchVenue]);

  return {
    ...state,
    refetch: () => {
      const controller = new AbortController();
      fetchVenue(controller.signal);
    },
  };
}
