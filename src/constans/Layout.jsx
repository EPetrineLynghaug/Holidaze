import React from "react";
import { Outlet, Link } from "react-router";

export default function Layout() {
  return (
    <div>
      <header>
        {/* Enkel navigasjon i headeren */}
        <nav>
          <Link to="/">Hjem</Link>{" "}
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>{" "}
          <Link to="/venues">All Venues</Link>{" "}
          <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <main>
        {/* <Outlet /> viser barne-komponenten for den ruten du er på */}
        <Outlet />
      </main>
    </div>
  );
}
