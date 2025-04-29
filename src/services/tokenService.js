
const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export function setTokens({ accessToken, refreshToken }, remember = false) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(ACCESS_KEY, accessToken);
  storage.setItem(REFRESH_KEY, refreshToken);
}

export function getAccessToken() {
  return sessionStorage.getItem(ACCESS_KEY) || localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return (
    sessionStorage.getItem(REFRESH_KEY) || localStorage.getItem(REFRESH_KEY)
  );
}

export function clearTokens() {
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function isAccessTokenValid() {
  const token = getAccessToken();
  if (!token) return false;
  const payload = parseJwt(token);
  return payload && payload.exp * 1000 > Date.now() + 30000;
}
