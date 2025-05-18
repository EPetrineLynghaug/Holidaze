import React from "react";
import { NavLink, useNavigate } from "react-router";
import useAuthUser from "../../../hooks/useAuthUser";
import Logo from "../../ui/Logo";

function MenuItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className="px-4 py-2 text-gray-700 hover:text-[#3E35A2] transition-colors"
    >
      {children}
    </NavLink>
  );
}

export default function MainDesktopMenu() {
  const user = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("profileUrl");
    localStorage.removeItem("bannerUrl");
    localStorage.removeItem("venueManager");
    navigate("/");
  };

  const mainLinks = [
    { to: "/", label: "Home" },
    { to: "/venues", label: "All Venues" },
  ];
  const guestLinks = [
    { to: "/login", label: "Log in" },
    { to: "/register", label: "Register" },
  ];

  return (
    <>
      {/* Menyen dytter nå innholdet ned */}
      <header className="relative bg-white shadow-md flex justify-between items-center px-6 py-3">
        <Logo className="h-10" />
        <nav className="flex gap-6">
          {mainLinks.map((link) => (
            <MenuItem key={link.to} to={link.to}>
              {link.label}
            </MenuItem>
          ))}
          {!user && guestLinks.map((link) => (
            <MenuItem key={link.to} to={link.to}>
              {link.label}
            </MenuItem>
          ))}
          {user && (
            <>
              <MenuItem to="/profile">{user.name}</MenuItem>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-700 hover:text-[#3E35A2] transition-colors"
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </header>

    
    </>
  );
}
