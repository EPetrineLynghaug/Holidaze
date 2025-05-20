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

export default function ProfileChartSection({ user, venues = [], bookings = [] }) {
  const isVenue = user?.venueManager;
  const [selectedVenue, setSelectedVenue] = useState('all');

  // Kombiner bookinger (embedded og eksternt)
  const allBookings = useMemo(() => {
    const embedded = venues.flatMap(v =>
      (v.bookings || []).map(b => ({ ...b, venueId: v.id }))
    );
    return [...embedded, ...bookings];
  }, [venues, bookings]);

  const filtered = useMemo(() => {
    if (selectedVenue === 'all') return allBookings;
    return allBookings.filter(b => String(b.venueId) === selectedVenue);
  }, [allBookings, selectedVenue]);

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

  function Dropdown() {
    return (
      <div className="relative mb-3 w-full sm:w-60 mx-auto">
        <label className="block text-xs font-medium text-gray-700 mb-1 ml-1 tracking-wide">
          Filter by Venue
        </label>
        <div className="relative">
          <select
            className="custom-select w-full py-2 pl-3 pr-10 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition text-sm font-medium cursor-pointer"
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
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 text-xl">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    );
  }

  function StatBox({ icon, value, label }) {
    return (
      <div className="bg-gradient-to-b from-purple-100 to-white p-3 rounded-xl shadow-sm flex flex-col items-center">
        <span className="material-symbols-outlined text-purple-500 mb-1" style={{ fontSize: 20 }}>
          {icon}
        </span>
        <span className="font-bold text-lg text-purple-700">{value}</span>
        <span className="text-xs text-gray-700">{label}</span>
      </div>
    );
  }

  function TravelerBanner() {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-purple-50 via-white to-white border border-purple-100 rounded-2xl p-6 text-center shadow min-h-[260px]">
        <span className="material-symbols-outlined text-purple-500 text-4xl mb-2">info</span>
        <div className="text-lg font-semibold text-purple-800 mb-1">
          Become a Venue Manager!
        </div>
        <div className="text-sm text-gray-700 max-w-xs mx-auto">
          <b>Get access to analytics and calendar!</b>
          <br />
          Switch to <span className="font-semibold text-purple-700">Venue Mode</span> in settings to unlock weekly booking stats, manage venues and more.
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        rounded-2xl border border-gray-200 p-4 sm:p-5 mt-6 bg-white shadow
        max-w-full sm:max-w-xl lg:max-w-2xl
        mx-auto flex flex-col justify-center
      "
      style={{ minHeight: 320 }}
    >
      {isVenue ? (
        <>
          <Dropdown />
          <h2 className="text-lg font-semibold mb-2 text-center tracking-tight text-purple-800">
            Weekly Bookings
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333EA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#9333EA" stopOpacity={0.07} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8B5CF6', fontSize: 13, fontWeight: 600 }}
              />
              <YAxis
                domain={[0, 'dataMax + 1']}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A78BFA', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  background: '#F3F0FF',
                  color: '#9333EA',
                  fontWeight: 600,
                  boxShadow: "0 2px 8px rgba(128, 90, 213, 0.07)",
                }}
                labelStyle={{ color: '#9333EA', fontWeight: 700 }}
                itemStyle={{ color: '#7C3AED', fontWeight: 600 }}
                formatter={value => [value, 'Bookings']}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#9333EA"
                strokeWidth={2.5}
                fill="url(#fillPurple)"
                dot={{ r: 4, stroke: '#9333EA', strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 7, fill: "#9333EA", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive
                animationDuration={950}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
          {!total && (
            <p className="text-center text-gray-500 mt-2">
              No bookings yet.
            </p>
          )}
          <div className="
            mt-5
            
            grid gap-3 text-center
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            w-full
          ">
            <StatBox icon="bar_chart" value={total} label="Total" />
            <StatBox icon="show_chart" value={avg} label="Avg/Day" />
            <StatBox icon="event" value={busiest.day} label="Busiest" />
          </div>
        </>
      ) : (
        <TravelerBanner />
      )}
    </div>
  );
}
