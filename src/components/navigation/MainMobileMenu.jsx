import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router';
import { UserContext } from '../context/UserContext';

export default function MainMobileMenu() {
  const { user, logout } = useContext(UserContext);
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md px-4 py-3 flex items-center justify-between">
        <img src="/images/Logo1.png" alt="Holidaze logo" className="h-6" />

        <button
          onClick={() => setOpen(true)}
          className="rounded-full p-2 text-black transition-all duration-200 transform hover:scale-110 active:scale-95 hover:rotate-3"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-3xl">arrow_menu_close</span>
        </button>
      </header>

      {/* Slide-in menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6 z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-black rounded-full shadow-md transition-transform duration-300 ease-in-out hover:rotate-90 hover:scale-105"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-lg text-gray-800 leading-none">
              close
            </span>
          </button>
        </div>

        <nav className="flex flex-col gap-4 text-sm mt-4">
          <MenuItem to="/" label="Home" onClick={() => setOpen(false)} />
          <MenuItem to="/venues" label="All Venues" onClick={() => setOpen(false)} />

          {!user && (
            <>
              <MenuItem to="/login" label="Log in" onClick={() => setOpen(false)} />
              <MenuItem to="/register" label="Register" onClick={() => setOpen(false)} />
            </>
          )}
        </nav>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}


function MenuItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center justify-between group text-gray-700 hover:text-[#3E35A2] transition-colors"
    >
      <span>{label}</span>
      <span className="opacity-0 group-hover:opacity-100 transition-opacity material-symbols-outlined text-sm text-[#3E35A2]">
        chevron_right
      </span>
    </NavLink>
  );
}
