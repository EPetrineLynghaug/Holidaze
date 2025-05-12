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
import EditVenueForm from '../components/profile/mobile/EditVenueModal';

export default function Profile() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMyVenues, setShowMyVenues] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  const { user, venues, bookings, loading, error } = useProfileData();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  if (!user) return null;

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setShowEditForm(true);
  };

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

      {loading.venues ? (
        <p className="text-center py-4">Loading venues…</p>
      ) : error.venues ? (
        <p className="text-center py-4 text-red-500">{error.venues}</p>
      ) : (
        <ActiveVenuesSection
          venues={venues}
          onEdit={handleEditVenue}
          onDelete={(id) => {}}
        />
      )}

      {loading.bookings && <p className="text-center py-4">Loading bookings…</p>}
      {error.bookings && (
        <p className="text-center py-4 text-red-500">{error.bookings}</p>
      )}

      {showForm && (
        <BottomSheet title="Create Venue" onClose={() => setShowForm(false)}>
          <AddVenueForm
            userName={user.name}
            onCreated={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </BottomSheet>
      )}

      {showEditForm && selectedVenue && (
        <BottomSheet title="Edit Venue" onClose={() => setShowEditForm(false)}>
          <EditVenueForm
            userName={user.name}
            existingVenue={selectedVenue}
            onCreated={() => setShowEditForm(false)}
            onClose={() => setShowEditForm(false)}
          />
        </BottomSheet>
      )}

      {showSettings && (
        <BottomSheet title="Settings" onClose={() => setShowSettings(false)}>
          <ProfileSettings
            userName={user.name}
            onSave={(updated) => {
              localStorage.setItem('user', JSON.stringify(updated));
              window.dispatchEvent(new Event('authChange'));
              setShowSettings(false);
            }}
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
