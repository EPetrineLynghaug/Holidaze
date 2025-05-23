import { useState, useEffect } from "react";

export const BOOKING_STEPS = ["confirmDates", "guestInfo", "payment"];

export function useBookingForm(
  { startDate, endDate, guestsDefault = 1, maxGuests: rawMax },
  onComplete
) {
  const maxGuests = Number(rawMax) || 0;

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: null, success: null });
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    startDate,
    endDate,
    firstName: "",
    lastName: "",
    phone: "",
    guests: guestsDefault,
    paymentMethod: "card",
  });

  // Sync form.guests whenever guestsDefault (i.e. availableGuests) changes
  useEffect(() => {
    console.log("🔄 guestsDefault changed:", guestsDefault);
    setForm((prev) => ({ ...prev, guests: guestsDefault }));
  }, [guestsDefault]);

  const updateField = (key, value) => {
    console.log(`✏️ updateField ${key} =`, value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const clearFieldError = (key) =>
    setErrors((prev) => ({ ...prev, [key]: undefined }));

  const validateStep = (currentStep) => {
    console.log("🧪 validateStep", currentStep, form);
    const errs = {};

    if (currentStep === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required.";
      if (!form.lastName.trim()) errs.lastName = "Last name is required.";

      const phoneDigits = form.phone.replace(/\s+/g, "");
      if (!/^\d{8,}$/.test(phoneDigits)) {
        errs.phone = "Phone number must be at least 8 digits.";
      }

      const guests = Number(form.guests);
      if (isNaN(guests) || guests < 1) {
        errs.guests = "At least one guest is required.";
      } else if (guests > maxGuests) {
        errs.guests = `Only ${maxGuests} guests available for those dates.`;
      }
    }

    if (currentStep === 2 && !form.paymentMethod) {
      errs.paymentMethod = "Please select a payment method.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, BOOKING_STEPS.length - 1));
      setFeedback({ error: null, success: null });
    }
  };

  const back = () => {
    setStep((s) => Math.max(s - 1, 0));
    setFeedback({ error: null, success: null });
  };

  const submit = async () => {
    if (!validateStep(step)) return;
    try {
      const payload = { ...form, guests: Number(form.guests) };
      console.log("🚀 submit payload:", payload);

      setSubmitting(true);
      setFeedback({ error: null, success: null });
      await onComplete(payload);
      setFeedback({ error: null, success: "Booking complete!" });
    } catch (err) {
      console.error("❌ submit error:", err);
      let msg = err.message || "An unexpected error occurred.";
      if (/guests?/i.test(msg)) {
        msg = msg.replace(/.*Guests?\s*:?/i, "").trim() || msg;
        setErrors((prev) => ({ ...prev, guests: msg }));
      }
      setFeedback({ error: msg, success: null });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    form,
    errors,
    submitting,
    feedback,
    updateField,
    clearFieldError,
    next,
    back,
    submit,
  };
}
