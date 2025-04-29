// src/services/authService.js
import { setTokens, clearTokens, isAccessTokenValid } from "./tokenService";

const API = import.meta.env.VITE_API_BASE_URL;

export async function login({ email, password, remember = true }) {
  const res = await fetch(`${API}/auth/login?_holidaze=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Innlogging feilet");
  const payload = await res.json();

  // Noroff returnerer tokens + profil i payload.data
  const userData = payload.data;
  const { accessToken, refreshToken } = userData;

  // Lagrer token
  setTokens({ accessToken, refreshToken }, remember);

  // Fjerner token-felter og persisterer profildata
  const { accessToken: _, refreshToken: __, ...profile } = userData;
  localStorage.setItem("user", JSON.stringify(profile));

  // *** Viktig: dispatch for å oppdatere meny-komponenten ***
  window.dispatchEvent(new Event("authChange")); // <-- Her var feilen: manglende event-dispatch

  return profile;
}

export async function register({ name, email, password }) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) throw new Error("Registrering feilet");
  return await res.json();
}

export function logout() {
  clearTokens();
  localStorage.removeItem("user");
  // dispatch for å oppdatere meny
  window.dispatchEvent(new Event("authChange")); // <-- Sørger for at meny lytter
}

export function isLoggedIn() {
  return isAccessTokenValid() && !!localStorage.getItem("user");
}
