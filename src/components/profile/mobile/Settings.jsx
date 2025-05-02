import React, { useEffect, useState } from 'react';


export default function Settings() {
  // Venue Manager toggle persisted in localStorage
  const [isVenueManager, setIsVenueManager] = useState(false);

  // Profile and Banner URLs
  const [profileUrl, setProfileUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // Load persisted state on mount
  useEffect(() => {
    const storedToggle = localStorage.getItem('venueManagerEnabled');
    if (storedToggle !== null) {
      setIsVenueManager(storedToggle === 'true');
    }

    const storedProfile = localStorage.getItem('profileUrl');
    if (storedProfile) setProfileUrl(storedProfile);

    const storedBanner = localStorage.getItem('bannerUrl');
    if (storedBanner) setBannerUrl(storedBanner);
  }, []);

  // Handlers
  const handleToggle = (enabled) => {
    setIsVenueManager(enabled);
    localStorage.setItem('venueManagerEnabled', enabled);
  };

  const handleUpdateProfile = () => {
    localStorage.setItem('profileUrl', profileUrl);
    alert('Profile picture updated!');
  };

  const handleUpdateBanner = () => {
    localStorage.setItem('bannerUrl', bannerUrl);
    alert('Banner image updated!');
  };

  return (
    <div className="settings-container max-w-md mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">Settings</h2>

      {/* Venue Manager Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="font-medium">Enable Venue Manager</label>
          <p className="text-sm text-gray-500">Switch between guest and venues</p>
        </div>
        <Switch
          checked={isVenueManager}
          onChange={handleToggle}
          style={{
            backgroundColor: isVenueManager
              ? 'var(--color-btn-light)'
              : 'var(--color-border-soft)',
          }}
          className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200"
        >
          <span className="sr-only">Toggle venue manager</span>
          <span
            className="inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200"
            style={{ transform: isVenueManager ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
          />
        </Switch>
      </div>

      {/* Profile Picture Input */}
      <div className="space-y-2">
        <label className="font-medium">Profile Picture</label>
        <div className="flex gap-2">
          <Input
            placeholder="https://img.url/picture.jpg"
            value={profileUrl}
            onChange={e => setProfileUrl(e.target.value)}
            className="flex-1 border border-[var(--color-border-soft)] rounded"
          />
          <button className="profile-btn" onClick={handleUpdateProfile}>
            Update
          </button>
        </div>
      </div>

      {/* Banner Image Input */}
      <div className="space-y-2">
        <label className="font-medium">Banner Image</label>
        <div className="flex gap-2">
          <Input
            placeholder="https://img.url/banner.jpg"
            value={bannerUrl}
            onChange={e => setBannerUrl(e.target.value)}
            className="flex-1 border border-[var(--color-border-soft)] rounded"
          />
          <button className="profile-btn" onClick={handleUpdateBanner}>
            Update
          </button>
        </div>
      </div>
    </div>
    
  );
}
