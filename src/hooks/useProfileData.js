// src/hooks/useProfileData.js
import { useState, useEffect } from "react";
import useAuthUser from "./useAuthUser";
import { getAccessToken } from "../services/tokenService";
import {
  PROFILE_BY_NAME_VENUES_URL,
  PROFILE_BY_NAME_BOOKINGS_URL,
} from "../components/constans/api";

export default function useProfileData() {
  const user = useAuthUser();
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState({ venues: false, bookings: false });
  const [error, setError] = useState({ venues: "", bookings: "" });

  useEffect(() => {
    if (!user) return;
    const token = getAccessToken();

    setLoading((l) => ({ ...l, venues: true }));
    fetch(`${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ data }) => setVenues(data))
      .catch((err) => setError((e) => ({ ...e, venues: err.message })))
      .finally(() => setLoading((l) => ({ ...l, venues: false })));

    setLoading((l) => ({ ...l, bookings: true }));
    fetch(`${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(({ data }) => setBookings(data))
      .catch((err) => setError((e) => ({ ...e, bookings: err.message })))
      .finally(() => setLoading((l) => ({ ...l, bookings: false })));
  }, [user]);

  return { user, venues, bookings, loading, error };
}
