import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function ProfileChartSection({ venues = [], bookings = [] }) {
  const [selectedVenue, setSelectedVenue] = useState('all');

  // Combine embedded and external bookings
  const allBookings = useMemo(() => {
    const embedded = venues.flatMap(v =>
      (v.bookings || []).map(b => ({ ...b, venueId: v.id }))
    );
    return [...embedded, ...bookings];
  }, [venues, bookings]);

  // Filter bookings
  const filtered = useMemo(() => {
    if (selectedVenue === 'all') return allBookings;
    return allBookings.filter(b => String(b.venueId) === selectedVenue);
  }, [allBookings, selectedVenue]);

  // Build chart data
  const data = useMemo(() => {
    const counts = WEEKDAYS.reduce((acc, d) => ({ ...acc, [d]: 0 }), {});
    filtered.forEach(b => {
      const idx = new Date(b.dateFrom).getDay();
      const key = idx === 0 ? 'Su' : WEEKDAYS[idx - 1];
      counts[key]++;
    });
    return WEEKDAYS.map(day => ({ day, count: counts[day] }));
  }, [filtered]);

  const total = filtered.length;
  const avg = (total / WEEKDAYS.length).toFixed(1);
  const busiest = data.reduce((m, d) => (d.count > m.count ? d : m), { day: '-', count: 0 });

  return (
    <div className="w-full lg:max-w-md rounded-xl border border-[var(--color-border-soft)] p-4 mt-6 lg:mt-0 lg:px-2">
      {/* Venue filter */}
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

      <h2 className="text-base font-semibold mb-2 text-center">Weekly Bookings</h2>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9333EA" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#9333EA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} />
          <YAxis domain={[0, 'dataMax + 1']} allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} />
          <Tooltip formatter={value => [value, 'Bookings']} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#9333EA"
            strokeWidth={2.5}
            fill="url(#fillPurple)"
            dot={{ r: 3, stroke: '#9333EA', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {!total && <p className="text-center text-gray-500 mt-2">No bookings yet.</p>}

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