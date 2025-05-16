import React, { useEffect, useState } from 'react';
import useBookingRanges from '../../../hooks/useBookingRanges';

export default function VenueCard({ venue, onDeleteVenue, onEditVenue, onViewVenue, onAskCancel }) {
  const [open, setOpen] = useState(false);
  const { bookingRanges } = useBookingRanges(venue.bookings || []);
  const now = new Date();

  const current = bookingRanges.find(r => r.startDate <= now && r.endDate >= now);
  const next = bookingRanges.find(r => r.startDate > now);
  const latest = bookingRanges.at(-1);

  let status = 'Never booked';
  let statusDetail = '—';

  if (current) {
    const daysLeft = Math.ceil((current.endDate - now) / (1000 * 60 * 60 * 24));
    status = 'Rented';
    statusDetail = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  } else if (next) {
    const daysUntil = Math.ceil((next.startDate - now) / (1000 * 60 * 60 * 24));
    status = 'Upcoming';
    statusDetail = `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  } else if (latest) {
    const daysAgo = Math.ceil((now - latest.endDate) / (1000 * 60 * 60 * 24));
    status = 'Previously booked';
    statusDetail = `last booked ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  }

  const bookingCount = venue.bookings?.length || 0;
  const badgeColor = bookingCount > 0 ? 'bg-green-600' : 'bg-red-600';

  return (
    <section className="bg-white rounded-2xl shadow-lg p-6 ring-1 ring-gray-200 space-y-6">
      {/* Top row: image, details, badge */}
      <div className="grid md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-2">
          <img
            src={venue.media[0]?.url || 'https://via.placeholder.com/150'}
            alt={venue.media[0]?.alt || venue.name}
            className="w-full aspect-[4/3] object-cover rounded-lg"
          />
        </div>
        <div className="md:col-span-4 space-y-1">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-2 md:line-clamp-1">
            {venue.name}
          </h3>
          <p className="text-sm text-gray-500">
            {venue.location?.city}, {venue.location?.country}
          </p>
        </div>
        <div className="md:col-span-3 space-y-2">
          <p className="text-sm font-medium text-gray-700">{status}</p>
          <p className="text-xs italic text-gray-400">{statusDetail}</p>
          <span className={`inline-block text-xs font-medium text-white px-2 py-0.5 rounded-full ${badgeColor}`}>
            {bookingCount} booking{bookingCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Buttons at bottom */}
      <div className="flex flex-wrap justify-end gap-3 text-sm">
        {bookingCount > 0 && (
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
            aria-expanded={open}
            aria-controls={`bookings-${venue.id}`}
          >
            {open ? 'Hide Bookings' : 'Show Bookings'}
          </button>
        )}
        <button
          onClick={() => onViewVenue(venue.id)}
          className="px-4 py-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition"
        >
          View
        </button>
        <button
          onClick={() => onEditVenue(venue.id)}
          className="px-4 py-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDeleteVenue(venue.id)}
          className="px-4 py-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
        >
          Delete
        </button>
      </div>

      {/* Bookings list */}
      {open && bookingCount > 0 && (
        <div id={`bookings-${venue.id}`} className="mt-4 space-y-4 max-h-60 overflow-y-auto">
          {venue.bookings.map((b) => (
            <div key={b.id} className="bg-gray-50 px-5 py-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Date:</strong> {new Date(b.dateFrom).toLocaleDateString()} – {new Date(b.dateTo).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Booked by:</strong> {b.customer?.name || 'Unknown'}
              </p>
              {b.customer?.email && (
                <p className="text-xs text-gray-500">
                  <strong>Email:</strong> {b.customer.email}
                </p>
              )}
              <button
                onClick={() => onAskCancel(b.id)}
                className="mt-3 px-3 py-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition text-xs"
              >
                Cancel booking
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
