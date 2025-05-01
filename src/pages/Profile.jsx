
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import {
  PROFILE_BY_NAME_VENUES_URL,
  PROFILE_BY_NAME_BOOKINGS_URL,
  VENUES_URL,
} from '../components/constans/api';
import { getAccessToken } from '../services/tokenService';
import ProfileHeader from '../components/profile/mobile/ProfileHeader';
import DashboardInfoSection from '../components/profile/mobile/DashboardInfoSection';
import ActiveVenuesSection from '../components/profile/mobile/ActiveVenueCard';
import DashboardMobileMenu from '../components/navigation/mobile/DashboardMobileMenu';
import ProfileChart from '../components/profile/mobile/ProfileChart';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [venues, setVenues]     = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [isManager, setIsManager] = useState(
    () => JSON.parse(localStorage.getItem('venueManager')) || false
  );

  const [formData, setFormData] = useState({
    name: '', description: '', mediaUrl: '',
    price: '', maxGuests: '', city: '', address: '',
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg]     = useState('');

  // 1) Load user or redirect
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return navigate('/', { replace: true });
    setUser(JSON.parse(stored));
  }, [navigate]);

  // 2) Fetch venues with embedded bookings
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError('');
    const token = getAccessToken();
    fetch(`${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`, {
      headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY },
    })
      .then(r => { if (!r.ok) throw new Error(`Fetch failed: ${r.status}`); return r.json() })
      .then(j => setVenues(j.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  // 3) Fetch flat bookings list for filter fallback
  useEffect(() => {
    if (!user) return;
    const token = getAccessToken();
    fetch(`${PROFILE_BY_NAME_BOOKINGS_URL(user.name)}?_venue=true`, {
      headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY },
    })
      .then(r => r.ok ? r.json() : Promise.reject(`Error ${r.status}`))
      .then(j => setBookings(j.data))
      .catch(() => {/* silent */});
  }, [user]);

  const handleToggleManager = e => {
    setIsManager(e.target.checked);
    localStorage.setItem('venueManager', JSON.stringify(e.target.checked));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg(''); setSuccessMsg('');
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
        location: {
          address: formData.address,
          city: formData.city,
          zip: '', country: '', continent: '', lat: 0, lng: 0
        }
      };
      const res = await fetch(VENUES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.[0]?.message || `Error ${res.status}`);
      }
      setSuccessMsg('Venue created successfully');
      setFormData({ name: '', description: '', mediaUrl: '', price: '', maxGuests: '', city: '', address: '' });
      // Refresh venues
      const j2 = await (await fetch(`${PROFILE_BY_NAME_VENUES_URL(user.name)}?_bookings=true`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY },
      })).json();
      setVenues(j2.data);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container p-4 font-figtree">
      <ProfileHeader user={user} />
      <div className="mt-4"><DashboardMobileMenu /></div>
      <DashboardInfoSection />
 
      {/* Chart */}
     
        <ProfileChart venues={venues} bookings={bookings} />
  
        <ActiveVenuesSection
          venues={venues} loading={loading} error={error}
          onDelete={id => setVenues(vs => vs.filter(v => v.id !== id))}
        />
     
      {/* Add Venue form */}
      {isManager && (
        <div className="mt-8 bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Add New Venue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded" />
            <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
            <input name="mediaUrl" value={formData.mediaUrl} onChange={handleChange} placeholder="Media URL" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-3">
              <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price / night" className="p-2 border rounded" />
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
