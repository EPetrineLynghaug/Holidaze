
import { setTokens, clearTokens, isAccessTokenValid } from "./tokenService";


const API = import.meta.env.VITE_API_BASE_URL;


export async function login({ email, password, remember = true }) {
  const res = await fetch(`${API}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // Parse JSON response
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Inactive account
    if (
      res.status === 403 ||
      (payload.error || "").toString().includes("ACCOUNT_INACTIVE")
    ) {
      const message =
        payload.message ||
        "Your account is inactive. Please verify your email.";
      throw { code: "ACCOUNT_INACTIVE", message };
    }
    // Generic credentials error (covers both wrong email and password)
    const message = payload.message || "Email or password is incorrect.";
    throw { code: "INVALID_CREDENTIALS", message };
  }

  // Success: extract tokens and profile
  const userData = payload.data || {};
  const { accessToken, refreshToken, ...profile } = userData;

  // Persist tokens & profile
  setTokens({ accessToken, refreshToken }, remember);
  localStorage.setItem("user", JSON.stringify(profile));

  // Notify app of auth change
  window.dispatchEvent(new Event("authChange"));

  return profile;
}

/**
 * Registers a new user. Throws structured { code, message } on failure.
 */
export async function register({ name, email, password }) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const code = (payload.error || "REGISTER_FAILED").toString();
    const message =
      payload.message || "Registration failed. Please check your input.";
    throw { code, message };
  }

  return payload.data;
}

/**
 * Clears tokens and profile, dispatches authChange.
 */
export function logout() {
  clearTokens();
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authChange"));
}

/**
 * Returns true if user is logged in (valid token & profile stored).
 */
export function isLoggedIn() {
  return isAccessTokenValid() && !!localStorage.getItem("user");
}
