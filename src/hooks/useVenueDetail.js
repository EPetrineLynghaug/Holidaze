// src/hooks/useVenueDetail.js
import React, { useState, useEffect } from "react";
import { getAccessToken } from "../services/tokenService";
import { VENUE_BY_ID_URL } from "../components/constans/api";

export default function useVenueDetail(id) {
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const fetchVenue = async () => {
      try {
        const token = getAccessToken();
        const headers = {
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          ...(token && { Authorization: `Bearer ${token}` }),
        };
        const res = await fetch(
          `${VENUE_BY_ID_URL(id)}?_owner=true&_reviews=true`,
          { headers, signal: controller.signal }
        );
        if (!res.ok) throw new Error(res.statusText);
        const { data } = await res.json();
        setVenue(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
    return () => controller.abort();
  }, [id]);

  return { venue, loading, error };
}
