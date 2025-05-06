import {
  setTokens,
  clearTokens,
  isAccessTokenValid,
  getAccessToken,
} from "./tokenService";

const API = import.meta.env.VITE_API_BASE_URL;
const PROFILE_STORAGE_KEY = "user";
const AUTH_CHANGE_EVENT = "authChange";

// API endpoints
const ENDPOINTS = {
  login: "/auth/login?_holidaze=true",
  register: "/auth/register",
};

/**
 * Custom error for API failures
 */
export class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

/**
 * Notify app of authentication changes
 */
function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

/**
 * Persist user profile to localStorage
 */
function persistProfile(profile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Remove persisted profile
 */
function removePersistedProfile() {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
}

/**
 * Helper to build headers, injecting auth if available
 */
function buildHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  const token = getAccessToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * Handle fetch response: parse JSON and throw ApiError on failure
 */
async function handleResponse(res) {
  let payload = {};
  try {
    payload = await res.json();
  } catch {
    // ignore parse errors
  }
  if (!res.ok) {
    const code = payload.error || res.status;
    const message = payload.message || res.statusText;
    throw new ApiError(code, message, res.status);
  }
  return payload.data;
}

/**
 * Generic POST to API
 */
async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

/**
 * Log in a user. Throws ApiError on failure.
 */
export async function login({ email, password, remember = true }) {
  const userData = await apiPost(ENDPOINTS.login, { email, password });
  const { accessToken, ...profile } = userData;
  setTokens(accessToken, remember);
  persistProfile(profile);
  notifyAuthChange();
  return profile;
}

/**
 * Register a new user. Throws ApiError on failure.
 */
export async function register({ name, email, password }) {
  return apiPost(ENDPOINTS.register, { name, email, password });
}

/**
 * Log out current user.
 */
export function logout() {
  clearTokens();
  removePersistedProfile();
  notifyAuthChange();
}

/**
 * Check if user is logged in.
 */
export function isLoggedIn() {
  return isAccessTokenValid() && !!localStorage.getItem(PROFILE_STORAGE_KEY);
}
