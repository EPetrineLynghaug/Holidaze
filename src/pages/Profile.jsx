import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  PROFILE_BY_NAME_VENUES_URL,
  PROFILE_BY_NAME_BOOKINGS_URL,
} from '../components/constans/api';
import { getAccessToken } from '../services/tokenService';
import ProfileHeader from '../components/profile/mobile/ProfileHeader';
import DashboardInfoSection from '../components/profile/mobile/DashboardInfoSection';
import ActiveVenuesSection from '../components/profile/mobile/ActiveVenueCard';
import DashboardMobileMenu from '../components/navigation/mobile/DashboardMobileMenu';
import ProfileChart from '../components/profile/mobile/ProfileChart';
import AddVenueForm from '../components/profile/mobile/ListNewVenue';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [venues, setVenues]     = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [isManager, setIsManager] = useState(
    () => JSON.parse(localStorage.getItem('venueManager')) || false
  );
  const [showForm, setShowForm] = useState(false);

  // Load user or redirect
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return navigate('/', { replace: true });
    setUser(JSON.parse(stored));
  }, [navigate]);

  // Fetch venues
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    const token = getAccessToken();
    fetch(`${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`, {
      headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY },
    })
      .then(r => { if (!r.ok) throw new Error(`Fetch failed: ${r.status}`); return r.json(); })
      .then(j => setVenues(j.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch bookings
  useEffect(() => {
    if (!user) return;
    const token = getAccessToken();
    fetch(`${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`, {
      headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY },
    })
      .then(r => r.ok ? r.json() : Promise.reject(`Error ${r.status}`))
      .then(j => setBookings(j.data))
      .catch(() => {/* silent */});
  }, [user]);

  const handleToggleManager = e => {
    const checked = e.target.checked;
    setIsManager(checked);
    localStorage.setItem('venueManager', JSON.stringify(checked));
  };

  if (!user) return null;

  return (
    <div className="profile-container p-4 font-figtree">
      <ProfileHeader user={user} />
      <div className="mt-4">
        <DashboardMobileMenu
          hasBookings={bookings.length > 0}
          onListNew={() => setShowForm(true)}
        />
      </div>

      <DashboardInfoSection />
      <ProfileChart venues={venues} bookings={bookings} />
      <ActiveVenuesSection
        venues={venues}
        loading={loading}
        error={error}
        onDelete={id => setVenues(vs => vs.filter(v => v.id !== id))}
      />

      {/* Manager toggle */}
      <div className="mt-6 flex items-center">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isManager}
            onChange={handleToggleManager}
            className="h-4 w-4 text-purple-600 border-gray-300 rounded"
          />
          <span className="text-sm">Enable venue manager</span>
        </label>
      </div>

      {/* Popup form modal */}
      {isManager && showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex justify-end p-2">
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <AddVenueForm
              userName={user.name}
              onCreated={data => { setVenues(data); setShowForm(false); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}