// src/hooks/forms/useNewVenueValidation.js
import { useState } from "react";

export default function useNewVenueValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const { required, minLength, maxLength } = validationRules[field] || {};
    let error = "";

    if (required && !value.trim()) {
      error = "This field is required";
    } else if (minLength && value.length < minLength) {
      error = `Must be at least ${minLength} characters`;
    } else if (maxLength && value.length > maxLength) {
      error = `Cannot exceed ${maxLength} characters`;
    }

    setValues((v) => ({ ...v, [field]: value }));
    setErrors((v) => ({ ...v, [field]: error }));
  };

  const remainingChars = (field) => {
    const max = validationRules[field]?.maxLength;
    if (max != null) return max - (values[field]?.length || 0);
    return null;
  };

  const isValid = (field) => {
    // valid if no error AND non-empty (you can tweak "non-empty" logic)
    return !errors[field] && values[field]?.length > 0;
  };

  return {
    values,
    errors,
    handleChange,
    remainingChars,
    isValid,
  };
}
