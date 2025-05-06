/**
 * @jest-environment jsdom
 */

import {
  setTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  isAccessTokenValid,
} from "../services/tokenService";

describe("tokenService", () => {
  const KEY_ACCESS = "accessToken";
  const KEY_REFRESH = "refreshToken";

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it("skriver til sessionStorage som default", () => {
    setTokens("tokA", "tokR");
    expect(sessionStorage.getItem(KEY_ACCESS)).toBe("tokA");
    expect(sessionStorage.getItem(KEY_REFRESH)).toBe("tokR");
    expect(getAccessToken()).toBe("tokA");
    expect(getRefreshToken()).toBe("tokR");
  });

  it("skriver til localStorage ved remember=true", () => {
    setTokens("A2", "R2", true);
    expect(localStorage.getItem(KEY_ACCESS)).toBe("A2");
    expect(localStorage.getItem(KEY_REFRESH)).toBe("R2");
  });

  it("clearTokens fjerner fra begge storage", () => {
    sessionStorage.setItem(KEY_ACCESS, "a");
    localStorage.setItem(KEY_REFRESH, "r");
    clearTokens();
    expect(sessionStorage.getItem(KEY_ACCESS)).toBeNull();
    expect(localStorage.getItem(KEY_REFRESH)).toBeNull();
  });

  it("isAccessTokenValid returnerer false uten token", () => {
    expect(isAccessTokenValid()).toBe(false);
  });
});
