// src/components/buttons/DeleteVenueButton.jsx
import React, { useState } from 'react';
import { VENUE_BY_ID_URL } from '../constans/api';

export default function DeleteVenueButton({ venueId, accessToken, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Er du sikker på at du vil slette denne venueen?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(VENUE_BY_ID_URL(venueId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.errors?.[0]?.message || `Error ${res.status}`);
      }
      onDeleted(venueId);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          marginLeft: 8,
          padding: '6px 10px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Sletter...' : 'Slett venue'}
      </button>
      {error && <p style={{ color: 'red', marginTop: 4 }}>{error}</p>}
    </div>
  );
}
