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

  // Load user from localStorage and redirect if not authenticated
  useEffect(() => {
    // Load user and token from localStorage
    const stored = localStorage.getItem('user');
    if (!stored) {
      navigate('/login', { replace: true });
      return;
    }
    const parsedUser = JSON.parse(stored);
    const token = parsedUser.accessToken || getAccessToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    // Set user state
    setUser(parsedUser);
  }, [navigate]);

  // Fetch venues
  useEffect(() => {
    async function fetchVenues() {
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
    }
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
        location: { address: formData.address, city: formData.city, zip: '', country: '', continent: '', lat: 0, lng: 0 }
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
    <div className="profile-container" style={{ padding: '1rem' }}>
      <h1>Din profil</h1>
      <div className="profile-details" style={{ padding: '1rem' }}>
        {user.avatar && (
          <img src={user.avatar.url} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
        )}
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        {user.bio && <p>{user.bio}</p>}
      </div>

      <label style={{ display: 'block', margin: '1rem 0' }}>
        <input type="checkbox" checked={isManager} onChange={handleToggleManager} /> Venue Manager
      </label>

      {isManager && (
        <div className="venue-manager" style={{ borderTop: '1px solid #ccc', marginTop: '2rem', padding: '1rem' }}>
          <h3>Opprett ny Venue</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="name" placeholder="Navn" value={formData.name} onChange={handleChange} required />
            <textarea name="description" placeholder="Beskrivelse" value={formData.description} onChange={handleChange} required />
            <input name="mediaUrl" type="url" placeholder="Media URL" value={formData.mediaUrl} onChange={handleChange} />
            <input name="price" type="number" placeholder="Pris (NOK)" value={formData.price} onChange={handleChange} required />
            <input name="maxGuests" type="number" placeholder="Max Guests" value={formData.maxGuests} onChange={handleChange} required />
            <input name="city" placeholder="By" value={formData.city} onChange={handleChange} required />
            <input name="address" placeholder="Adresse" value={formData.address} onChange={handleChange} required />
            <button type="submit" style={{ gridColumn: '1 / -1' }}>Send inn Venue</button>
          </form>
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Dine venues</h3>
        {loading && <p>Laster dine venues...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && venues.length === 0 && <p>Ingen venues funnet.</p>}
        <ul>
          {venues.map(v => (
            <li key={v.id} style={{ marginBottom: 8 }}>
              <Link to={"/venues/" + v.id} className="font-medium text-blue-600 hover:underline">
                {v.name}
              </Link>{' '}(ID: {v.id})
              <DeleteVenueButton
                venueId={v.id}
                onDeleted={() => setVenues(prev => prev.filter(x => x.id !== v.id))}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
