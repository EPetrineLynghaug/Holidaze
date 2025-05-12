
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useProfileData from '../hooks/useProfileData';

import ProfileHeader from '../components/profile/mobile/ProfileHeader';
import DashboardInfoSection from '../components/profile/mobile/DashboardInfoSection';
import ProfileChart from '../components/profile/mobile/ProfileChart';
import ActiveVenuesSection from '../components/profile/mobile/ActiveVenueCard';
import DashboardMobileMenu from '../components/navigation/mobile/DashboardMobileMenu';
import DashboardDesktopMenu from '../components/navigation/desktop/DashboardDesctopMeny';
import AddVenueForm from '../components/profile/mobile/ListNewVenue';
import EditVenueForm from '../components/profile/mobile/EditVenueModal';  
import ProfileSettings from '../components/profile/mobile/ProfileSettings';
import MyVenuesDashboard from '../components/profile/mobile/MyVenuesDashboard';
import MyBookingsDashboard from '../components/profile/mobile/MyBookingsDashboard';
import BottomSheet from '../components/ui/mobildemodal/BottomSheet';

export default function Profile() {
  const navigate = useNavigate();
  const { user, venues, bookings, loading, error } = useProfileData();

  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMyVenues, setShowMyVenues] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

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
    <div className="profile-container px-4 lg:px-0 font-figtree">
      {/* Header */}
      <ProfileHeader user={user} />

      {/* Mobile dashboard menu */}
      <div className="mt-4 lg:hidden">
        <DashboardMobileMenu
          hasBookings={bookings.length > 0}
          onListNew={() => setShowForm(true)}
          onSettings={() => setShowSettings(true)}
          onMyVenues={() => setShowMyVenues(true)}
          onMyBookings={() => setShowMyBookings(true)}
        />
      </div>

      {/* Desktop sidebar menu */}
      <div className="hidden lg:block">
        <DashboardDesktopMenu
          user={user}
          hasBookings={bookings.length > 0}
          onListNew={() => setShowForm(true)}
          onSettings={() => setShowSettings(true)}
          onMyVenues={() => setShowMyVenues(true)}
          onMyBookings={() => setShowMyBookings(true)}
        />
      </div>

      {/* Info + Chart */}
      <div className="block lg:hidden mt-6">
        <DashboardInfoSection user={user} />
        <ProfileChart venues={venues} bookings={bookings} />
      </div>
      <div className="hidden lg:grid lg:ml-64 lg:pl-12 lg:mt-6 lg:grid-cols-[1fr_1fr] lg:gap-6 lg:items-end">
        <DashboardInfoSection user={user} />
        <div className="self-end mt-4 lg:mt-0">
          <ProfileChart venues={venues} bookings={bookings} />
        </div>
      </div>

      {/* Active Venues Section */}
      {loading.venues ? (
        <p className="text-center py-4">Loading venues…</p>
      ) : error.venues ? (
        <p className="text-center py-4 text-red-500">{error.venues}</p>
      ) : (
        <div className="mt-8">
          <ActiveVenuesSection
            venues={venues}
            onEdit={handleEditVenue}
            onDelete={() => {}}
          />
        </div>
      )}

      {/* Bookings Section */}
      {loading.bookings && <p className="text-center py-4">Loading bookings…</p>}
      {error.bookings && (
        <p className="text-center py-4 text-red-500">{error.bookings}</p>
      )}

      {/* Create Venue Modal */}
      {user.venueManager && showForm && (
        <BottomSheet title="Create Venue" onClose={() => setShowForm(false)}>
          <AddVenueForm
            userName={user.name}
            onCreated={() => setShowForm(false)}
            onClose={() => setShowForm(false)}
          />
        </BottomSheet>
      )}

      {/* Edit Venue Modal */}
      {showEditForm && selectedVenue && (
        <BottomSheet title="Edit Venue" onClose={() => setShowEditForm(false)}>
          <EditVenueForm
            userName={user.name}
            existingVenue={selectedVenue}
            onCreated={() => {
              setShowEditForm(false);
              // optionally refresh profile data here
            }}
            onClose={() => setShowEditForm(false)}
          />
        </BottomSheet>
      )}

      {/* Settings Modal */}
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
