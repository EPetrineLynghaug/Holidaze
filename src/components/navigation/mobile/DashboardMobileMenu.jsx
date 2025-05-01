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
    { icon: 'grid_view', label: 'Dashboard', onClick: () => {}, disabled: false, active: true },
    { icon: 'add_business', label: 'List New Venue', onClick: () => {}, disabled: false, active: false },
    { icon: 'apartment', label: 'My Venues', onClick: () => {}, disabled: false, active: false },
    { icon: 'calendar_month', label: 'Bookings', onClick: () => {}, disabled: !hasBookings, active: false },
    { icon: 'settings', label: 'Settings', onClick: () => {}, disabled: false, active: false },
   
  ];

  return (
    <div className="md:hidden relative flex justify-end">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle dashboard menu"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium border border-[var(--color-border-soft)] hover:bg-[var(--profile-btn-bg)] hover:text-[var(--profile-btn-text)] transition"
      >
        <span
          className="material-symbols-outlined icon-purple"
          style={{
            fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
          }}
        >
          grid_view
        </span>
        Dashboard
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-lg transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '60vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2">
          <div className="w-16 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="sticky top-0 flex items-center justify-between px-4 py-3 bg-white border-b border-[var(--color-border-soft)] z-10">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close dashboard menu"
            className="text-[var(--profile-btn-text)]"
          >
            <span
              className="material-symbols-outlined icon-purple"
              style={{
                fontVariationSettings: `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
              }}
            >
              arrow_back
            </span>
          </button>
          <h3 className="text-lg font-semibold text-gray-800">Dashboard Menu</h3>
          <div className="w-6" />
        </div>

        <div className="grid grid-cols-1 gap-3 px-4 py-4 overflow-auto">
          {menuItems.map(({ icon, label, onClick, disabled, active }, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsOpen(false);
                onClick();
              }}
              disabled={disabled}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border w-full transition duration-200 overflow-hidden relative group ${
                disabled
                  ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                  : active
                  ? 'bg-[var(--profile-btn-bg)] text-[var(--profile-btn-text)] border-transparent'
                  : 'text-black border-[var(--color-border-soft)] hover:bg-[var(--profile-btn-bg)] hover:text-[var(--profile-btn-text)]'
              }`}
            >
              <span
                className="material-symbols-outlined icon-purple"
                style={{
                  fontVariationSettings: active
                    ? `'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24`
                    : `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                  transition: 'font-variation-settings 0.3s ease-in-out',
                }}
              >
                {icon}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
