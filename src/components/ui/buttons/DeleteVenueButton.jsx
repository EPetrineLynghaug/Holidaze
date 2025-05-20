import React, { useState } from 'react';
import { VENUE_BY_ID_URL } from '../../constants/api';
import { getAccessToken } from '../../../services/tokenService';
import DeleteConfirmPopup from '../popup/DeleteConfirmPopup';

// NB: Material Symbols font må være importert i index.html

export default function DeleteVenueButton({ venueId, onDeleted, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async (e) => {
    if (e) e.stopPropagation();
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

      if (onDeleted) onDeleted(venueId);
      setShowConfirm(false);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setShowConfirm(true);
        }}
        disabled={loading}
        className={`
          flex items-center justify-center w-9 h-9 rounded-full
          bg-gray-100 hover:bg-red-100 text-red-600 shadow
          transition focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title="Delete"
        aria-label="Delete"
      >
        <span className="material-symbols-outlined text-xl">
          {loading ? 'hourglass_empty' : 'delete'}
        </span>
      </button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {showConfirm && (
        <DeleteConfirmPopup
          onCancel={e => {
            if (e) e.stopPropagation();
            setShowConfirm(false);
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
