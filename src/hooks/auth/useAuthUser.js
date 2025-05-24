// src/hooks/useAuthUser.js
import { useState, useEffect } from "react";

export default function useAuthUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const refresh = () => {
      const raw = localStorage.getItem("user");
      setUser(raw ? JSON.parse(raw) : null);
    };
    refresh();
    window.addEventListener("authChange", refresh);
    return () => window.removeEventListener("authChange", refresh);
  }, []);
  return user;
}
