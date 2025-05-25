import { useState } from "react";

export function useHomeSearch(
  initialValues = { where: "", guests: 1, when: "" }
) {
  const [where, setWhere] = useState(initialValues.where);
  const [guests, setGuests] = useState(initialValues.guests);
  const [when, setWhen] = useState(initialValues.when);
  const [error, setError] = useState("");

  function validate() {
    if (!where.trim()) return "Destination is required.";
    if (!guests || guests < 1) return "Guests must be at least 1.";
    if (!when) return "Please select a date.";
    return "";
  }

  function handleSubmit(onSearch) {
    return (e) => {
      e.preventDefault();
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }
      setError("");
      if (onSearch) {
        onSearch({ where, guests, when });
      }
    };
  }

  return {
    where,
    setWhere,
    guests,
    setGuests,
    when,
    setWhen,
    error,
    handleSubmit,
  };
}
