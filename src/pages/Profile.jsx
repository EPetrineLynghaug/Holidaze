// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import DeleteVenueButton from '../components/buttons/DeleteVenueButton';
import {
  PROFILE_BY_NAME_VENUES_URL,
  PROFILE_BY_NAME_BOOKINGS_URL,
  VENUES_URL,
} from '../components/constans/api';
import { getAccessToken } from '../services/tokenService';
import ProfileHeader from '../components/profile/ProfileHeader';
import DashboardInfoSection from '../components/profile/DashboardInfoSection';
import ActiveVenuesSection from '../components/profile/ActiveVenueCard';
import DashboardMobileMenu from '../components/navigation/DashboardMobileMenu';
import ProfileChart from '../components/profile/ProfileChart';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isManager, setIsManager] = useState(
    () => JSON.parse(localStorage.getItem('venueManager')) || false
  );

  // Manager form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mediaUrl: '',
    price: '',
    maxGuests: '',
    city: '',
    address: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Load user or redirect
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) navigate('/', { replace: true });
    else setUser(JSON.parse(stored));
  }, [navigate]);

  // Fetch venues and bookings
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      const token = getAccessToken();
      try {
        const venRes = await fetch(
          PROFILE_BY_NAME_VENUES_URL(user.name),
          { headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY } }
        );
        if (!venRes.ok) throw new Error(`Venues fetch failed: ${venRes.status}`);
        const venJson = await venRes.json();
        setVenues(venJson.data);

        const bookRes = await fetch(
          PROFILE_BY_NAME_BOOKINGS_URL(user.name),
          { headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY } }
        );
        if (!bookRes.ok) throw new Error(`Bookings fetch failed: ${bookRes.status}`);
        const bookJson = await bookRes.json();
        setBookings(bookJson.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Toggle manager mode
  const handleToggleManager = (e) => {
    const on = e.target.checked;
    setIsManager(on);
    localStorage.setItem('venueManager', JSON.stringify(on));
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const token = getAccessToken();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        media: formData.mediaUrl ? [{ url: formData.mediaUrl, alt: formData.name }] : [],
        price: Number(formData.price),
        maxGuests: Number(formData.maxGuests),
        rating: 0,
        meta: { wifi: false, parking: false, breakfast: false, pets: false },
        location: { address: formData.address, city: formData.city, zip: '', country: '', continent: '', lat: 0, lng: 0 },
      };
      const res = await fetch(VENUES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.message || `Create venue failed: ${res.status}`);
      }
      setSuccessMsg('Venue created successfully');
      setFormData({ name: '', description: '', mediaUrl: '', price: '', maxGuests: '', city: '', address: '' });
      const refreshRes = await fetch(
        PROFILE_BY_NAME_VENUES_URL(user.name),
        { headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY } }
      );
      const refreshJson = await refreshRes.json();
      setVenues(refreshJson.data);
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container p-4 font-figtree">
      <ProfileHeader user={user} />

      {/* Mobile menu */}
      <div className="mt-4">
        <DashboardMobileMenu />
      </div>

      {/* Dashboard info */}
      <DashboardInfoSection />

      {/* Manager toggle relocated under info */}
      <div className="mt-4 flex justify-end">
        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" checked={isManager} onChange={handleToggleManager} className="h-4 w-4" />
          <span>Manager mode</span>
        </label>
      </div>

      {/* Bookings chart in styled card */}
      <div className="mt-6 bg-white rounded-xl shadow p-4">
        <ProfileChart bookings={bookings} />
      </div>

      {/* Active venues */}
      <ActiveVenuesSection
        venues={venues}
        loading={loading}
        error={error}
        onDelete={(id) => setVenues((prev) => prev.filter((v) => v.id !== id))}
      />

      {/* Manager: add venue form styling similar to card */}
      {isManager && (
        <div className="mt-8 bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Add New Venue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
            <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
            <input name="mediaUrl" value={formData.mediaUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-3">
              <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price/night" className="p-2 border rounded" />
              <input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} placeholder="Max guests" className="p-2 border rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="p-2 border rounded" />
            </div>
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            {successMsg && <p className="text-green-600">{successMsg}</p>}
            <button type="submit" className="mt-2 w-full py-2 bg-purple-600 text-white rounded">Create Venue</button>
          </form>
        </div>
      )}
    </div>
  );
}