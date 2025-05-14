import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useVenueForm } from '../../../hooks/useVenueForm';
import { ENV_OPTIONS, AUD_OPTIONS, FAC_OPTIONS } from '../../constants/VenueFormConfig';

export default function AddVenuePage({ userName, onCreated }) {
  const {
    form,
    feedback,
    updateField,
    toggleField,
    addImage,
    setImage,
    removeImage,
    submit,
  } = useVenueForm(userName, onCreated);

  // Lock body scroll only when calendar is open
  useEffect(() => {
    document.body.style.overflow = form.datePickerOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [form.datePickerOpen]);

  const [rentalDays, setRentalDays] = useState(
    Math.max(
      1,
      Math.ceil((form.dateRange.endDate - form.dateRange.startDate) / (1000 * 60 * 60 * 24))
    )
  );

  const handleDateChange = ({ selection }) => {
    updateField('dateRange', selection);
    const days = Math.max(
      1,
      Math.ceil((selection.endDate - selection.startDate) / (1000 * 60 * 60 * 24))
    );
    setRentalDays(days);
    updateField('rentalDays', days);
  };

  const toggleCalendar = () => updateField('datePickerOpen', !form.datePickerOpen);

  const Chip = ({ active, children, ...rest }) => (
    <button
      {...rest}
      className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full border text-xs font-medium shadow-sm transition hover:shadow-md ${
        active ? 'bg-purple-600 text-white border-transparent' : 'bg-white text-gray-800 border-gray-300'
      }`}
    >
      {children}
    </button>
  );

  const Section = ({ icon, title, children }) => (
    <section className="bg-white shadow rounded-lg p-6 md:p-8 space-y-6 ring-1 ring-gray-100">
      <h2 className="flex items-center gap-2 text-lg md:text-xl font-semibold text-purple-700">
        <span className="material-symbols-outlined text-purple-600" aria-hidden>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );

  const TYPE_ICONS = { House: 'home', Apartment: 'apartment', Hotel: 'hotel', Other: 'home_work' };

  return (
    <div className="relative w-full mx-auto p-4 md:p-8 max-h-screen overflow-y-auto  space-y-8">
      <header className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">List a new venue</h1>
        <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">Share your amazing place with travelers and start earning today.</p>
      </header>

      <Section icon="info" title="Basic information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                placeholder="Nordic lake cabin"
                value={form.title}
                onChange={e => updateField('title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={6}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 resize-none"
                placeholder="What makes your place special?"
                value={form.description}
                onChange={e => updateField('description', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Street address</label>
              <input
                type="text"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                placeholder="123 Main St"
                value={form.location.address}
                onChange={e => updateField('location', { ...form.location, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                  placeholder="Oslo"
                  value={form.location.city}
                  onChange={e => updateField('location', { ...form.location, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                  placeholder="Norway"
                  value={form.location.country}
                  onChange={e => updateField('location', { ...form.location, country: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section icon="home_pin" title="Venue details">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Venue type</p>
          <div className="flex flex-wrap gap-3">
            {['House', 'Apartment', 'Hotel', 'Other'].map(t => (
              <Chip key={t} active={form.type === t} onClick={() => updateField('type', t)}>
                <span className="material-symbols-outlined text-base" aria-hidden>{TYPE_ICONS[t]}</span>{t}
              </Chip>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-gray-700">Images (URLs)</p>
          {form.images.map((url, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                value={url}
                onChange={e => setImage(i, e.target.value)}
              />
              <button onClick={() => removeImage(i)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full">
                <span className="material-symbols-outlined text-lg" aria-hidden>delete</span>
              </button>
            </div>
          ))}
          <button onClick={addImage} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 text-sm">
            <span className="material-symbols-outlined text-base" aria-hidden>add_photo_alternate</span>Add image URL
          </button>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {[
            { title: 'Environments', opts: ENV_OPTIONS, field: 'environments' },
            { title: 'Audiences', opts: AUD_OPTIONS, field: 'audiences' },
            { title: 'Facilities', opts: FAC_OPTIONS, field: 'facilities' },
          ].map(({ title, opts, field }) => (
            <div key={field} className="space-y-3">
              <p className="text-sm font-medium text-gray-700">{title}</p>
              <div className="flex flex-wrap gap-2">
                {opts.map(o => (
                  <Chip key={o.key} active={form[field].includes(o.key)} onClick={() => toggleField(field, o.key)}>
                    <span className="material-symbols-outlined text-xs" aria-hidden>{o.icon}</span>{o.label}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon="event" title="Availability & price">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-10">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Available dates</p>
            <button onClick={toggleCalendar} className="text-purple-600 underline mb-2">
              {form.datePickerOpen ? 'Close Calendar' : 'Open Calendar'}
            </button>
            {form.datePickerOpen && (
              <div className="absolute z-20 bg-white rounded-xl border border-gray-300 shadow-lg overflow-y-auto max-h-[calc(100vh-200px)] right-0 bottom-0">
                <DateRange
                  ranges={[form.dateRange]}
                  onChange={handleDateChange}
                  editableDateInputs
                  moveRangeOnFirstSelection={false}
                  minDate={new Date()}
                  direction="vertical"
                />
              </div>
            )}
          </div>
          <div className="space-y-6 self-start">
            <div>
              <label className="text-sm font-medium text-gray-700">Price per night (NOK)</label>
              <input
                type="number" min={1}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                value={form.price}
                onChange={e => updateField('price', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Max guests</label>
              <input
                type="number" min={1}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                value={form.guests}
                onChange={e => updateField('guests', Number(e.target.value))}
              />
            </div>
            <p className="text-sm text-gray-600">Selected rental days: {rentalDays}</p>
          </div>
        </div>
      </Section>

      {feedback.error && <p className="text-red-500 text-sm">{feedback.error}</p>}
      {feedback.success && <p className="text-green-600 text-sm">{feedback.success}</p>}

      <div className="pt-6 flex flex-col sm:flex-row gap-4 mb-30">
        <button
          onClick={() => console.log('Preview venue', form)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 active:bg-purple-100 transition"
        >
          <span className="material-symbols-outlined">visibility</span> Preview venue
        </button>
        <button
          onClick={submit}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 active:bg-purple-800 transition"
        >
          <span className="material-symbols-outlined">publish</span> Publish venue
        </button>
      </div>
    </div>
  );
}
