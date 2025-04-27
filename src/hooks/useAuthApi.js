import { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

async function loginApi({ email, password }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    let code;
    let message;
    switch (res.status) {
      case 404:
        code = payload.error || "EMAIL_NOT_FOUND";
        message = payload.message || "No account found with that email.";
        break;
      case 401:
        code = payload.error || "INVALID_PASSWORD";
        message = payload.message || "Incorrect email or password.";
        break;
      case 403:
        code = payload.error || "ACCOUNT_INACTIVE";
        message =
          payload.message ||
          "Your account is inactive. Please verify your email.";
        break;
      default:
        code = payload.error || "LOGIN_FAILED";
        message =
          payload.message || "Login failed. Please check your credentials.";
    }
    throw { code, message };
  }

  return payload.data; // { token, user }
}

/**
 * React hook for authentication API calls
 */
export default function useAuthApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ code: null, message: "" });
  const mounted = useRef(true);

  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  const login = async (credentials) => {
    setError({ code: null, message: "" });
    setIsLoading(true);
    try {
      return await loginApi(credentials);
    } catch (err) {
      if (mounted.current) setError(err);
      throw err;
    } finally {
      if (mounted.current) setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
