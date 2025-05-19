import React, { useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import useAuthUser from "../../../hooks/useAuthUser";
import Logo from "../../ui/Logo";

export default function MainDesktopMenu() {
  const user = useAuthUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Lukk dropdown hvis man klikker utenfor
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200 h-16 shadow-sm">
      <div className="flex items-center h-16 px-3 sm:px-8">
        {/* Logo venstre */}
        <div className="flex items-center">
          <Logo className="h-8" />
        </div>

        {/* Flex-spacer */}
        <div className="flex-1" />

        {/* Meny nær profil */}
        <nav className="flex gap-1 md:gap-6 font-figtree">
          {mainLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  "relative px-3 py-2 rounded font-semibold tracking-wide transition-all duration-150 group",
                  isActive
                    ? "text-accent"
                    : "text-slate-700 hover:text-accent"
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {/* Underline animasjon */}
                  <span
                    className={[
                      "pointer-events-none absolute left-1/2 -bottom-1 w-8 h-[2.5px] rounded bg-accent transition-all duration-300",
                      isActive
                        ? "opacity-100 -translate-x-1/2 scale-x-100"
                        : "opacity-0 -translate-x-1/2 scale-x-75 group-hover:opacity-40 group-hover:scale-x-100"
                    ].join(" ")}
                    style={{ transformOrigin: "center" }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Profil dropdown */}
        <div className="flex items-center gap-4 ml-6">
          {!user ? (
            <>
              <NavLink to="/login" className="px-3 py-2 text-slate-700 font-semibold rounded hover:bg-accent/10 transition-all">Log in</NavLink>
              <NavLink to="/register" className="px-3 py-2 text-white bg-accent font-semibold rounded hover:bg-accent-dark transition-all">Register</NavLink>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent/10 transition-all group"
                aria-haspopup="true"
                aria-expanded={open}
              >
                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-sm"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold uppercase text-accent">{user.name ? user.name[0] : "U"}</span>
                )}
                <span className="text-base font-semibold text-slate-900 tracking-wide">{user.name}</span>
                <svg className={`ml-1 w-4 h-4 text-accent transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 20 20"><path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-100 shadow-xl rounded-xl py-1 animate-fadein">
                  <NavLink to="/profile" className="block px-4 py-2 text-slate-700 hover:bg-accent/10 rounded transition-all">Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-all"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
