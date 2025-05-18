import { useEffect, useState, useCallback } from "react";
import {
  PROFILE_BY_NAME_VENUES_URL,
  VENUES_URL,
} from "../../components/constants/api";
import { getAccessToken } from "../../services/tokenService";

export default function useManageVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's venues
  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const stored = localStorage.getItem("user");
      if (!stored)
        throw new Error("Brukerdata mangler. Vennligst logg inn igjen.");
      const { name } = JSON.parse(stored);
      const token = getAccessToken();
      const res = await fetch(
        `${PROFILE_BY_NAME_VENUES_URL(name)}?_bookings=true&_customer=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          },
        }
      );
      if (!res.ok) throw new Error(`Feil ved henting: ${res.status}`);
      const json = await res.json();
      const data = json.data.map((v) => ({ ...v, bookings: v.bookings || [] }));
      data.sort((a, b) => new Date(b.created) - new Date(a.created));
      setVenues(data);
    } catch (e) {
      setError(e.message || "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new venue
  const createVenue = useCallback(async (payload) => {
    setLoading(true);
    setError("");
    try {
      const token = getAccessToken();
      const res = await fetch(VENUES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Kunne ikke opprette venue: ${res.status}`);
      const newVenue = await res.json();
      setVenues((prev) => [newVenue, ...prev]);
      return newVenue;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing venue
  const updateVenue = useCallback(async (id, payload) => {
    setLoading(true);
    setError("");
    try {
      const token = getAccessToken();
      const res = await fetch(`${VENUES_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Kunne ikke oppdatere venue: ${res.status}`);
      const updated = await res.json();
      setVenues((prev) => prev.map((v) => (v.id === id ? updated : v)));
      return updated;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a venue
  const deleteVenue = useCallback(async (id) => {
    setLoading(true);
    setError("");
    try {
      const token = getAccessToken();
      const res = await fetch(`${VENUES_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
      });
      if (!res.ok) throw new Error(`Kunne ikke slette venue: ${res.status}`);
      setVenues((prev) => prev.filter((v) => v.id !== id));
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  return {
    venues,
    loading,
    error,
    refresh: fetchVenues,
    createVenue,
    updateVenue,
    deleteVenue,
  };
}
