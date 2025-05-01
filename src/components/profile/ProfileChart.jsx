
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from 'recharts';

// Weekday order
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function ProfileChart({ venues = [], bookings = [] }) {
  // Venue filter state
  const [selectedVenue, setSelectedVenue] = useState('all');

  // Determine base bookings list: prefer explicit bookings prop
  const allBookings = useMemo(() => {
    if (Array.isArray(bookings) && bookings.length) {
      return bookings;
    }
    return venues.flatMap(v => v.bookings || []);
  }, [venues, bookings]);

  // Filter bookings by selected venue
  const filtered = useMemo(() => {
    if (selectedVenue === 'all') return allBookings;
    const venue = venues.find(v => String(v.id) === selectedVenue);
    return venue ? (venue.bookings || []) : [];
  }, [allBookings, venues, selectedVenue]);

  // Aggregate counts per weekday
  const data = useMemo(() => {
    const counts = WEEKDAYS.reduce((acc, day) => {
      acc[day] = 0;
      return acc;
    }, {});
    filtered.forEach(b => {
      const date = new Date(b.dateFrom);
      const key = date.getDay() === 0 ? 'Su' : WEEKDAYS[date.getDay() - 1];
      counts[key]++;
    });
    return WEEKDAYS.map(day => ({ day, count: counts[day] }));
  }, [filtered]);

  // Compute KPIs
  const total = filtered.length;
  const avg = total ? (total / 7).toFixed(1) : 0;
  const busiest = data.reduce((max, d) => (d.count > max.count ? d : max), { day: '', count: -1 });

  // Render no-data state
  if (!filtered.length) {
    return <p className="text-gray-500 text-center">No bookings yet.</p>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-md mx-auto">
      {/* Venue selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filter by Venue:</label>
        <select
          className="mt-1 block w-full p-2 border-gray-300 rounded"
          value={selectedVenue}
          onChange={e => setSelectedVenue(e.target.value)}
        >
          <option value="all">All Venues</option>
          {venues.map(v => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      {/* Chart title */}
      <h2 className="text-base font-semibold mb-2 text-center">Weekly Bookings</h2>

      {/* Area chart */}
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#E2E8F0" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#4A5568', fontSize: 12 }} />
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
