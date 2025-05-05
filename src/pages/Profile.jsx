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
import ProfileSettings from '../components/profile/mobile/ProfileSettings';
import BottomSheet from '../components/ui/mobildemodal/BottomSheet';

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venuesError, setVenuesError] = useState('');
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load user or redirect
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/', { replace: true });
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  // Fetch venues
  useEffect(() => {
    if (!user) return;
    setLoadingVenues(true);
    setVenuesError('');
    const token = getAccessToken();

    fetch(`${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
      },
    })
      .then(r => { if (!r.ok) throw new Error(`Fetch failed: ${r.status}`); return r.json(); })
      .then(j => setVenues(j.data))
      .catch(e => setVenuesError(e.message))
      .finally(() => setLoadingVenues(false));
  }, [user]);

  // Fetch bookings
  useEffect(() => {
    if (!user) return;
    setLoadingBookings(true);
    setBookingsError('');
    const token = getAccessToken();

    fetch(`${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
      },
    })
      .then(r => r.ok ? r.json() : Promise.reject(`Error ${r.status}`))
      .then(j => setBookings(j.data))
      .catch(e => setBookingsError(e.toString()))
      .finally(() => setLoadingBookings(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="profile-container p-4 font-figtree">
      {/* Header */}
      <ProfileHeader user={user} />

      {/* Mobile Dashboard-meny */}
      <div className="mt-4">
        <DashboardMobileMenu
          hasBookings={bookings.length > 0}
          onListNew={() => setShowForm(true)}
          onSettings={() => setShowSettings(true)}
        />
      </div>

      {/* Info & chart */}
      <DashboardInfoSection />
      <ProfileChart venues={venues} bookings={bookings} />

      {/* Venues list with loading/error handling */}
      {loadingVenues ? (
        <p className="text-center py-4">Loading venues…</p>
      ) : venuesError ? (
        <p className="text-center py-4 text-red-500">{venuesError}</p>
      ) : (
        <ActiveVenuesSection
          venues={venues}
          loading={loadingVenues}
          error={venuesError}
          onDelete={id => setVenues(vs => vs.filter(v => v.id !== id))}
        />
      )}

   {/* Create Venue modal (for managers) */}
{user.venueManager && showForm && (
  <BottomSheet title="Create Venue" onClose={() => setShowForm(false)}>
    <AddVenueForm
      userName={user.name}
      onCreated={data => {
        setVenues(data);
        setShowForm(false);
      }}
      onClose={() => setShowForm(false)}
    />
  </BottomSheet>
)}
{showSettings && (
  <BottomSheet title="Settings" onClose={() => setShowSettings(false)}>
    <ProfileSettings
      userName={user.name}
      onSave={(updatedProfile) => {
        setUser(updatedProfile);
        localStorage.setItem('user', JSON.stringify(updatedProfile));
      }}
      onClose={() => setShowSettings(false)}
    />
  </BottomSheet>
)}
    </div>
  );
}
