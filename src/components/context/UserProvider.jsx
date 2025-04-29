// import React, { useState, useCallback } from 'react';
// import { UserContext } from './UserContext';

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     const json = localStorage.getItem('user');
//     return json ? JSON.parse(json) : null;
//   });

//   const logout = useCallback(() => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// }
