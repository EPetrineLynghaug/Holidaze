import React from "react";
import { Outlet, Link } from "react-router";

export default function Layout() {
  return (
    <div>
      <header>
 
        <nav>
          <Link to="/">Hjem</Link>{" "}
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>{" "}
          <Link to="/venues">All Venues</Link>{" "}
          <Link to="/profile">Profile</Link>
        </nav>
      </header>
      <main>
      
        <Outlet />
      </main>
    </div>
  );
}
