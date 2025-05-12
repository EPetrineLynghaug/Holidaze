import React from 'react';
import { Link } from 'react-router';

export default function DashboardDesktopMenu({
  user,
  hasBookings = true,
  onListNew = () => {},
  onSettings = () => {},
  onMyVenues = () => {},
  onMyBookings = () => {},
}) {
  if (!user) return null;

  const avatarSrc = user.avatar?.url || '/images/default-avatar.jpg';
  const role = user.venueManager ? 'Venue' : 'Guest';

  const menuItems = [
    { icon: 'grid_view',       label: 'Dashboard',      onClick: () => {},           active: true,  disabled: false },
    { icon: 'add_business',    label: 'List New Venue', onClick: onListNew,         active: false, disabled: false },
    { icon: 'apartment',       label: 'My Venues',      onClick: onMyVenues,        active: false, disabled: false },
    { icon: 'calendar_month',  label: 'Bookings',       onClick: onMyBookings,      active: false, disabled: !hasBookings },
    { icon: 'settings',        label: 'Settings',       onClick: onSettings,        active: false, disabled: false },
  ];

  return (
    <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-md p-6">
      <div className="flex flex-col items-center mb-6">
        <img
          src={avatarSrc}
          alt={user.name || 'Avatar'}
          className="w-32 h-32 rounded-full border-4 border-white object-cover shadow"
        />
        <h1 className="mt-2 text-lg font-semibold text-gray-900">{user.name}</h1>
        <span className="text-xs text-white bg-[var(--color-btn-dark)] px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
          {role}
        </span>
        <hr className="w-full border-t border-gray-300 mt-4" />
      </div>
      <nav className="space-y-2">
        {menuItems.map(({ icon, label, onClick, disabled, active }, idx) => (
          <button
            key={idx}
            onClick={onClick}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-3 py-2 text-base font-medium rounded-lg transition-colors duration-300
              ${active ? 'bg-purple-300 text-white' : 'text-gray-700 hover:bg-purple-100'}
              ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}
            `}
          >
            <span className="material-symbols-outlined">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
