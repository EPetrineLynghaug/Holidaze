import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from 'recharts';

// Weekday labels
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];


export default function ProfileChart({ venues = [], bookings = [] }) {
  const [selectedVenue, setSelectedVenue] = useState('all');

  // Determine booking source: embedded bookings or flat list
  const allBookings = useMemo(() => {
    if (venues.some(v => Array.isArray(v.bookings))) {
      return venues.flatMap(v => v.bookings || []);
    }
    return bookings;
  }, [venues, bookings]);

  // Filter bookings by selected venue
  const filtered = useMemo(() => {
    if (selectedVenue === 'all') return allBookings;
    // Flat list filtering
    if (!venues.some(v => Array.isArray(v.bookings))) {
      return allBookings.filter(
        b => String(b.venueId) === selectedVenue
      );
    }
    // Embedded bookings filtering
    const venue = venues.find(v => String(v.id) === selectedVenue);
    return venue ? (venue.bookings || []) : [];
  }, [selectedVenue, allBookings, venues]);

  // Construct chart data: count per weekday
  const data = useMemo(() => {
    const counts = WEEKDAYS.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
    filtered.forEach(b => {
      const idx = new Date(b.dateFrom).getDay(); // 0=Sun
      const key = idx === 0 ? 'Su' : WEEKDAYS[idx - 1];
      counts[key]++;
    });
    return WEEKDAYS.map(day => ({ day, count: counts[day] }));
  }, [filtered]);

  const total = filtered.length;
  const avg = (total / WEEKDAYS.length).toFixed(1);
  const busiest = data.reduce((max, d) => (d.count > max.count ? d : max), {
    day: '', count: -1
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-md mx-auto">
      {/* Venue selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Filter by Venue:
        </label>
        <select
          className="mt-1 block w-full p-2 border-gray-300 rounded"
          value={selectedVenue}
          onChange={e => setSelectedVenue(e.target.value)}
        >
          <option value="all">All Venues</option>
          {venues.map(v => (
            <option key={v.id} value={String(v.id)}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-base font-semibold mb-2 text-center">
        Weekly Bookings
      </h2>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E2E8F0" />
          <XAxis dataKey="day" axisLine={false} tickLine={false}
            tick={{ fill: '#4A5568', fontSize: 12 }}
          />
          <Tooltip cursor={false} formatter={value => [`${value}`, 'Bookings']} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6B46C1"
            strokeWidth={2}
            fill="#6B46C1"
            fillOpacity={0.2}
            dot={{ r: 3, stroke: '#6B46C1', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* KPI badges */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-purple-50 p-2 rounded">
          <p className="font-bold text-purple-700">{total}</p>
          <p>Total</p>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <p className="font-bold text-purple-700">{avg}</p>
          <p>Avg/Day</p>
        </div>
        <div className="bg-purple-50 p-2 rounded">
          <p className="font-bold text-purple-700">{busiest.day}</p>
          <p>Busiest Day</p>
        </div>
      </div>
    </div>
  );
}
