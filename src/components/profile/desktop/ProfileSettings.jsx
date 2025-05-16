import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { getAccessToken } from '../../../services/tokenService';
import { PROFILE_BY_NAME_URL } from '../../constants/api';

// Section wrapper matching AddVenuePage style
const Section = ({ icon, title, children }) => (
  <section className="bg-white shadow rounded-lg p-6 md:p-8 space-y-6 ring-1 ring-gray-100">
    <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-purple-700">
      <span className="material-symbols-outlined text-purple-600" aria-hidden>{icon}</span>
      {title}
    </h2>
    {children}
  </section>
);

export default function ProfileSettingsPage({ userName, onSave }) {
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [profileUrl, setProfileUrl] = useState(null);
  const [profileAlt, setProfileAlt] = useState('');
  const [bannerUrl, setBannerUrl] = useState(null);
  const [bannerAlt, setBannerAlt] = useState('');
  const token = getAccessToken();

  useEffect(() => {
    document.body.style.overflow = 'auto';
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

  const toggleVenueManager = (enabled) => {
    setIsVenueManager(enabled);
    localStorage.setItem('venueManager', JSON.stringify(enabled));
  };

  const handleChange = (setter, key) => (e) => {
    const val = e.target.value || null;
    setter(val);
    localStorage.setItem(key, val);
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

  const handleSave = async (e) => {
    e.preventDefault();
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
<main className="w-full max-w-none ml-0">
<form
  onSubmit={handleSave}
  className=" mt-10 mb-20 px-50 max-h-screen overflow-y-auto space-y-8 "
>

    <header className="space-y-2 text-left">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
        Profile Settings
      </h1>
      <p className="text-gray-600 max-w-2xl">
        Manage your profile pictures and mode
      </p>
    </header>
  
    <Section icon="sync_alt" title="Venue Manager Mode">
      <div className="flex items-center justify-between w-full">
        <p className="text-sm text-gray-700">Switch between Traveler & Venue modes</p>
        <Switch
          checked={isVenueManager}
          onChange={toggleVenueManager}
          className={`inline-flex items-center h-8 w-16 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
            isVenueManager ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <span className="sr-only">Toggle venue manager</span>
          <span
            className={`inline-block h-6 w-6 bg-white rounded-full shadow transform transition-transform ${
              isVenueManager ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </Switch>
      </div>
    </Section>
  
    <Section icon="image" title="Profile & Banner Images">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="space-y-4 w-full">
          <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700">
            Profile Picture URL
          </label>
          <input
            id="profileUrl"
            type="url"
            value={profileUrl || ''}
            onChange={handleChange(setProfileUrl, 'profileUrl')}
            placeholder="https://example.com/avatar.jpg"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
          />
          <label htmlFor="profileAlt" className="block text-sm font-medium text-gray-700">
            Alt Text
          </label>
          <input
            id="profileAlt"
            type="text"
            value={profileAlt}
            onChange={handleChange(setProfileAlt, 'profileAlt')}
            placeholder="Describe your avatar"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
          />
        </div>
        <div className="space-y-4 w-full">
          <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700">
            Banner Image URL
          </label>
          <input
            id="bannerUrl"
            type="url"
            value={bannerUrl || ''}
            onChange={handleChange(setBannerUrl, 'bannerUrl')}
            placeholder="https://example.com/banner.jpg"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
          />
          <label htmlFor="bannerAlt" className="block text-sm font-medium text-gray-700">
            Alt Text
          </label>
          <input
            id="bannerAlt"
            type="text"
            value={bannerAlt}
            onChange={handleChange(setBannerAlt, 'bannerAlt')}
            placeholder="Describe your banner"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
          />
        </div>
      </div>
    </Section>
  
    <Section icon="visibility" title="Preview Images">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {profileUrl && (
          <div className="text-center w-full">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border border-gray-200">
              <img
                src={profileUrl}
                alt={profileAlt || 'Avatar'}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
              />
            </div>
            <p className="mt-2 text-gray-600">Avatar Preview</p>
          </div>
        )}
        {bannerUrl && (
          <div className="text-center w-full">
            <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={bannerUrl}
                alt={bannerAlt || 'Banner'}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = '/default-banner.jpg')}
              />
            </div>
            <p className="mt-2 text-gray-600">Banner Preview</p>
          </div>
        )}
      </div>
    </Section>
  
    <div className="pt-6 flex justify-end w-full">
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow hover:bg-purple-700 transition mb-40"
      >
        Save Settings
      </button>
    </div>
  </form>
  </main>

);
}