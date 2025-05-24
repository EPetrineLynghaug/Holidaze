import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useProfileData from '../hooks/api/useProfileData';

import ProfileHeader from '../components/profile/mobile/ProfileHeader';
import DashboardInfoSection from '../components/profile/mobile/DashboardInfoSection';
import ProfileChartSection from '../components/profile/mobile/ProfileChart';
import ActiveVenuesSection from '../components/profile/shared/ActiveVenueCard';
import DashboardMobileMenu from '../components/navigation/mobile/DashboardMobileMenu';
import DashboardDesktopMenu from '../components/navigation/desktop/DashboardDesctopMeny';
import AddVenueForm from '../components/profile/mobile/ListNewVenue';
import EditVenueForm from '../components/profile/mobile/EditVenueModal';
import ProfileSettings from '../components/profile/mobile/ProfileSettings';
import MyVenuesDashboard from '../components/profile/mobile/MyVenuesDashboard';
import MyBookingsDashboard from '../components/profile/mobile/MyBookingsDashboard';
import BottomSheet from '../components/ui/popup/BottomSheet';
import ProfileSettingsPage from '../components/profile/desktop/ProfileSettings';
import AddVenuePage from '../components/profile/desktop/AddVenuePage';
import MyVenuesDashboardDesktop from '../components/profile/desktop/MyVenuesDashboardDesktop';
import MyBookingsDashboardDesktop from '../components/profile/desktop/MyBookingsDashboardDesktop';

export default function Profile() {
  const navigate = useNavigate();
  const { user, venues, bookings, loading, error } = useProfileData();

  const [showForm, setShowForm] = useState(false);
  const [showMyVenues, setShowMyVenues] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');

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

  const handleListNew = () => {
    if (user.venueManager) {
      setShowForm(true);
      setActiveSection('list');
    }
  };

  return (
    <div className="profile-container px-4 lg:px-0 font-figtree">
      <ProfileHeader user={user} />

      <div className="mt-4 lg:hidden">
        <DashboardMobileMenu
          hasBookings={bookings.length > 0}
          onListNew={handleListNew}
          onSettings={() => setActiveSection('settings')}
          onMyVenues={() => { setShowMyVenues(true); setActiveSection('venues'); }}
          onMyBookings={() => { setShowMyBookings(true); setActiveSection('bookings'); }}
          onDashboard={() => setActiveSection('dashboard')}
          activeSection={activeSection}
          isVenueManager={user.venueManager}
        />
      </div>

      <div className="hidden lg:block">
        <DashboardDesktopMenu
          user={user}
          hasBookings={bookings.length > 0}
          onListNew={handleListNew}
          onSettings={() => setActiveSection('settings')}
          onMyVenues={() => { setShowMyVenues(true); setActiveSection('venues'); }}
          onMyBookings={() => { setShowMyBookings(true); setActiveSection('bookings'); }}
          onDashboard={() => setActiveSection('dashboard')}
          activeSection={activeSection}
        />
      </div>

      {activeSection === 'dashboard' && (
        <>
          <div className="block lg:hidden mt-6">
            <DashboardInfoSection user={user} />
            <ProfileChartSection user={user} venues={venues} bookings={bookings} />
          </div>
          <div className="hidden lg:grid lg:ml-64 lg:pl-12 lg:mt-6 lg:grid-cols-[1fr_1fr] lg:gap-6 lg:items-end px-9">
            <DashboardInfoSection user={user} />
            <div className="self-end mt-4 lg:mt-0">
              <ProfileChartSection user={user} venues={venues} bookings={bookings} />
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

      {activeSection === 'settings' && (
        <>
          <div className="hidden lg:block mt-6 lg:ml-64 lg:pl-12 px-12">
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

      {user.venueManager && showForm && activeSection === 'list' && (
        <>
          <div className="hidden lg:block lg:ml-64 lg:pl-2 px-16">
            <AddVenuePage
              userName={user.name}
              onCreated={() => {
                setShowForm(false);
                setActiveSection('dashboard');
              }}
              hideHeader={true}
            />
          </div>
          <div className="block lg:hidden">
            <AddVenueForm
              userName={user.name}
              onCreated={() => {
                setShowForm(false);
                setActiveSection('dashboard');
              }}
              onClose={() => {
                setShowForm(false);
                setActiveSection('dashboard');
              }}
            />
          </div>
        </>
      )}

      {showEditForm && selectedVenue && (
        <BottomSheet title="Edit Venue" onClose={() => setShowEditForm(false)}>
          <EditVenueForm
            userName={user.name}
            existingVenue={selectedVenue}
            onCreated={() => {
              setShowEditForm(false);
            }}
            onClose={() => setShowEditForm(false)}
          />
        </BottomSheet>
      )}

      {showMyVenues && activeSection === 'venues' && (
        <>
          <div className="hidden lg:block mt-6 lg:ml-64 lg:pl-12 px-12">
            <MyVenuesDashboardDesktop onClose={() => setShowMyVenues(false)} />
          </div>
          <div className="block lg:hidden">
            <BottomSheet
              title="My Venues"
              onClose={() => {
                setShowMyVenues(false);
                setActiveSection('dashboard');
              }}
            >
              <MyVenuesDashboard
                onClose={() => {
                  setShowMyVenues(false);
                  setActiveSection('dashboard');
                }}
              />
            </BottomSheet>
          </div>
        </>
      )}

      {showMyBookings && activeSection === 'bookings' && (
        <>
          <div className="hidden lg:block mt-6 lg:ml-64 lg:pl-6 px-6">
            <MyBookingsDashboardDesktop
              onClose={() => {
                setShowMyBookings(false);
                setActiveSection('dashboard');
              }}
            />
          </div>
          <div className="block lg:hidden">
            <BottomSheet
              title="My Bookings"
              onClose={() => {
                setShowMyBookings(false);
                setActiveSection('dashboard');
              }}
            >
              <MyBookingsDashboard
                onClose={() => {
                  setShowMyBookings(false);
                  setActiveSection('dashboard');
                }}
              />
            </BottomSheet>
          </div>
        </>
      )}
    </div>
  );
}
