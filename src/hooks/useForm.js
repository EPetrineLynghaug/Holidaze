import { useState, useRef } from "react";

export default function useForm(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialRef = useRef(initialValues);

  const validateField = (name, value) => {
    const trimmed = value.trim();
    if (name === "email") {
      if (!trimmed) return "Email is required";
      const domain = "@stud.noroff.no";
      if (!trimmed.endsWith(domain)) return `Email must end with ${domain}`;
    }
    if (name === "password") {
      if (!trimmed) return "Password is required";
      if (trimmed.length < 6) return "Password must be at least 6 characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, values[name]),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    const newErrors = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: validateField(key, values[key]) }),
      {}
    );
    setErrors(newErrors);

    if (!Object.values(newErrors).some(Boolean)) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch {
        // external errors via setErrors
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialRef.current);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setErrors,
  };
}
