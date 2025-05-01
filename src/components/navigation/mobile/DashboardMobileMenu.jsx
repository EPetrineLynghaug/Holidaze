import { useState, useEffect } from 'react';


export default function DashboardMobileMenu({ hasBookings = true }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => e.key === 'Escape' && setIsOpen(false);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { icon: 'dashboard',      label: 'Dashboard', onClick: () => {}, disabled: false },
    { icon: 'apartment',      label: 'My Venues', onClick: () => {}, disabled: false },
    { icon: 'calendar_month', label: 'Bookings',  onClick: () => {}, disabled: !hasBookings },
    { icon: 'settings',       label: 'Settings',  onClick: () => {}, disabled: false },
  ];

  return (
    <div className="md:hidden relative flex justify-end">
      {/* Trigger button (mobile only) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle dashboard menu"
        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <span className="material-symbols-outlined text-lg">menu</span>
        Dashboard
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-up panel */}
      <div
        className={
          `fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-lg
           transform transition-transform duration-300 ease-out overflow-hidden
           ${isOpen ? 'translate-y-0' : 'translate-y-full'}`
        }
        style={{ maxHeight: '60vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Sticky header with back arrow and title */}
        <div className="sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 z-10">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close dashboard menu"
            className="focus:outline-none"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h3 className="text-lg font-semibold">Dashboard Menu</h3>
          <div className="w-6" />
        </div>

        {/* Menu grid: 2×2 */}
        <div className="grid grid-cols-2 gap-4 px-4 py-4 overflow-auto">
          {menuItems.map(({ icon, label, onClick, disabled }, idx) => (
            <button
              key={idx}
              onClick={() => { setIsOpen(false); onClick(); }}
              disabled={disabled}
              className={`flex flex-col items-center justify-center gap-2 py-2 text-sm font-medium w-full rounded-lg transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
