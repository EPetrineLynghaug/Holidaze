/**
 * @jest-environment jsdom
 */

import * as auth from "../services/authService";
import { setTokens, clearTokens } from "../services/tokenService";

describe("authService", () => {
  const fakeJwt =
    "header." +
    btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60 })) +
    ".sig";
  const PROFILE_KEY = "user";

  beforeEach(() => {
    // Stub window.dispatchEvent så vi kan spionere på kall
    jest.spyOn(window, "dispatchEvent");
    // Rydd webstorage før hver test
    sessionStorage.clear();
    localStorage.clear();
    // Stub fetch globalt
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("login: lagrer token, profil og fyrer authChange", async () => {
    const profile = { id: 42, name: "Test" };
    // Stub fetch til å returnere en vellykket response med data
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ data: { accessToken: fakeJwt, ...profile } }),
    });

    const result = await auth.login({
      email: "a@example.com",
      password: "pwd",
    });
    expect(result).toEqual(profile);

    // Access-token skal ligge i sessionStorage
    expect(sessionStorage.getItem("accessToken")).toBe(fakeJwt);
    // Profilen skal persisteres i localStorage under nøkkel "user"
    expect(JSON.parse(localStorage.getItem(PROFILE_KEY))).toEqual(profile);
    // authChange-event skal ha blitt dispatchet
    expect(window.dispatchEvent).toHaveBeenCalledWith(new Event("authChange"));
  });

  it("logout: rydder token, profil og fyrer authChange", () => {
    // Seed med tokens og profil
    setTokens("tok1", "tok2");
    localStorage.setItem(PROFILE_KEY, JSON.stringify({ foo: "bar" }));

    // Kjør logout
    auth.logout();

    // Alt av tokens og profil skal være fjernet
    expect(sessionStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem(PROFILE_KEY)).toBeNull();
    // authChange-event skal ha blitt dispatchet
    expect(window.dispatchEvent).toHaveBeenCalledWith(new Event("authChange"));
  });
});
