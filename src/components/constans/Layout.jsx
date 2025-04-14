import React, { useContext } from "react";
import { Outlet, Link } from "react-router";
import { UserContext } from "../context/UserContext";

export default function Layout() {
  const { user, setUser } = useContext(UserContext);
  console.log("Logged in user:", user);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Hjem</Link>{" "}
          {user ? (
            <>
              <Link to="/profile">Profile</Link>{" "}
              <button onClick={handleLogout}>Logg ut</button>{" "}
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>{" "}
              <Link to="/register">Register</Link>{" "}
            </>
          )}
          <Link to="/venues">All Venues</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
