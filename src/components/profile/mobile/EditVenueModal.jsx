import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { getAccessToken } from '../../../services/tokenService';
import { useVenueForm } from '../../../hooks/useVenueForm';
import {
  STEPS,
  ENV_OPTIONS,
  AUD_OPTIONS,
  FAC_OPTIONS,
} from '../../../components/constants/VenueFormConfig';
import BottomSheet from '../../../components/ui/mobildemodal/BottomSheet';


// API endpoints
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VENUES_URL = `${BASE_URL}/holidaze/venues`;
const VENUE_BY_ID_URL = id => `${VENUES_URL}/${id}`;
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

// Build headers with auth and API key
function authHeaders(json = true) {
  const token = getAccessToken();
  const headers = {};
  if (json) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (API_KEY) headers['X-Noroff-API-Key'] = API_KEY;
  return headers;
}

async function updateVenue(id, data) {
  const res = await fetch(VENUE_BY_ID_URL(id), {
    method: 'PUT',
    headers: authHeaders(true),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to update venue: ${res.status} ${txt}`);
  }
  return res.json();
}

async function createVenue(data) {
  const res = await fetch(VENUES_URL, {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to create venue: ${res.status} ${txt}`);
  }
  return res.json();
}

export default function EditVenueForm({ userName, onCreated, onClose, existingVenue }) {
  const {
    step,
    form,
    updateField,
    toggleField,
    addImage,
    setImage,
    removeImage,
    next,
  } = useVenueForm(userName, onCreated);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!existingVenue) return;
    const {
      name,
      description,
      location,
      type,
      media = [],
      price,
      maxGuests,
      meta = {},
      environments = [],
      audiences = [],
      facilities = [],
      availability,
    } = existingVenue;

    updateField('title', name || '');
    updateField('description', description || '');
    updateField('location', {
      address: location?.address || '',
      city: location?.city || '',
      country: location?.country || '',
    });
    updateField('type', type || 'House');
    updateField('images', media.map(m => m.url));
    updateField('price', price != null ? String(price) : '');
    updateField('guests', maxGuests != null ? String(maxGuests) : '1');
    updateField('bathrooms', meta.bathrooms != null ? meta.bathrooms : 1);
    updateField('environments', environments);
    updateField('audiences', audiences);
    updateField('facilities', facilities);
    if (availability?.start && availability?.end) {
      updateField('dateRange', {
        startDate: new Date(availability.start),
        endDate: new Date(availability.end),
        key: 'selection',
      });
    }
  }, [existingVenue]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const payload = {
      name: form.title,
      description: form.description,
      location: form.location,
      type: form.type,
      media: form.images.filter(Boolean).map(url => ({ url })),
      price: Number(form.price) || 0,
      maxGuests: Number(form.guests) || 1,
      meta: {
        bathrooms: form.bathrooms || 1,
        ...ENV_OPTIONS.reduce((acc, o) => ({ ...acc, [o.key]: form.environments.includes(o.key) }), {}),
        ...AUD_OPTIONS.reduce((acc, o) => ({ ...acc, [o.key]: form.audiences.includes(o.key) }), {}),
        ...FAC_OPTIONS.reduce((acc, o) => ({ ...acc, [o.key]: form.facilities.includes(o.key) }), {}),
      },
      availability: {
        start: form.dateRange.startDate.toISOString().slice(0, 10),
        end: form.dateRange.endDate.toISOString().slice(0, 10),
      },
    };

    try {
      const result = existingVenue?.id ? await updateVenue(existingVenue.id, payload) : await createVenue(payload);
      setSuccess('Venue updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Noe gikk galt');
    } finally {
      setLoading(false);
    }
  };

  const renderFields = () => {
    switch (step) {
      case 0:
        return (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-lg"
              placeholder="Tittel"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />
            <textarea
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 h-32"
              placeholder="Beskrivelse"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
            <input
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              placeholder="Adresse"
              value={form.location.address}
              onChange={(e) => updateField('location', { ...form.location, address: e.target.value })}
            />
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                placeholder="By"
                value={form.location.city}
                onChange={(e) => updateField('location', { ...form.location, city: e.target.value })}
              />
              <input
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                placeholder="Land"
                value={form.location.country}
                onChange={(e) => updateField('location', { ...form.location, country: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-purple-700 mb-1">Type</p>
              <div className="flex gap-2">
                {['House', 'Apartment', 'Hotel', 'Other'].map((t) => (
                  <button
                    key={t}
                    onClick={() => updateField('type', t)}
                    className={`px-3 py-1 border rounded-full text-sm transition ${
                      form.type === t ? 'bg-purple-300 text-white' : 'bg-white text-purple-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-2 mt-2">
                <input
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                  placeholder="Bilde-URL"
                  value={url}
                  onChange={(e) => setImage(i, e.target.value)}
                />
                <button onClick={() => removeImage(i)} className="text-red-500 text-xl">delete</button>
              </div>
            ))}
            <button
              onClick={addImage}
              className="w-full mt-2 py-2 bg-purple-200 rounded-lg hover:bg-purple-300 text-purple-700 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              Legg til bilde
            </button>
          </>
        );
      case 2:
        return (
          <>
            {['Environments', 'Audiences', 'Facilities'].map((group, gi) => {
              const opts = gi === 0 ? ENV_OPTIONS : gi === 1 ? AUD_OPTIONS : FAC_OPTIONS;
              const field = gi === 0 ? 'environments' : gi === 1 ? 'audiences' : 'facilities';
              return (
                <div key={group} className="mt-4">
                  <p className="text-sm font-medium text-purple-700 mb-1">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {opts.map((o) => {
                      const active = form[field]?.includes(o.key);
                      return (
                        <button
                          key={o.key}
                          onClick={() => toggleField(field, o.key)}
                          className={`flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition ${
                            active ? 'bg-purple-300 text-white' : 'bg-white text-purple-700'
                          }`}>
                          <span className="material-symbols-outlined text-base">{o.icon}</span>
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        );
      case 3:
        return (
          <>
            <p className="text-sm font-medium text-purple-700 mb-1">Tilgjengelighet</p>
            <DateRange
              ranges={[form.dateRange]}
              onChange={(r) => updateField('dateRange', r.selection)}
              editableDateInputs
              moveRangeOnFirstSelection={false}
              minDate={new Date()}
            />
          </>
        );
      case 4:
        return (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Pris / natt"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
            />
            <input
              type="number"
              placeholder="Gjester"
              min={1}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              value={form.guests}
              onChange={(e) => updateField('guests', e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BottomSheet title="Edit Venue" onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Progress Bar */}
        <div className="sticky top-0 bg-white z-10 flex w-full px-4 space-x-1 py-2 border-b border-purple-100">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded ${i <= step ? 'bg-purple-300' : 'bg-purple-100'}`} />
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {renderFields()}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
        </div>
        {/* Footer */}
        <div className="p-3 bg-white">
          <button
            onClick={step === STEPS.length - 1 ? handleSubmit : next}
            disabled={loading}
            className="w-full py-2 bg-purple-300 hover:bg-purple-400 text-white rounded-lg font-semibold"
          >
            {loading ? 'Laster...' : step === STEPS.length - 1 ? 'Oppdater Venue' : 'Neste'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
