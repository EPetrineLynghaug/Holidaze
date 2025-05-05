import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { getAccessToken } from '../../../services/tokenService';
import { PROFILE_BY_NAME_URL } from '../../constans/api';

export default function ProfileSettings({ userName, onSave, onClose }) {
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [profileUrl, setProfileUrl]         = useState('');
  const [bannerUrl, setBannerUrl]           = useState('');
  const token = getAccessToken();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

   
    (async () => {
      try {
        const res = await fetch(PROFILE_BY_NAME_URL(userName), {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const { data } = await res.json();

        // Use localStorage override if present, otherwise server value
        const storedVM = localStorage.getItem('venueManager');
        setIsVenueManager(storedVM != null
          ? JSON.parse(storedVM)
          : data.venueManager);

        const storedProfile = localStorage.getItem('profileUrl');
        setProfileUrl(storedProfile || data.avatar.url);

        const storedBanner = localStorage.getItem('bannerUrl');
        setBannerUrl(storedBanner || data.banner.url);
      } catch (e) {
        console.error('Could not load profile:', e);
      }
    })();

    return () => {
      document.body.style.overflow = '';
    };
  }, [userName, token]);

  const toggleVenueManager = (on) => {
    setIsVenueManager(on);
    localStorage.setItem('venueManager', JSON.stringify(on));
  };

  const handleProfileUrlChange = (e) => {
    const url = e.target.value;
    setProfileUrl(url);
    localStorage.setItem('profileUrl', url);
  };

  const handleBannerUrlChange = (e) => {
    const url = e.target.value;
    setBannerUrl(url);
    localStorage.setItem('bannerUrl', url);
  };

  const saveToApi = async () => {
    const body = {
      bio: '',
      avatar: { url: profileUrl, alt: '' },
      banner: { url: bannerUrl, alt: '' },
      venueManager: isVenueManager,
    };
    const res = await fetch(PROFILE_BY_NAME_URL(userName), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  };

  const handleSave = async () => {
    try {
      const { data } = await saveToApi();

      // Update stored user so other components pick up new URLs
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));

      alert('Settings saved!');
      onSave(data);
      onClose();
    } catch (e) {
      console.error(e);
      alert(`Could not save: ${e.message}`);
    }
  };

  return (
    <section className="fixed inset-x-0 bottom-0 h-4/5 z-50">
      <div className="absolute inset-0 bg-white rounded-t-3xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-3 border-b border-purple-100">
          <button
            onClick={onClose}
            className="material-symbols-outlined text-xl text-purple-700"
          >
            close
          </button>
          <h2 className="text-lg font-semibold text-purple-900">Settings</h2>
          <div className="w-6" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-base font-medium">
                Enable Venue Manager
              </label>
              <p className="text-sm text-gray-500">
                Switch between Traveler & Venue modes
              </p>
            </div>
            <Switch
              checked={isVenueManager}
              onChange={toggleVenueManager}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isVenueManager ? 'bg-purple-300' : 'bg-purple-100'
              }`}
            >
              <span className="sr-only">Toggle venue manager</span>
              <span
                className={`inline-block h-4 w-4 transform bg-white rounded-full transition-transform duration-200 ${
                  isVenueManager ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </Switch>
          </div>

          <div className="space-y-1">
            <label htmlFor="profileUrl" className="block text-base font-medium">
              Profile Picture URL
            </label>
            <input
              id="profileUrl"
              type="url"
              value={profileUrl}
              onChange={handleProfileUrlChange}
              placeholder="https://…/profile.jpg"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-300 focus:border-purple-300"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="bannerUrl" className="block text-base font-medium">
              Banner Image URL
            </label>
            <input
              id="bannerUrl"
              type="url"
              value={bannerUrl}
              onChange={handleBannerUrlChange}
              placeholder="https://…/banner.jpg"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-300 focus:border-purple-300"
            />
          </div>
        </div>

        {/* Footer Save */}
        <div className="p-4 bg-white border-t border-purple-100">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-purple-300 hover:bg-purple-400 text-white rounded-lg font-semibold"
          >
            Save Settings
          </button>
        </div>
      </div>
    </section>
  );
}
