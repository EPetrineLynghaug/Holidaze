import { useState, useEffect, useCallback } from "react";
import { getAccessToken } from "../../services/tokenService";
import { PROFILE_BY_NAME_URL } from "../../components/constants/api";

export default function useProfileSettings(username) {
  const [profile, setProfile] = useState({
    venueManager: false,
    avatar: { url: "", alt: "" },
    banner: { url: "", alt: "" },
    bio: "",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [errorSave, setErrorSave] = useState("");

  const token = getAccessToken();

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      setErrorProfile("");

      try {
        const res = await fetch(PROFILE_BY_NAME_URL(username), {
          headers: {
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          const msg = `Kunne ikke laste profil (status ${res.status})`;
          throw new Error(msg);
        }

        const { data } = await res.json();
        setProfile({
          venueManager: data.venueManager,
          avatar: { url: data.avatar.url || "", alt: data.avatar.alt || "" },
          banner: { url: data.banner.url || "", alt: data.banner.alt || "" },
          bio: data.bio || "",
        });
      } catch (err) {
        console.error("fetchProfile error:", err);
        setErrorProfile(err.message);
      } finally {
        setLoadingProfile(false);
      }
    }

    if (username) {
      fetchProfile();
    } else {
      setLoadingProfile(false);
      setErrorProfile("Ingen brukernavn oppgitt.");
    }
  }, [username, token]);

  const saveProfile = useCallback(async () => {
    setSavingProfile(true);
    setErrorSave("");

    try {
      const res = await fetch(PROFILE_BY_NAME_URL(username), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          venueManager: profile.venueManager,
          avatar: profile.avatar,
          banner: profile.banner,
          bio: profile.bio,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const msg = `Kunne ikke lagre (status ${res.status}): ${text}`;
        throw new Error(msg);
      }

      const { data } = await res.json();

      setProfile({
        venueManager: data.venueManager,
        avatar: { url: data.avatar.url || "", alt: data.avatar.alt || "" },
        banner: { url: data.banner.url || "", alt: data.banner.alt || "" },
        bio: data.bio || "",
      });

      return data;
    } catch (err) {
      console.error("saveProfile error:", err);
      setErrorSave(err.message);
      throw err;
    } finally {
      setSavingProfile(false);
    }
  }, [username, token, profile]);

  return {
    profile,
    setProfile,
    loadingProfile,
    errorProfile,
    savingProfile,
    errorSave,
    saveProfile,
  };
}
