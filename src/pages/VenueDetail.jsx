
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { VENUE_BY_ID_URL, BOOKINGS_URL } from '../components/constans/api';
import { getAccessToken } from '../services/tokenService';
import ProfileUserLink from '../components/profile/mobile/ProfileUserSearch';

const NOK_TO_USD = 0.10;
const formatUSD = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ dateFrom: '', dateTo: '', guests: 1 });
  const [feedback, setFeedback] = useState({ error: '', success: '' });
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${VENUE_BY_ID_URL(id)}?_owner=true&_reviews=true`);
        if (!res.ok) throw new Error(res.statusText);
        const { data } = await res.json();
        setVenue(data);
        setOwner(data.owner);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const onScroll = (e) =>
    setSlideIndex(Math.round(e.target.scrollLeft / e.target.clientWidth));
  const goBack = () => navigate(-1);
  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { dateFrom, dateTo, guests } = form;
    if (!dateFrom || !dateTo || guests < 1) {
      return setFeedback({ error: 'Please fill all fields.', success: '' });
    }
    if (!localStorage.getItem('user')) {
      return setFeedback({ error: 'Login required.', success: '' });
    }

    try {
      const token = getAccessToken();
      const res = await fetch(BOOKINGS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Noroff-API-Key': import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify({ venueId: id, dateFrom, dateTo, guests }),
      });
      if (!res.ok) throw new Error(await res.text());
      setFeedback({ success: 'Booked! Redirecting...', error: '' });
      setTimeout(() => navigate('/profile'), 1000);
    } catch (e) {
      setFeedback({ error: e.message, success: '' });
    }
  };

  if (loading)
    return <p className="text-center py-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">
        Error: {error}
      </p>
    );
  if (!venue) return null;

  const {
    name,
    description,
    media = [],
    price,
    maxGuests,
    rating,
    created,
    location = {},
    meta = {},
    reviews = [],
  } = venue;

  return (
    <div className="flex flex-col space-y-4">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="ml-4 mt-4 text-indigo-600 hover:underline text-sm"
      >
        &larr; Back
      </button>

      {/* Image Carousel */}
      <div
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory h-64"
      >
        {media.map((img, i) => (
          <img
            key={i}
            src={img.url}
            alt={img.alt || name}
            className="snap-center w-full flex-shrink-0 object-cover"
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex justify-center">
        {media.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 mx-1 rounded-full ${
              i === slideIndex ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Klikkbar eier-lenke */}
      {owner && <ProfileUserLink user={owner} />}

      {/* Venue Info */}
      <section className="px-4 space-y-3">
        <h1 className="text-xl font-bold">{name}</h1>
        <p className="text-gray-700">{description}</p>

        {/* Rating with dropdown */}
        <details className="border rounded-lg p-3">
          <summary className="flex items-center cursor-pointer">
            <span className="mr-2 font-medium">Rating:</span>
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i}>
                  {i < Math.round(rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({rating}/5)
            </span>
          </summary>
          <ul className="mt-2 space-y-2">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <li key={rev.id} className="border-b pb-2">
                  <p className="font-semibold">
                    {rev.user.name}
                  </p>
                  <p className="text-gray-700">
                    {rev.comment}
                  </p>
                  <div className="flex mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i}>
                        {i < rev.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-700">No reviews yet.</p>
            )}
          </ul>
        </details>

        {/* Key details */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <strong>Price:</strong> {formatUSD(price * NOK_TO_USD)}
          </div>
          <div>
            <strong>Guests:</strong> {maxGuests}
          </div>
          <div>
            <strong>Added:</strong>{' '}
            {new Date(created).toLocaleDateString()}
          </div>
          <div>
            <strong>Location:</strong>{' '}
            {location.city}, {location.country}
          </div>
        </div>

        <div className="flex flex-wrap mt-2 text-xs">
          {meta.wifi && (
            <span className="mr-2 px-2 py-1 bg-green-100 rounded">
              WiFi
            </span>
          )}
          {meta.parking && (
            <span className="mr-2 px-2 py-1 bg-green-100 rounded">
              Parking
            </span>
          )}
          {meta.breakfast && (
            <span className="mr-2 px-2 py-1 bg-green-100 rounded">
              Breakfast
            </span>
          )}
          {meta.pets && (
            <span className="mr-2 px-2 py-1 bg-green-100 rounded">
              Pets
            </span>
          )}
        </div>
      </section>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 bg-white rounded-lg shadow mx-4 mb-6"
      >
        <h2 className="text-lg font-medium mb-2">Book Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {['dateFrom', 'dateTo'].map((key, idx) => (
            <label key={idx} className="flex flex-col text-xs">
              {key === 'dateFrom' ? 'From' : 'To'}
              <input
                type="date"
                value={form[key]}
                onChange={handleChange(key)}
                required
                className="mt-1 p-2 border rounded"
              />
            </label>
          ))}
          <label className="flex flex-col text-xs">
            Guests
            <input
              type="number"
              min="1"
              value={form.guests}
              onChange={handleChange('guests')}
              required
              className="mt-1 p-2 border rounded"
            />
          </label>
        </div>
        {feedback.error && (
          <p className="text-red-500 mt-2">{feedback.error}</p>
        )}
        {feedback.success && (
          <p className="text-green-600 mt-2">{feedback.success}</p>
        )}
        <button
          type="submit"
          className="mt-3 w-full bg-indigo-600 text-white py-2 rounded"
        >
          Book now
        </button>
      </form>
    </div>
  );
}
