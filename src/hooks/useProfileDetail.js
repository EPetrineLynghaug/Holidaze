// src/hooks/useProfileDetail.js
import { useState, useEffect } from "react";
import { getAccessToken } from "../services/tokenService";
import {
  PROFILE_BY_NAME_URL,
  PROFILE_BY_NAME_VENUES_URL,
} from "../components/constants/api";

/**
 * Custom hook to fetch user profile and their venues
 * @param {string} username - The user's username
 */
export default function useProfileDetail(username) {
  const [profile, setProfile] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [errorProfile, setErrorProfile] = useState("");
  const [errorVenues, setErrorVenues] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      setErrorProfile("");
      try {
        const token = getAccessToken();
        const res = await fetch(PROFILE_BY_NAME_URL(username), {
          headers: {
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!res.ok) throw new Error("Failed to load profile");
        const { data } = await res.json();
        setProfile(data);
      } catch (err) {
        setErrorProfile(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (!profile) return;
    async function fetchVenues() {
      setLoadingVenues(true);
      setErrorVenues("");
      try {
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_VENUES_URL(username)}?_bookings=true`,
          {
            headers: {
              "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );
        if (!res.ok) throw new Error("Failed to load venues");
        const { data } = await res.json();
        setVenues(data);
      } catch (err) {
        setErrorVenues(err.message);
      } finally {
        setLoadingVenues(false);
      }
    }

    fetchVenues();
  }, [username, profile]);

  return {
    profile,
    venues,
    loadingProfile,
    loadingVenues,
    errorProfile,
    errorVenues,
  };
}
