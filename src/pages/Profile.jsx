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
import ProfileSettingsPage from '../components/profile/desktop/ProfileSettings';

export default function Profile() {
  const navigate = useNavigate();
  const { user, venues, bookings, loading, error } = useProfileData();

  // Local UI state for modals
  const [showForm, setShowForm] = useState(false);
  const [showMyVenues, setShowMyVenues] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Redirect to home if no user in localStorage
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

  const handleSaveSettings = (updated) => {
    localStorage.setItem('user', JSON.stringify(updated));
    window.dispatchEvent(new Event('authChange'));
    setActiveSection('dashboard');
  };

  return (
    <div className="profile-container px-4 lg:px-0 font-figtree">
      <ProfileHeader user={user} />

      {/* Mobile dashboard menu */}
      <div className="mt-4 lg:hidden">
        <DashboardMobileMenu
          hasBookings={bookings.length > 0}
          onListNew={() => setShowForm(true)}
          onSettings={() => setActiveSection('settings')}
          onMyVenues={() => setShowMyVenues(true)} 
          onMyBookings={() => setShowMyBookings(true)} 
          onDashboard={() => setActiveSection('dashboard')}
          activeSection={activeSection}
        />
      </div>

      {/* Desktop sidebar menu */}
      <div className="hidden lg:block">
        <DashboardDesktopMenu
          user={user}
          hasBookings={bookings.length > 0}
          onListNew={() => { setShowForm(true); setActiveSection('list'); }}
          onSettings={() => setActiveSection('settings')}
          onMyVenues={() => setShowMyVenues(true)} 
          onMyBookings={() => setShowMyBookings(true)} 
          onDashboard={() => setActiveSection('dashboard')}
          activeSection={activeSection}
        />
      </div>

      {/* Dashboard Content */}
      {activeSection === 'dashboard' && (
        <>
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

          <div className="block lg:hidden mt-6 px-2">
            <ActiveVenuesSection
              venues={venues}
              loading={loading.venues}
              error={error.venues}
              onEdit={handleEditVenue}
              onDelete={() => {}}
            />
          </div>
          <div className="hidden lg:block mt-6 lg:ml-64 lg:pl-12 px-12">
            <ActiveVenuesSection
              venues={venues}
              loading={loading.venues}
              error={error.venues}
              onEdit={handleEditVenue}
              onDelete={() => {}}
            />
          </div>
        </>
      )}

      {/* Settings Section */}
      {activeSection === 'settings' && (
        <>
<div className="hidden lg:block lg:ml-64 lg:pl-2 px-16" aria-labelledby="settings-heading">
            <ProfileSettingsPage userName={user.name} onSave={handleSaveSettings} />
          </div>
          <div className="block lg:hidden">
            <BottomSheet title="Settings" onClose={() => setActiveSection('dashboard')}>
              <ProfileSettings
                userName={user.name}
                onSave={handleSaveSettings}
                onClose={() => setActiveSection('dashboard')}
              />
            </BottomSheet>
          </div>
        </>
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
