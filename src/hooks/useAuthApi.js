// // useAuthApi.js
// import { useState, useEffect, useRef } from "react";

// const API_BASE = import.meta.env.VITE_API_BASE_URL;

// async function loginApi({ email, password }) {
//   const res = await fetch(`${API_BASE}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
//   const payload = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     let code;
//     let message;
//     switch (res.status) {
//       case 404:
//         code = payload.error || "EMAIL_NOT_FOUND";
//         message = payload.message || "No account found with that email.";
//         break;
//       case 401:
//         code = payload.error || "INVALID_PASSWORD";
//         message = payload.message || "Incorrect email or password.";
//         break;
//       case 403:
//         code = payload.error || "ACCOUNT_INACTIVE";
//         message =
//           payload.message ||
//           "Your account is inactive. Please verify your email.";
//         break;
//       default:
//         code = payload.error || "LOGIN_FAILED";
//         message =
//           payload.message || "Login failed. Please check your credentials.";
//     }
//     throw { code, message };
//   }

//   return payload.data; // { token, user }
// }

// async function registerApi({ name, email, password, venueManager }) {
//   const res = await fetch(`${API_BASE}/auth/register`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ name, email, password, venueManager }),
//   });
//   const payload = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const code = payload.error || "REGISTER_FAILED";
//     const message =
//       payload.message || "Registration failed. Please check your input.";
//     throw { code, message };
//   }

//   return payload.data; // det som returneres ved registrering
// }

// /**
//  * Hook for authentication API calls og token-lagring
//  */
// export default function useAuthApi() {
//   const [token, setToken] = useState(() => localStorage.getItem("token"));
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState({ code: null, message: "" });
//   const mounted = useRef(true);

//   useEffect(
//     () => () => {
//       mounted.current = false;
//     },
//     []
//   );

//   // Synkroniser til localStorage
//   useEffect(() => {
//     if (token) localStorage.setItem("token", token);
//     else localStorage.removeItem("token");
//   }, [token]);

//   useEffect(() => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [user]);

//   const wrapCall = async (apiFn, args) => {
//     setError({ code: null, message: "" });
//     setIsLoading(true);
//     try {
//       const data = await apiFn(args);
//       // Dersom kall returnerer token+user
//       if (data.token) setToken(data.token);
//       if (data.user) setUser(data.user);
//       return data;
//     } catch (err) {
//       if (mounted.current) setError(err);
//       throw err;
//     } finally {
//       if (mounted.current) setIsLoading(false);
//     }
//   };

//   const login = (credentials) => wrapCall(loginApi, credentials);
//   const register = (details) => wrapCall(registerApi, details);
//   const logout = () => {
//     setToken(null);
//     setUser(null);
//   };

//   return {
//     login,
//     register,
//     logout,
//     token,
//     user,
//     isLoading,
//     error,
//   };
// }
