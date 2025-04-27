import { create } from "zustand";
import { persist } from "zustand/middleware";

// Hent base-URL fra miljøvariabler
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const useStore = create(
  persist(
    (set, get) => ({
      // === Auth slice ===
      user: null,
      token: null,
      isLoggedIn: false,

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const payload = await res.json();
          if (!res.ok) throw new Error(payload.message || "Login failed");

          set({
            user: payload.data.user,
            token: payload.data.token,
            isLoggedIn: true,
          });
        } catch (err) {
          set({ error: err.message });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => set({ user: null, token: null, isLoggedIn: false }),

      // === General UI slice ===
      error: null,
      loading: false,
      transparentHeader: false,
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
      setTransparentHeader: (flag) => set({ transparentHeader: flag }),

      // === Venues slice ===
      venues: [],
      venuesUrl: `${API_BASE}/venues?limit=20&page=1&_owner=true`,

      loadVenues: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(get().venuesUrl, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          if (res.status === 401) throw new Error("Unauthorized");

          const { data, meta } = await res.json();
          set({
            venues: data,
            venuesUrl: meta.nextPage
              ? `${API_BASE}/venues?limit=20&page=${meta.nextPage}&_owner=true`
              : null,
          });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      loadMoreVenues: async () => {
        const url = get().venuesUrl;
        if (!url) return;

        set({ loading: true, error: null });
        try {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
          if (res.status === 401) throw new Error("Unauthorized");

          const { data, meta } = await res.json();
          set((state) => ({
            venues: [...state.venues, ...data],
            venuesUrl: meta.nextPage
              ? `${API_BASE}/venues?limit=20&page=${meta.nextPage}&_owner=true`
              : null,
          }));
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // === Profile slice ===
      profile: null,
      fetchProfile: async (username) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(
            `${API_BASE}/profiles/${username}?_bookings=true&_venues=true`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${get().token}`,
              },
            }
          );
          if (res.status === 401) throw new Error("Unauthorized");

          const { data } = await res.json();
          set({ profile: data });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      // === Bookings slice ===
      bookings: [],
      fetchBookings: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`${API_BASE}/bookings`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${get().token}`,
            },
          });
          if (res.status === 401) throw new Error("Unauthorized");

          const { data } = await res.json();
          set({ bookings: data });
        } catch (err) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "holidaze-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        venues: state.venues,
        profile: state.profile,
        bookings: state.bookings,
      }),
    }
  )
);
