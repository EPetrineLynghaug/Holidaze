import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { getAccessToken } from '../../../services/tokenService';
import { PROFILE_BY_NAME_URL } from '../../constants/api';

export default function ProfileSettingsPage({ userName, onSave }) {
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [profileUrl, setProfileUrl] = useState(null);
  const [profileAlt, setProfileAlt] = useState('');
  const [bannerUrl, setBannerUrl] = useState(null);
  const [bannerAlt, setBannerAlt] = useState('');
  const token = getAccessToken();

  useEffect(() => {
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

        setIsVenueManager(
          JSON.parse(localStorage.getItem('venueManager') ?? JSON.stringify(data.venueManager))
        );
        setProfileUrl(localStorage.getItem('profileUrl') || data.avatar.url || null);
        setProfileAlt(localStorage.getItem('profileAlt') || data.avatar.alt || '');
        setBannerUrl(localStorage.getItem('bannerUrl') || data.banner.url || null);
        setBannerAlt(localStorage.getItem('bannerAlt') || data.banner.alt || '');
      } catch (e) {
        console.error('Could not load profile:', e);
      }
    })();
  }, [userName, token]);

  const toggleVenueManager = (on) => {
    setIsVenueManager(on);
    localStorage.setItem('venueManager', JSON.stringify(on));
  };

  const handleProfileUrlChange = (e) => {
    const url = e.target.value || null;
    setProfileUrl(url);
    localStorage.setItem('profileUrl', url);
  };
  const handleProfileAltChange = (e) => {
    const alt = e.target.value;
    setProfileAlt(alt);
    localStorage.setItem('profileAlt', alt);
  };

  const handleBannerUrlChange = (e) => {
    const url = e.target.value || null;
    setBannerUrl(url);
    localStorage.setItem('bannerUrl', url);
  };
  const handleBannerAltChange = (e) => {
    const alt = e.target.value;
    setBannerAlt(alt);
    localStorage.setItem('bannerAlt', alt);
  };

  const saveToApi = async () => {
    const body = {
      bio: '',
      avatar: { url: profileUrl, alt: profileAlt },
      banner: { url: bannerUrl, alt: bannerAlt },
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
      localStorage.setItem('user', JSON.stringify(data));
      window.dispatchEvent(new Event('authChange'));
      alert('Settings saved!');
      onSave(data);
    } catch (e) {
      console.error(e);
      alert(`Could not save: ${e.message}`);
    }
  };

  return (
    <div className=" lg:w-6xl w-full">
      <section className="rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Profile Settings</h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-lg font-medium text-gray-900">Enable Venue Manager</label>
            <p className="text-md text-gray-600 mt-1">Switch between Traveler & Venue</p>
          </div>
          <Switch
            checked={isVenueManager}
            onChange={toggleVenueManager}
            className={`relative inline-flex items-center flex-shrink-0 h-8 w-16 border-2 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
              isVenueManager ? 'bg-purple-500 border-purple-500' : 'bg-gray-300 border-gray-300'
            }`}
          >
            <span className="sr-only">Toggle venue manager</span>
            <span
              className={`inline-block h-6 w-6 bg-white rounded-full shadow transform transition ease-in-out duration-200 ${
                isVenueManager ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </Switch>
        </div>

        {/* Previews */}
        <div className="flex flex-wrap gap-6 mt-20">
          {profileUrl && (
            <div className="flex-none">
              <p className="text-md font-medium text-gray-900 mb-4">Avatar Preview</p>
              <div className="w-32 h-32 rounded-full overflow-hidden border border-gray-200 mt-10">
                <img
                  src={profileUrl}
                  alt={profileAlt || 'Avatar'}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
                />
              </div>
            </div>
          )}
          {bannerUrl && (
            <div className="flex flex-col ml-auto">
              <p className="text-md font-medium text-gray-900 mb-4">Banner Preview</p>
              <div className="w-135 h-42 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={bannerUrl}
                  alt={bannerAlt || 'Banner'}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.src = '/default-banner.jpg')}
                />
              </div>
            </div>
          )}
        </div>

        {/* URL Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <div>
            <label htmlFor="profileUrl" className="block text-md font-medium text-gray-900 mb-2">
              Profile Picture URL
            </label>
            <input
              id="profileUrl"
              type="url"
              value={profileUrl || ''}
              onChange={handleProfileUrlChange}
              placeholder="https://…/profile.jpg"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 "
            />
            <label htmlFor="profileAlt" className="block text-md font-medium text-gray-900 mt-6 mb-2">
              Profile Picture Alt Text
            </label>
            <input
              id="profileAlt"
              type="text"
              value={profileAlt}
              onChange={handleProfileAltChange}
              placeholder="Describe the profile image"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label htmlFor="bannerUrl" className="block text-md font-medium text-gray-900 mb-2">
              Banner Image URL
            </label>
            <input
              id="bannerUrl"
              type="url"
              value={bannerUrl || ''}
              onChange={handleBannerUrlChange}
              placeholder="https://…/banner.jpg"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
            />
            <label htmlFor="bannerAlt" className="block text-md font-medium text-gray-900 mt-6 mb-2">
              Banner Image Alt Text
            </label>
            <input
              id="bannerAlt"
              type="text"
              value={bannerAlt}
              onChange={handleBannerAltChange}
              placeholder="Describe the banner image"
              className="w-full text-sm px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-10"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md font-medium shadow-sm transition-shadow duration-200"
        >
          Save Settings
        </button>
      </section>
    </div>
  );
}
