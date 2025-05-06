import { useState } from "react";
import {
  VENUES_URL,
  PROFILE_BY_NAME_VENUES_URL,
} from "../components/constants/api";
import { getAccessToken } from "../services/tokenService";
import {
  STEPS,
  MAX_IMAGES,
  ENV_OPTIONS,
  AUD_OPTIONS,
  FAC_OPTIONS,
} from "../components/constants/VenueFormConfig";

export function useVenueForm(userName, onCreated) {
  const [step, setStep] = useState(0);
  // Include location fields: address, city, country
  const [form, setForm] = useState({
    title: "",
    description: "",
    images: [""],
    environments: [],
    audiences: [],
    facilities: [],
    bathrooms: 1,
    rating: 0,
    dateRange: { startDate: new Date(), endDate: new Date(), key: "selection" },
    price: "",
    guests: 1,
    location: {
      address: "",
      city: "",
      country: "",
    },
  });
  const [feedback, setFeedback] = useState({ error: "", success: "" });

  const updateField = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleField = (field, key) =>
    setForm((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(key)
          ? arr.filter((x) => x !== key)
          : [...arr, key],
      };
    });

  const addImage = () =>
    setForm((prev) =>
      prev.images.length < MAX_IMAGES
        ? { ...prev, images: [...prev.images, ""] }
        : prev
    );

  const setImage = (i, url) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((u, idx) => (idx === i ? url : u)),
    }));

  const removeImage = (i) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    setFeedback({ error: "", success: "" });
    try {
      // build metadata from toggles
      const meta = {
        ...ENV_OPTIONS.reduce(
          (m, o) => ({ ...m, [o.key]: form.environments.includes(o.key) }),
          {}
        ),
        ...AUD_OPTIONS.reduce(
          (m, o) => ({ ...m, [o.key]: form.audiences.includes(o.key) }),
          {}
        ),
        ...FAC_OPTIONS.reduce(
          (m, o) => ({ ...m, [o.key]: form.facilities.includes(o.key) }),
          {}
        ),
        bathrooms: form.bathrooms,
      };

      // assemble payload including location
      const payload = {
        name: form.title,
        description: form.description,
        media: form.images.filter((u) => u).map((url) => ({ url, alt: "" })),
        price: Number(form.price),
        maxGuests: form.guests,
        rating: form.rating,
        meta,
        location: {
          address: form.location.address,
          city: form.location.city,
          country: form.location.country,
        },
        availability: {
          start: form.dateRange.startDate.toISOString().slice(0, 10),
          end: form.dateRange.endDate.toISOString().slice(0, 10),
        },
      };

      const token = getAccessToken();
      let res = await fetch(VENUES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);

      // refresh list after creation
      res = await fetch(
        `${PROFILE_BY_NAME_VENUES_URL(userName)}?_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
          },
        }
      );
      const { data } = await res.json();
      onCreated(data);
      setFeedback({ success: "Venue created successfully!", error: "" });
    } catch (err) {
      setFeedback({ success: "", error: err.message });
    }
  };

  return {
    step,
    form,
    feedback,
    updateField,
    toggleField,
    addImage,
    setImage,
    removeImage,
    next,
    back,
    submit,
  };
}
