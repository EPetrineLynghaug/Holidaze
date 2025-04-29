// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';

import DeleteVenueButton from '../components/buttons/DeleteVenueButton';
import { PROFILE_BY_NAME_VENUES_URL, VENUES_URL } from '../components/constans/api';
import { getAccessToken, isAccessTokenValid } from '../services/tokenService';
import ProfileHeader from '../components/profile/ProfileHeader';
import DashboardInfoSection from '../components/profile/DashboardInfoSection';
import ActiveVenuesSection from '../components/profile/ActiveVenueCard';

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
  
    <div className="profile-container font-figtree tracking-10p p-4">
    <ProfileHeader user={user} />
    <DashboardInfoSection />
    <ActiveVenuesSection
       venues={venues}
       loading={loading}
       error={error}
       onDelete={id => setVenues(prev => prev.filter(v => v.id !== id))}
   />
  
  </div>
    );

}
