import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import useVenueDetail from '../hooks/useVenueDetail';
import ProfileUserLink from '../components/profile/mobile/ProfileUserSearch';
import { BOOKINGS_URL } from '../components/constants/api';
import { getAccessToken } from '../services/tokenService';

const NOK_TO_USD = 0.1;
const formatUSD = amount =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);






export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { venue, loading, error } = useVenueDetail(id);

  const [slideIndex, setSlideIndex] = useState(0);
  const [form, setForm] = useState({ dateFrom: '', dateTo: '', guests: 1 });
  const [feedback, setFeedback] = useState({ error: '', success: '' });
  const [submitting, setSubmitting] = useState(false);

  const goBack = useCallback(() => navigate(-1), [navigate]);
  const nextImage = useCallback(() => {
    if (!venue?.media) return;
    setSlideIndex(i => (i + 1) % venue.media.length);
  }, [venue]);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const { dateFrom, dateTo, guests } = form;
    if (!dateFrom || !dateTo || guests < 1) {
      return setFeedback({ error: 'Fill all fields', success: '' });
    }
    if (!localStorage.getItem('user')) {
      return setFeedback({ error: 'Login required', success: '' });
    }
    setSubmitting(true);
    try {
      const token = getAccessToken();
      const res = await fetch(BOOKINGS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ venueId: id, dateFrom, dateTo, guests })
      });
      if (!res.ok) throw new Error(await res.text());
      setFeedback({ success: 'Booked!', error: '' });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setFeedback({ error: err.message, success: '' });
    } finally {
      setSubmitting(false);
    }
  }, [form, id, navigate]);

  if (loading) return <p className="text-center py-10">Loading…</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!venue) return null;

  const { name, media = [], description, price, maxGuests, rating, location = {}, reviews = [], owner } = venue;

  return (
    <div  className="font-figtree tracking-10p ">
    <div className="w-full bg-white">
      {/* Image */}
      {media.length > 0 && (
        <div className="relative w-full h-56">
          <img
            src={media[slideIndex].url}
            alt={media[slideIndex].alt || name}
            className="w-full h-full object-cover"
            onClick={nextImage}
          />
          <button
            onClick={goBack}
            className="absolute top-3 left-3 p-2 bg-white bg-opacity-80 rounded-full shadow"
          >←</button>
          <div
            className="absolute bottom-3 left-3 text-white text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(74,74,74,0.92)' }}
          >{slideIndex + 1}/{media.length}</div>
        </div>
      )}

      {/* Title */}
      <h2 className="px-4 pt-3 text-base font-medium truncate">{name}</h2>

      {/* Location */}
      <p className="px-4 mt-1 text-gray-600 text-sm">{location.city}, {location.country}</p>

      {/* Rating */}
      <div className="px-4 mt-2 flex items-center text-gray-600 text-sm space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="material-symbols-outlined text-sm">
            {i < Math.round(rating) ? 'star' : 'star_border'}
          </span>
        ))}
        <span className="font-medium text-sm ml-1">{rating.toFixed(1)}</span>
        <a href="#reviews" className="text-indigo-600 text-sm ml-2">({reviews.length})</a>
      </div>

      {/* Owner */}
      <div className="px-4 mt-3">
        <ProfileUserLink user={owner} size="xs" className="text-sm opacity-80 hover:opacity-100" />
      </div>

      {/* Features */}
      <div className="px-4 mt-4 flex justify-between text-gray-600 text-sm">
        {[
          ['house','House'],
          ['bed', `${maxGuests} beds`],
          ['bathtub','1 bath'],
          ['garage','1 garage']
        ].map(([icon,label]) => (
          <div key={icon} className="flex flex-col items-center">
            <span className="material-symbols-outlined text-base">{icon}</span>
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Description */}
      <p className="px-4 mt-4 text-gray-700 text-sm leading-relaxed">{description}</p>

      {/* Booking */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex items-center justify-between"
      >
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 text-white py-2 px-6 rounded-lg disabled:opacity-50 text-sm"
        >{submitting ? 'Booking…' : 'Book now'}</button>
        <span className="text-lg font-bold">{formatUSD(price * NOK_TO_USD)} <span className="text-sm font-normal">/night</span></span>
      </form>
    </div>
    </div>
  );
}