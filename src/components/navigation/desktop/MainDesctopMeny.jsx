import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import useAuthUser from "../../../hooks/auth/useAuthUser";
import { logout } from "../../../services/authService";
import Logo from "../../ui/Logo";
import VenueSearchSlide from "../../venue/allvenues/VenueSearchSlide";

export default function MainDesktopMenu() {
  const user = useAuthUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const mainLinks = [
    { to: "/", label: "Home" },
    { to: "/venues", label: "All Venues" },
  ];

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 h-16 shadow-sm font-figtree"
      role="banner"
    >
      <div className="flex items-center h-16 px-3 sm:px-8">
        <div className="flex items-center">
          <Logo className="h-8" />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-4 ml-auto">
          <VenueSearchSlide />

          <nav aria-label="Primary navigation" className="flex gap-2 md:gap-4">
            {mainLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    "relative px-3 py-2 rounded text-base transition-all duration-150 group font-medium",
                    isActive
                      ? "text-accent font-semibold"
                      : "text-slate-700 hover:text-accent",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span
                      aria-hidden="true"
                      className={[
                        "pointer-events-none absolute left-1/2 -bottom-1 w-8 h-[2px] rounded bg-accent transition-all duration-300",
                        isActive
                          ? "opacity-90 -translate-x-1/2 scale-x-100"
                          : "opacity-0 -translate-x-1/2 scale-x-75 group-hover:opacity-50 group-hover:scale-x-100",
                      ].join(" ")}
                      style={{ transformOrigin: "center" }}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div
            className={`flex items-center ${
              !user ? "gap-3 ml-2" : "gap-4 ml-4"
            }`}
            ref={dropdownRef}
          >
            {!user ? (
              <>
                <NavLink
                  to="/login"
                  className="px-3 py-2 text-slate-700 font-medium text-base rounded hover:bg-accent/10 transition-all"
                >
                  Log in
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-3 py-2 text-white bg-accent font-semibold text-base rounded hover:bg-accent-dark transition-all"
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent/10 transition-all group"
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls="user-menu"
                  aria-label="User menu"
                  type="button"
                >
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={`${user.name}'s profile`}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold uppercase text-accent">
                      {user.name ? user.name[0] : "U"}
                    </span>
                  )}
                  <span className="text-base font-normal text-slate-900 tracking-wide capitalize">
                    {user.name}
                  </span>
                  <svg
                    className={`ml-1 w-4 h-4 text-accent transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {open && (
                  <div
                    id="user-menu"
                    role="menu"
                    aria-label="User dropdown menu"
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-1 animate-fadein"
                  >
                    <NavLink
                      to="/profile"
                      role="menuitem"
                      tabIndex={0}
                      className="block px-4 py-2 text-slate-700 text-base hover:bg-accent/10 rounded transition-all"
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      tabIndex={0}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-all text-base"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
