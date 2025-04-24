import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router";
import { UserContext } from "../context/UserContext";

export default function Layout() {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <header>
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <NavLink to="/" end style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Hjem
          </NavLink>

          {user ? (
            <>
              <NavLink to="/profile" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                Profil
              </NavLink>
              <button onClick={handleLogout} style={{ marginLeft: 'auto' }}>
                Logg ut
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                Logg inn
              </NavLink>
              <NavLink to="/register" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                Registrer
              </NavLink>
            </>
          )}

          <NavLink to="/venues" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            All Venues
          </NavLink>
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
}