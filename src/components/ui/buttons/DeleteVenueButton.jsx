import React, { useState } from 'react';
import { VENUE_BY_ID_URL } from '../../constants/api';
import { getAccessToken } from '../../../services/tokenService';
import DeleteConfirmPopup from '../mobildemodal/DeleteConfirmPopup';

export default function DeleteVenueButton({ venueId, onDeleted, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const token = getAccessToken();
      const res = await fetch(VENUE_BY_ID_URL(venueId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.errors?.[0]?.message || `Error ${res.status}`);
      }

      onDeleted(venueId);
      window.location.reload();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className={`inline-flex items-center px-2 py-1 text-sm font-medium text-red-600 hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {loading ? 'Deleting…' : 'Delete'}
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {showConfirm && (
        <DeleteConfirmPopup
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
