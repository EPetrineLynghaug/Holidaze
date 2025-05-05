import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  PROFILE_BY_NAME_VENUES_URL,
  PROFILE_BY_NAME_BOOKINGS_URL,
} from '../components/constans/api';
import { getAccessToken } from '../services/tokenService';
import ProfileHeader from '../components/profile/mobile/ProfileHeader';
import DashboardInfoSection from '../components/profile/mobile/DashboardInfoSection';
import ProfileChart from '../components/profile/mobile/ProfileChart';
import ActiveVenuesSection from '../components/profile/mobile/ActiveVenueCard';
import DashboardMobileMenu from '../components/navigation/mobile/DashboardMobileMenu';
import AddVenueForm from '../components/profile/mobile/ListNewVenue';
import ProfileSettings from '../components/profile/mobile/ProfileSettings';
import MyVenuesDashboard from '../components/profile/mobile/MyVenuesDashboard';
import MyBookingsDashboard from '../components/profile/mobile/MyBookingsDashboard';
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
  const [showMyVenues, setShowMyVenues] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);

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
    (async () => {
      setLoadingVenues(true);
      setVenuesError('');
      try {
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`,
          { headers: {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
          }});
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const { data } = await res.json();
        setVenues(data);
      } catch (err) {
        setVenuesError(err.message || 'Failed to load venues.');
      } finally {
        setLoadingVenues(false);
      }
    })();
  }, [user]);

  // Fetch bookings
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingBookings(true);
      setBookingsError('');
      try {
        const token = getAccessToken();
        const res = await fetch(
          `${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`,
          { headers: {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
          }});
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const { data } = await res.json();
        setBookings(data);
      } catch (err) {
        setBookingsError(err.message || 'Failed to load bookings.');
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [user]);

  if (!user) return null;

  return (
    <div className="profile-container p-4 font-figtree">
      <ProfileHeader user={user} />

      <div className="mt-4">
        <DashboardMobileMenu
          hasBookings={bookings.length > 0}
          onListNew={() => setShowForm(true)}
          onSettings={() => setShowSettings(true)}
          onMyVenues={() => setShowMyVenues(true)}
          onMyBookings={() => setShowMyBookings(true)}
        />
      </div>

      <DashboardInfoSection />
      <ProfileChart venues={venues} bookings={bookings} />

      {/* Venues section */}
      {loadingVenues ? (
        <p className="text-center py-4">Loading venues…</p>
      ) : venuesError ? (
        <p className="text-center py-4 text-red-500">{venuesError}</p>
      ) : (
        <ActiveVenuesSection
          venues={venues}
          loading={loadingVenues}
          error={venuesError}
          onDelete={id => setVenues(prev => prev.filter(v => v.id !== id))}
        />
      )}

      {/* Bookings placeholder */}
      {loadingBookings && <p className="text-center py-4">Loading bookings…</p>}
      {bookingsError && <p className="text-center py-4 text-red-500">{bookingsError}</p>}

      {/* Modals */}
      {user.venueManager && showForm && (
        <BottomSheet title="Create Venue" onClose={() => setShowForm(false)}>
          <AddVenueForm
            userName={user.name}
            onCreated={data => { setVenues(data); setShowForm(false); }}
            onClose={() => setShowForm(false)}
          />
        </BottomSheet>
      )}
      {showSettings && (
        <BottomSheet title="Settings" onClose={() => setShowSettings(false)}>
          <ProfileSettings
            userName={user.name}
            onSave={updated => { setUser(updated); localStorage.setItem('user', JSON.stringify(updated)); }}
            onClose={() => setShowSettings(false)}
          />
        </BottomSheet>
      )}
      {showMyVenues && (
        <BottomSheet title="My Venues" onClose={() => setShowMyVenues(false)}>
          <MyVenuesDashboard onClose={() => setShowMyVenues(false)} />
        </BottomSheet>
      )}
      {showMyBookings && (
        <BottomSheet title="My Bookings" onClose={() => setShowMyBookings(false)}>
          <MyBookingsDashboard onClose={() => setShowMyBookings(false)} />
        </BottomSheet>
      )}
    </div>
  );
}
