// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';

import DeleteVenueButton from '../components/buttons/DeleteVenueButton';
import { PROFILE_BY_NAME_VENUES_URL, VENUES_URL } from '../components/constans/api';
import { getAccessToken, isAccessTokenValid } from '../services/tokenService';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isManager, setIsManager] = useState(
    () => JSON.parse(localStorage.getItem('venueManager')) || false
  );
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mediaUrl: '',
    price: '',
    maxGuests: '',
    city: '',
    address: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // On mount and on auth change, load user or redirect
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('user');
      if (!stored) {
        navigate('/', { replace: true });
      } else {
        setUser(JSON.parse(stored));
      }
    };
    loadUser();
    window.addEventListener('authChange', loadUser);
    return () => window.removeEventListener('authChange', loadUser);
  }, [navigate]);

  // Fetch venues when user changes
  useEffect(() => {
    const fetchVenues = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      const token = getAccessToken();
      try {
        const res = await fetch(
          PROFILE_BY_NAME_VENUES_URL(user.name),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
            }
          }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const { data } = await res.json();
        setVenues(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [user]);

  const handleToggleManager = e => {
    const val = e.target.checked;
    setIsManager(val);
    localStorage.setItem('venueManager', JSON.stringify(val));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
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
        location: {
          address: formData.address,
          city: formData.city,
          zip: '',
          country: '',
          continent: '',
          lat: 0,
          lng: 0
        }
      };
      const res = await fetch(VENUES_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.errors?.[0]?.message || 'Creation failed');
      }
      setSuccessMsg('Venue created!');
      setFormData({ name: '', description: '', mediaUrl: '', price: '', maxGuests: '', city: '', address: '' });
      // refetch
      const refresh = await fetch(
        PROFILE_BY_NAME_VENUES_URL(user.name),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY
          }
        }
      );
      const { data: newList } = await refresh.json();
      setVenues(newList);
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container p-4">
      <h1>Din profil</h1>
      <div className="profile-details p-4">
        {user.avatar && (
          <img
            src={user.avatar.url}
            alt="Avatar"
            className="w-24 h-24 rounded-full"
          />
        )}
        <h2 className="text-xl font-semibold mt-2">{user.name}</h2>
        <p>Email: {user.email}</p>
        {user.bio && <p className="mt-1">{user.bio}</p>}
      </div>

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isManager}
          onChange={handleToggleManager}
          className="mr-2"
        />
        Venue Manager
      </label>

      {isManager && (
        <section className="venue-manager mb-6 border-t pt-4">
          <h3 className="text-lg mb-2">Opprett ny Venue</h3>
          {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
          {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Navn" required className="p-2 border rounded" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Beskrivelse" required className="p-2 border rounded"></textarea>
            <input name="mediaUrl" type="url" value={formData.mediaUrl} onChange={handleChange} placeholder="Media URL" className="p-2 border rounded" />
            <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Pris (NOK)" required className="p-2 border rounded" />
            <input name="maxGuests" type="number" value={formData.maxGuests} onChange={handleChange} placeholder="Max Guests" required className="p-2 border rounded" />
            <input name="city" value={formData.city} onChange={handleChange} placeholder="By" required className="p-2 border rounded" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Adresse" required className="p-2 border rounded" />
            <button type="submit" className="col-span-full bg-blue-600 text-white py-2 rounded">Send inn Venue</button>
          </form>
        </section>
      )}

      <section>
        <h3 className="text-lg mb-2">Dine venues</h3>
        {loading && <p>Laster dine venues...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && venues.length === 0 && <p>Ingen venues funnet.</p>}
        <ul className="space-y-2">
          {venues.map(v => (
            <li key={v.id} className="flex justify-between items-center">
              <Link to={`/venues/${v.id}`} className="text-blue-600 hover:underline">
                {v.name}
              </Link>
              <DeleteVenueButton
                venueId={v.id}
                onDeleted={() => setVenues(prev => prev.filter(x => x.id !== v.id))}
              />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
