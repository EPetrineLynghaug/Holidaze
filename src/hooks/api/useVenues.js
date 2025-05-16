import { useEffect, useState } from "react";
import { PROFILE_BY_NAME_VENUES_URL } from "../../components/constants/api";
import { getAccessToken } from "../../services/tokenService";

export default function useVenues(navigate) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchVenues() {
      try {
        setLoading(true);
        setError("");

        const stored = localStorage.getItem("user");
        if (!stored) {
          setError("Brukerdata mangler. Vennligst logg inn igjen.");
          return;
        }

        const user = JSON.parse(stored);
        if (!user?.name) {
          setError("Ugyldig brukerdata. Kan ikke hente steder.");
          return;
        }

        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_VENUES_URL(
            user.name
          )}?_bookings=true&_customer=true`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            },
            signal,
          }
        );

        if (!res.ok) {
          let errorMessage = "Noe gikk galt. Prøv igjen senere.";
          if (res.status === 401)
            errorMessage = "Du er ikke autorisert. Vennligst logg inn på nytt.";
          if (res.status === 404)
            errorMessage = "Fant ikke stedene. Sjekk brukernavnet ditt.";
          if (res.status >= 500)
            errorMessage = "Serverfeil. Prøv igjen senere.";
          throw new Error(errorMessage);
        }

        const jsonData = await res.json().catch(() => {
          throw new Error("Ugyldig respons fra serveren.");
        });

        const withBookings = jsonData.data.map((v) => ({
          ...v,
          bookings: v.bookings || [],
        }));

        const sorted = withBookings.sort(
          (a, b) => new Date(b.created) - new Date(a.created)
        );

        setVenues(sorted);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();

    return () => controller.abort();
  }, []);

  return { venues, loading, error, setVenues };
}
