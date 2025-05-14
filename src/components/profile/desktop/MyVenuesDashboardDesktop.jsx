import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PROFILE_BY_NAME_VENUES_URL } from '../../constants/api';
import { getAccessToken } from '../../../services/tokenService';
import ActiveVenuesSection from '../mobile/ActiveVenueCard';
export default function MyVenuesDashboardDesktop() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [filter, setFilter] = useState('active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    useEffect(() => {
      const stored = localStorage.getItem('user');
      if (!stored) { navigate('/', { replace: true }); return; }
      (async () => {
        setLoading(true);
        setError('');
        try {
          const user = JSON.parse(stored);
          const token = getAccessToken();
          const res = await fetch(
            PROFILE_BY_NAME_VENUES_URL(user.name),
            { headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY } }
          );
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const { data } = await res.json();
          setVenues(data);
        } catch (err) {
          setError(err.message || 'Failed to load venues.');
        } finally {
          setLoading(false);
        }
      })();
    }, [navigate]);
  
    const now = new Date();
    const isExpired = (v) => v.bookings?.every(b => new Date(b.dateTo) < now);
    const activeVenues = venues.filter(v => !isExpired(v));
    const expiredVenues = venues.filter(v => isExpired(v));
  
    return (
      <div className="w-full max-w-7xl mx-auto mt-12 mb-20 p-6 md:p-8 bg-gray-50 rounded-2xl max-h-[calc(100vh-200px)] overflow-y-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Venues</h1>
            <p className="mt-1 text-gray-600">Manage and track your venue listings.</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 rounded-md border font-semibold text-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                filter === 'active' ? 'bg-purple-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Active ({activeVenues.length})
            </button>
            <button
              onClick={() => setFilter('expired')}
              className={`px-6 py-2 rounded-lg border font-semibold text-base transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                filter === 'expired' ? 'bg-purple-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-300'
              }`}
            >
              Expired ({expiredVenues.length})
            </button>
          </div>
        </header>
  
        {/* Venue List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <span className="loader" />
          </div>
        ) : error ? (
          <div className="py-16 text-center text-red-500">{error}</div>
        ) : (
          <div className="space-y-6">
            <ActiveVenuesSection
              venues={filter === 'active' ? activeVenues : expiredVenues}
              loading={loading}
              error={error}
              onDelete={id => setVenues(prev => prev.filter(v => v.id !== id))}
            />
          </div>
        )}
      </div>
    );
  }
  