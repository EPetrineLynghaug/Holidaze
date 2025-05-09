import React from 'react';

// BookingBar vises nederst med book-knapp, pris og antall netter
 export default function BookingBar({ priceString, nights, onBook, submitting }) {
  return (
    <div className="fixed bottom-0 inset-x-0 w-full bg-white p-4 shadow-lg flex items-center border-t border-[var(--color-border-soft)]">
      <button
        onClick={onBook}
        disabled={submitting}
        className="
          bg-[#3E35A2]
          text-white
          font-medium
          text-sm
          px-4
          py-2
          rounded-md
          hover:bg-[#5939aa]
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {submitting ? 'Booking…' : 'Book now'}
      </button>
      <div className="ml-auto flex items-baseline space-x-1">
        <span className="text-lg font-bold">{priceString}</span>
        <span className="text-sm text-gray-500">
          {nights > 1 ? ' total' : ' /night'}
        </span>
      </div>
    </div>
  );
}
