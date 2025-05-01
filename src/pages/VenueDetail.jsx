
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { VENUE_BY_ID_URL, BOOKINGS_URL } from '../components/constans/api';
import { getAccessToken } from '../services/tokenService';

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Fetch venue details on mount
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await fetch(VENUE_BY_ID_URL(id));
        if (!res.ok) {
          throw new Error(`Failed to fetch venue: ${res.status} ${res.statusText}`);
        }
        const json = await res.json();
        setVenue(json.data || json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    // Validate inputs
    if (!dateFrom || !dateTo) {
      setBookingError('Please select both start and end dates.');
      return;
    }
    if (guests < 1) {
      setBookingError('Please select at least one guest.');
      return;
    }

    // Ensure user is logged in
    const stored = localStorage.getItem('user');
    if (!stored) {
      setBookingError('You must be logged in to book.');
      return;
    }

    try {
      const token = getAccessToken();
      const res = await fetch(BOOKINGS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({ venueId: id, dateFrom, dateTo, guests }),
      });
      if (!res.ok) {
        const errJson = await res.json();
        const msg = errJson.errors?.[0]?.message || `Booking failed (${res.status})`;
        throw new Error(msg);
      }
      setBookingSuccess('Booking successful! Redirecting to profile...');
      setTimeout(() => navigate('/profile', { replace: true }), 1000);
    } catch (e) {
      setBookingError(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {venue ? (
        <>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>{venue.name}</h1>
          <img
            src={venue.media?.[0]?.url || 'https://via.placeholder.com/800x400'}
            alt={venue.media?.[0]?.alt || 'Venue image'}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <p style={{ margin: '20px 0' }}>{venue.description}</p>
          <p><strong>Price per night:</strong> {venue.price} NOK</p>

          <form onSubmit={handleSubmit} style={{ marginTop: '40px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h2>Book now</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <label>
                From:
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  required
                  style={{ marginLeft: '0.5rem' }}
                />
              </label>
              <label>
                To:
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  required
                  style={{ marginLeft: '0.5rem' }}
                />
              </label>
              <label>
                Guests:
                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  required
                  style={{ width: '4rem', marginLeft: '0.5rem' }}
                />
              </label>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6B46C1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Book now
              </button>
            </div>
            {bookingError && <p style={{ color: 'red', marginTop: '1rem' }}>{bookingError}</p>}
            {bookingSuccess && <p style={{ color: 'green', marginTop: '1rem' }}>{bookingSuccess}</p>}
          </form>
        </>
      ) : (
        <p>No venue details found.</p>
      )}
    </div>
  );
}
