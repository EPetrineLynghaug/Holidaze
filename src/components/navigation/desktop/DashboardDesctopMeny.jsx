import React from 'react';
import { Link } from 'react-router';

export default function DashboardDesktopMenu({
  user,
  hasBookings = true,
  onListNew = () => {},
  onSettings = () => {},
  onMyVenues = () => {},
  onMyBookings = () => {},
  activeSection = 'dashboard',
}) {
  if (!user) return null;

  const avatarSrc = user.avatar?.url || '/images/default-avatar.jpg';
  const role = user.venueManager ? 'Venue' : 'Guest';

  const menuItems = [
    { icon: 'grid_view', label: 'Dashboard', key: 'dashboard', onClick: () => {}, disabled: false },
    { icon: 'add_business', label: 'List New Venue', key: 'list', onClick: onListNew, disabled: false },
    { icon: 'apartment', label: 'My Venues', key: 'venues', onClick: onMyVenues, disabled: false },
    { icon: 'calendar_month', label: 'Bookings', key: 'bookings', onClick: onMyBookings, disabled: !hasBookings },
    { icon: 'settings', label: 'Settings', key: 'settings', onClick: onSettings, disabled: false },
  ];

  const firstName = user.name?.split(' ')[0] || user.name;
  const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);

  return (
    <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-md p-0 rounded-tr-[2.5rem] overflow-hidden">
      <div className="flex flex-col items-center px-6 pt-6 pb-4 relative">
        <div className="relative">
          <img
            src={avatarSrc}
            alt={user.name || 'Avatar'}
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow"
          />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs text-white bg-indigo-700 px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
            {role}
          </span>
        </div>
        <h1 className="mt-6 text-lg font-semibold text-gray-900">{capitalizedFirstName}</h1>
        <hr className="w-full border-t border-gray-300 mt-4" />
      </div>

      <nav className="space-y-1 px-2">
        {menuItems.map(({ icon, label, key, onClick, disabled }) => {
          const isActive = activeSection === key;
          return (
            <button
              key={key}
              onClick={onClick}
              disabled={disabled}
              className={`group flex items-center gap-3 pl-4 pr-3 py-3 text-base font-medium w-full text-left transition-all duration-200
                ${isActive ? 'bg-[var(--profile-btn-bg)] text-[var(--profile-btn-text)] font-semibold rounded-r-2xl' : 'text-gray-700 hover:bg-indigo-50 rounded-lg'}
                ${disabled ? 'text-gray-400 cursor-not-allowed' : ''}`}
            >
              <span
                className={`material-symbols-outlined text-xl transition-all duration-300 ${
                  isActive ? 'text-[var(--profile-btn-text)] fill-current' : 'group-hover:text-indigo-600'
                }`}
                style={{
                  fontVariationSettings: isActive
                    ? `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`
                    : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                }}
              >
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}