import { useState } from "react";

export const BOOKING_STEPS = ["confirmDates", "guestInfo", "payment"];

export function useBookingForm(
  { startDate, endDate, guestsDefault = 1 },
  onComplete
) {
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

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required.";
      if (!form.lastName.trim()) errs.lastName = "Last name is required.";
      if (!/^\d{8,}$/.test(form.phone.replace(/\s+/g, "")))
        errs.phone = "Phone number must be at least 8 digits.";
      if (form.guests < 1) errs.guests = "At least one guest is required.";
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
      setSubmitting(true);
      setFeedback({ error: null, success: null });
      await onComplete(form);
      setFeedback({ error: null, success: "Booking complete!" });
    } catch (err) {
      console.error("Booking submission failed:", err);
      setFeedback({
        error: err.message || "An unexpected error occurred.",
        success: null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    step,
    currentStep: BOOKING_STEPS[step],
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
