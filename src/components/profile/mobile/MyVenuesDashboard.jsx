import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PROFILE_BY_NAME_VENUES_URL } from '../../constans/api';
import { getAccessToken } from '../../../services/tokenService';
import ActiveVenuesSection from './ActiveVenueCard';

export default function MyVenuesDashboard({ onClose }) {
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [filter, setFilter] = useState('active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    // Fetch venues with bookings
    useEffect(() => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        navigate('/', { replace: true });
        return;
      }
      async function loadVenues() {
        setLoading(true);
        setError('');
        try {
          const user = JSON.parse(stored);
          const token = getAccessToken();
          const res = await fetch(
            `${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
              },
            }
          );
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          const { data } = await res.json();
          setVenues(data);
        } catch (err) {
          setError(err.message || 'Failed to load venues.');
        } finally {
          setLoading(false);
        }
      }
      loadVenues();
    }, [navigate]);
  
    // Determine expiration by checking each venue's bookings
    const isExpired = venue => {
      if (!venue.bookings || venue.bookings.length === 0) return false;
      const now = new Date();
      return venue.bookings.every(
        booking => new Date(booking.dateTo) < now
      );
    };
  
    // Split active vs expired
    const activeVenues = venues.filter(v => !isExpired(v));
    const expiredVenues = venues.filter(v => isExpired(v));
    const displayed = filter === 'active' ? activeVenues : expiredVenues;
  
    return (
      <div className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Venues</h2>
          <button onClick={onClose} className="text-blue-500">Close</button>
        </div>
  
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="active">
            Active venues ({activeVenues.length})
          </option>
          <option value="expired">
            Expired venues ({expiredVenues.length})
          </option>
        </select>
  
        {loading ? (
          <p className="text-center py-4">Loading venues...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : (
          <ActiveVenuesSection
            venues={displayed}
            loading={loading}
            error={error}
            onDelete={id => setVenues(prev => prev.filter(v => v.id !== id))}
          />
        )}
      </div>
    );
  }
  
