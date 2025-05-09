import { useState, useEffect } from "react";
import { VENUES_URL, PROFILES_URL } from "../components/constants/api";
import { getAccessToken } from "../services/tokenService";

export default function useSearch(query) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const token = getAccessToken();

    async function run() {
      setLoading(true);
      let venues = [];
      let profiles = [];

      // Fetch all venues and filter client-side on multiple fields
      try {
        const res = await fetch(VENUES_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          },
          signal,
        });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : json.data || [];
          const lower = query.toLowerCase();
          venues = list
            .filter(
              ({
                name = "",
                description = "",
                location = {},
                heading = "",
              }) => {
                const desc = description.toLowerCase();
                const city = (location.city || "").toLowerCase();
                const country = (location.country || "").toLowerCase();
                const head = heading.toLowerCase();
                return (
                  name.toLowerCase().includes(lower) ||
                  desc.includes(lower) ||
                  city.includes(lower) ||
                  country.includes(lower) ||
                  head.includes(lower)
                );
              }
            )
            .map((v) => ({ ...v, type: "venue", id: v.id || v.name }));
        }
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("Venue search error:", err);
      }

      // Fetch all profiles and filter client-side on name, username, bio, and displayName
      try {
        const res = await fetch(PROFILES_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          },
          signal,
        });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : json.data || [];
          console.log("Fetched profiles:", list); // Log profiles
          const lower = query.toLowerCase();
          profiles = list
            .filter(
              ({
                name = "",
                bio = "",
                username = "",
                displayName = "",
                avatar = "",
              }) => {
                const nameLower = name.toLowerCase();
                const bioLower = (bio || "").toLowerCase();
                const usernameLower = (username || "").toLowerCase();
                const displayNameLower = (displayName || "").toLowerCase();
                return (
                  nameLower.includes(lower) ||
                  bioLower.includes(lower) ||
                  usernameLower.includes(lower) ||
                  displayNameLower.includes(lower)
                );
              }
            )
            .map((p) => {
              const routeName = p.username || p.name;
              if (!p.username) {
                console.warn("Profile missing username:", p);
              }
              console.log("Profile route name:", routeName);
              console.log(`Navigating to: /profiles/${routeName}`);
              return {
                ...p,
                type: "profile",
                displayName: p.displayName || p.name,
                avatar: p.avatar || "",
                id: routeName,
                routeName: routeName,
              };
            });
        }
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("Profile search error:", err);
      }

    
      const combined = [...venues, ...profiles].sort((a, b) =>
        (a.displayName || a.name).localeCompare(b.displayName || b.name)
      );
      setData(combined);
      setLoading(false);
    }

    run();
    return () => controller.abort();
  }, [query]);

  return { data, loading };
}
