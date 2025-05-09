import { useState } from "react";

export const BOOKING_STEPS = ["confirmDates", "guestInfo", "payment"];
export function useBookingForm(
  { startDate, endDate, guestsDefault = 1 },
  onComplete
) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ error: "", success: "" });
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

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------- validation ---------- */
  const validateStep = (s) => {
    const err = {};
    if (s === 1) {
      if (!form.firstName.trim()) err.firstName = "First name is required";
      if (!form.lastName.trim()) err.lastName = "Last name is required";
      if (!/^\d{8,}$/.test(form.phone.replace(/\s+/g, "")))
        err.phone = "Phone must be at least 8 digits";
      if (form.guests < 1) err.guests = "At least 1 guest";
    }
    if (s === 2 && !form.paymentMethod) {
      err.paymentMethod = "Select a payment method";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => validateStep(step) && setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!validateStep(step)) return;
    try {
      setSubmitting(true);
      setFeedback({ error: "", success: "" });
      await onComplete?.(form);
      setFeedback({ error: "", success: "Booking complete!" });
    } catch (e) {
      setFeedback({ error: e.message || "Something went wrong", success: "" });
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
    next,
    back,
    submit,
  };
}
