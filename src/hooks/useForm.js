import { useState, useRef } from "react";

/**
 * Custom form hook for handling input state, validation, and submission.
 */
export default function useForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialRef = useRef(initialValues);

  const handleChange = ({ target: { name, value } }) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: validate(name, value) }));
  };

  const handleBlur = ({ target: { name } }) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validate(name, values[name]) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fjern eventuelle generelle feilmeldinger
    setErrors((prev) => {
      const { general, ...rest } = prev;
      return rest;
    });
    // Marker alle felter som touched
    setTouched(Object.keys(values).reduce((a, k) => ({ ...a, [k]: true }), {}));
    // Valider alle felter
    const validationErrors = Object.keys(values).reduce(
      (a, k) => ({ ...a, [k]: validate(k, values[k]) }),
      {}
    );
    setErrors(validationErrors);

    // Hvis ingen feil, kjør onSubmit
    if (!Object.values(validationErrors).some(Boolean)) {
      setIsSubmitting(true);
      try {
        await onSubmit(values, setErrors);
      } catch {
        // svelg feilen for å sikre at vi alltid stopper submitting
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const reset = () => {
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
    reset,
    setErrors,
  };
}
