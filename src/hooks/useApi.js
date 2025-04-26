// src/hooks/useApi.js
import { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export function useAuthApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  const login = async ({ email, password }) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      if (!response.ok) {
        const field = json.field || "password";
        const defaultMsg =
          field === "email" ? "User not found" : "Wrong password";
        const message = json.message || defaultMsg;
        const err = new Error(message);
        err.field = field;
        throw err;
      }
      return json.data;
    } catch (err) {
      if (mounted.current) setError(err.message);
      throw err;
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
