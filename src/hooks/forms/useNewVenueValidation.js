import { useState } from "react";

export default function useNewVenueValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const { required, minLength, maxLength, pattern, patternMessage } =
      validationRules[field] || {};
    let error = "";

    if (required && !value.trim()) {
      error = "This field is required";
    } else if (minLength && value.length < minLength) {
      error = `Must be at least ${minLength} characters`;
    } else if (maxLength && value.length > maxLength) {
      error = `Cannot exceed ${maxLength} characters`;
    } else if (pattern && !pattern.test(value)) {
      error = patternMessage || "Invalid format";
    }

    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const remainingChars = (field) => {
    const max = validationRules[field]?.maxLength;
    return max != null ? max - (values[field]?.length || 0) : null;
  };

  const isValid = (field) => {
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
