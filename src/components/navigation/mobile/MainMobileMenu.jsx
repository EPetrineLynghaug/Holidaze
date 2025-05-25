import  { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthUser from "../../../hooks/auth/useAuthUser";
import { logout as logoutService } from "../../../services/authService";
import Logo from "../../ui/Logo";
import VenueSearchSlide from "../../venue/allvenues/VenueSearchSlide";

function Chevron() {
  return (
    <span className="opacity-0 group-hover:opacity-100 transition-opacity material-symbols-outlined text-sm text-[#3E35A2]">
      chevron_right
    </span>
  );
}

function MenuItem({ as: Component = NavLink, to, onClick, className = "", children }) {
  const base = "flex items-center justify-between group text-gray-700 hover:text-[#3E35A2] transition-colors";
  return (
    <Component to={to} onClick={onClick} className={`${base} ${className}`}>
      <span>{children}</span>
      <Chevron />
    </Component>
  );
}

export default function MainMobileMenu() {
  const user = useAuthUser();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const openButtonRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        openButtonRef.current?.focus();
      }
    };
    if (open) {
      window.addEventListener("keydown", onKey);
      menuRef.current?.querySelector("button, a")?.focus();
    } else {
      window.removeEventListener("keydown", onKey);
    }
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = useCallback(() => setOpen(false), []);

  const handleLogout = () => {
    logoutService();
    closeMenu();
    navigate("/");
  };

  const avatarSrc = user?.avatar?.url || "/images/default-avatar.png";
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
      <header className="static bg-white shadow-md px-4 py-3 flex justify-between" aria-label="Main navigation">
        <Logo className="h-10 mb-1" />
        <div className="flex items-center gap-2">
          <VenueSearchSlide />
          <button
            ref={openButtonRef}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="rounded-full p-2 text-black transition hover:scale-110 active:scale-95 hover:rotate-3"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </header>

      <aside
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-lg p-6 z-50
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-end mb-6">
          <button
            onClick={closeMenu}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center bg-white border border-black rounded-full shadow-md transition-transform hover:rotate-90 hover:scale-105"
          >
            <span className="material-symbols-outlined text-lg text-gray-800 leading-none">close</span>
          </button>
        </div>

        <nav className="flex flex-col gap-5 text-base mb-6" aria-label="Mobile menu links">
          {mainLinks.map(link => (
            <MenuItem key={link.to} to={link.to} onClick={closeMenu}>
              {link.label}
            </MenuItem>
          ))}
          {!user && guestLinks.map(link => (
            <MenuItem key={link.to} to={link.to} onClick={closeMenu}>
              {link.label}
            </MenuItem>
          ))}
        </nav>

        {user && (
          <MenuItem as={NavLink} to="/profile" onClick={closeMenu} className="py-2 mb-8">
            <div className="flex items-center gap-3 pl-[2px]">
              <img
                src={avatarSrc}
                alt={user.name || "User avatar"}
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm font-medium capitalize truncate">{user.name}</span>
            </div>
          </MenuItem>
        )}

        <div className="flex-grow" />

        {user && (
          <div className="pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between group text-left text-base text-gray-700 hover:text-[#3E35A2] transition"
            >
              <span>Log out</span>
              <Chevron />
            </button>
          </div>
        )}
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
