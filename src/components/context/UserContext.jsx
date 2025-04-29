// import React, { createContext, useState, useCallback } from "react";

// export const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);

//   // Logout-funksjon
//   const logout = useCallback(() => {
//     setUser(null);
//     // evt. tøm lokal lagring, redirect o.l. her
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }