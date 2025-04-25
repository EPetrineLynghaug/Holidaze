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
        } flex flex-col`}
      >
        {/* Close button */}
        <div className="flex justify-end mb-6">
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

     
        <nav className="flex flex-col gap-5 text-sm mb-6">
          <MenuItem to="/" label="Home" onClick={() => setOpen(false)} />
          <MenuItem to="/venues" label="All Venues" onClick={() => setOpen(false)} />

          {!user && (
            <>
              <MenuItem to="/login" label="Log in" onClick={() => setOpen(false)} />
              <MenuItem to="/register" label="Register" onClick={() => setOpen(false)} />
            </>
          )}
        </nav>

     
        {user && (
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className="group flex items-center justify-between py-2 text-gray-700 hover:text-[#3E35A2] transition-colors mb-8"
          >
            <div className="flex items-center gap-3 pl-[2px]">
              <img
                src={user.avatar?.url || '/images/default-avatar.png'}
                alt={user.name || 'User avatar'}
                className="w-9 h-9 rounded-full object-cover border border-gray-300"
              />
              <span className="text-sm font-medium capitalize truncate">
                {user.name}
              </span>
            </div>
            <span className="material-symbols-outlined text-sm text-[#3E35A2] opacity-0 group-hover:opacity-100 transition-opacity">
              chevron_right
            </span>
          </NavLink>
        )}

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Log out */}
        {user && (
          <div className="pt-8 border-t border-gray-200">
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="group w-full flex items-center justify-between text-left text-sm text-gray-700 hover:text-[#3E35A2] transition mt-4"
            >
              <span>Log out</span>
              <span className="material-symbols-outlined text-sm text-[#3E35A2] opacity-0 group-hover:opacity-100 transition-opacity">
                chevron_right
              </span>
            </button>
          </div>
        )}
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
