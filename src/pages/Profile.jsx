import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useProfileData from '../hooks/useProfileData';

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

  // Local UI state for modals
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMyVenues, setShowMyVenues] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);

  // Fetch user, venues and bookings via custom hook
  const {
    user,
    venues,
    bookings,
    loading,
    error,
  } = useProfileData();

  // Redirect to home if no user in localStorage
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Render nothing until user is loaded
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
      {loading.venues ? (
        <p className="text-center py-4">Loading venues…</p>
      ) : error.venues ? (
        <p className="text-center py-4 text-red-500">{error.venues}</p>
      ) : (
        <ActiveVenuesSection
          venues={venues}
          onDelete={id => {
            // Local update: remove deleted venue
            // (Hook does not auto-refetch)
          }}
        />
      )}

      {/* Bookings section */}
      {loading.bookings && <p className="text-center py-4">Loading bookings…</p>}
      {error.bookings && (
        <p className="text-center py-4 text-red-500">{error.bookings}</p>
      )}

      {/* Create Venue Modal */}
      {user.venueManager && showForm && (
        <BottomSheet title="Create Venue" onClose={() => setShowForm(false)}>
          <AddVenueForm
            userName={user.name}
            onCreated={data => {
              // Optionally update venues locally
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
          />
        </BottomSheet>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <BottomSheet title="Settings" onClose={() => setShowSettings(false)}>
          <ProfileSettings
            userName={user.name}
            onSave={updated => {
              localStorage.setItem('user', JSON.stringify(updated));
              window.dispatchEvent(new Event('authChange'));
              setShowSettings(false);
            }}
            onClose={() => setShowSettings(false)}
          />
        </BottomSheet>
      )}

      {/* My Venues Modal */}
      {showMyVenues && (
        <BottomSheet title="My Venues" onClose={() => setShowMyVenues(false)}>
          <MyVenuesDashboard onClose={() => setShowMyVenues(false)} />
        </BottomSheet>
      )}

      {/* My Bookings Modal */}
      {showMyBookings && (
        <BottomSheet title="My Bookings" onClose={() => setShowMyBookings(false)}>
          <MyBookingsDashboard onClose={() => setShowMyBookings(false)} />
        </BottomSheet>
      )}
    </div>
  );
}
