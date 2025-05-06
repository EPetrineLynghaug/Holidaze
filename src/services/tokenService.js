const KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
};

// Helper to choose storage based on `remember` flag
const storage = (remember) => (remember ? localStorage : sessionStorage);

// Generic setters and getters
function setToken(key, value, remember = false) {
  storage(remember).setItem(key, value);
}

function getToken(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

// Public API
export function setTokens(accessToken, refreshToken, remember = false) {
  setToken(KEYS.ACCESS, accessToken, remember);
  setToken(KEYS.REFRESH, refreshToken, remember);
}

export function getAccessToken() {
  return getToken(KEYS.ACCESS);
}

export function getRefreshToken() {
  return getToken(KEYS.REFRESH);
}

export function clearTokens() {
  Object.values(KEYS).forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
}

export function parseJwt(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isAccessTokenValid(leewayMs = 30_000) {
  const token = getAccessToken();
  if (!token) return false;
  const payload = parseJwt(token);
  return payload?.exp * 1000 > Date.now() + leewayMs;
}
