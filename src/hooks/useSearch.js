import { useState, useEffect } from "react";
import { VENUES_SEARCH, PROFILES_SEARCH } from "../components/constants/api";
import { getAccessToken } from "../services/tokenService";

export default function useSearch(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setData([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const token = getAccessToken();

    async function run() {
      setLoading(true);
      setError("");

      // --- VENUES SEARCH ---
      let venues = [];
      try {
        const url = `${VENUES_SEARCH}?q=${encodeURIComponent(query)}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          },
          signal,
        });
        if (!res.ok)
          throw new Error(res.statusText || "Failed to search venues");
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];
        venues = list.map((v) => ({
          type: "venue",
          ...v,
          id: v.id?.toString() || v.name,
        }));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Venue search error:", err);
          setError(err.message);
        }
      }

      // --- PROFILES SEARCH (only if logged in) ---
      let profiles = [];
      if (token) {
        try {
          const url = `${PROFILES_SEARCH}?q=${encodeURIComponent(query)}`;
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            },
            signal,
          });
          if (!res.ok) {
            if (res.status === 401) {
              // unauthorized, skip profiles silently
            } else {
              throw new Error(res.statusText || "Failed to search profiles");
            }
          } else {
            const json = await res.json();
            const list = Array.isArray(json) ? json : json.data || [];
            profiles = list.map((p) => ({
              type: "profile",
              ...p,
              id: p.username || p.name,
              routeName: p.username || p.name,
              displayName: p.displayName || p.name,
              avatar: p.avatar?.url || "",
            }));
          }
        } catch (err) {
          if (err.name !== "AbortError") {
            console.error("Profile search error:", err);
            setError(err.message);
          }
        }
      }

      // Combine and sort
      const combined = [...venues, ...profiles].sort((a, b) =>
        (a.displayName || a.name).localeCompare(b.displayName || b.name)
      );
      setData(combined);
      setLoading(false);
    }

    run();
    return () => controller.abort();
  }, [query]);

  return { data, loading, error };
}
