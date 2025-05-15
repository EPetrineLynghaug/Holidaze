import React, { useEffect, useState, useRef } from 'react';
import DateRangePicker from '../../../components/ui/calender/DateRangePicker';
import useBookingRanges from '../../../hooks/useBookingRanges';
import { useVenueForm } from '../../../hooks/useVenueForm';
import { ENV_OPTIONS, AUD_OPTIONS, FAC_OPTIONS } from '../../constants/VenueFormConfig';

export default function AddVenuePage({ userName, onCreated }) {
   
        const {
          form,
          feedback,
          updateField,
          updateLocationField,
          toggleField,
          addImage,
          setImage,
          removeImage,
          submit,
        } = useVenueForm(userName, onCreated);
      
        // Lokal state for beskrivelse
        const [localDescription, setLocalDescription] = useState(form.description);

          const { bookingRanges, disabledDates } = useBookingRanges(form.bookings);
      
        // Unkontrollerte inputs: oppdater på blur
        const handleDescriptionChange = e => setLocalDescription(e.target.value);
        const handleDescriptionBlur = () => updateField('description', localDescription);
      
  
        // Body-scroll når date picker er åpen
        useEffect(() => {
          document.body.style.overflow = form.datePickerOpen ? 'hidden' : 'auto';
          return () => { document.body.style.overflow = 'auto'; };
        }, [form.datePickerOpen]);
      
     
        const Chip = ({ active, children, ...rest }) => (
          <button
            {...rest}
            type="button"
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
              <span className="material-symbols-outlined text-purple-600" aria-hidden>{icon}</span>{title}
            </h2>
            {children}
          </section>
        );
      
        const TYPE_ICONS = { House: 'home', Apartment: 'apartment', Hotel: 'hotel', Other: 'home_work' };
      
        return (
          <form
            onSubmit={e => { e.preventDefault(); submit(); }}
            className="relative w-full mx-auto p-4 md:p-8 max-h-screen overflow-y-auto space-y-8"
          >
            <header className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                List a new venue
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
                Share your amazing place with travelers and start earning today.
              </p>
            </header>
      
            {/* Basic Information */}
            <Section icon="info" title="Basic information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="mb-6">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={form.title}
                    onBlur={e => updateField('title', e.target.value)}
                    placeholder="Nordic lake cabin"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                  />
                </div>
      
                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    defaultValue={form.location.address}
                    onBlur={e => updateLocationField('address', e.target.value)}
                    placeholder="123 Main St"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                  />
                </div>
      
                <div className="mb-6">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    defaultValue={form.location.city}
                    onBlur={e => updateLocationField('city', e.target.value)}
                    placeholder="Oslo"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                  />
                </div>
      
                <div className="mb-6">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    defaultValue={form.location.country}
                    onBlur={e => updateLocationField('country', e.target.value)}
                    placeholder="Norway"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                  />
                </div>
      
                <div className="md:col-span-2 mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={8}
                    defaultValue={form.description}
                    onBlur={e => updateField('description', e.target.value)}
                    placeholder="What makes your place special?"
                    className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 overflow-y-auto"
                  />
                </div>
              </div>
            </Section>

      {/* Venue Details */}
      <Section icon="home_pin" title="Venue details">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Venue type</p>
          <div className="flex flex-wrap gap-3">
            {Object.keys(TYPE_ICONS).map(t => (
              <Chip key={t} active={form.type === t} onClick={() => updateField('type', t)}>
                <span className="material-symbols-outlined text-base" aria-hidden>{TYPE_ICONS[t]}</span>
                {t}
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
                defaultValue={url}
                onBlur={e => setImage(i, e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
                placeholder="https://example.com/photo.jpg"
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

{/* Availability & price */}
<Section icon="event" title="Availability & price">
        <p className="text-sm font-medium text-gray-700 mb-3">Available dates</p>
        <div className="relative overflow-visible">
        <DateRangePicker
  value={form.dateRange}
  onChange={({ startDate, endDate, rentalDays }) => {
    updateField('dateRange', { startDate, endDate, key: 'selection' });
    updateField('rentalDays', rentalDays);
  }}
  bookingRanges={bookingRanges}
  disabledDates={disabledDates}
  minDate={new Date()}
  className="mt-2"
/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
          <div>
            <label htmlFor="price" className="text-sm font-medium text-gray-700">
              Price per night (NOK)
            </label>
            <input
              id="price"
              type="number"
              defaultValue={form.price}
              onBlur={e => updateField('price', e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
            />
          </div>

          <div>
            <label htmlFor="guests" className="text-sm font-medium text-gray-700">
              Max guests
            </label>
            <input
              id="guests"
              type="number"
              defaultValue={form.guests}
              onBlur={e => updateField('guests', Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400"
            />
          </div>
        </div>

        {/* Selected rental days */}
        <p className="text-sm text-gray-600 mt-2">
          Selected rental days: {form.rentalDays}
        </p>
      </Section>

   {/* Feedback & Actions */}
   {feedback.error && <p className="text-red-500 text-sm">{feedback.error}</p>}
      {feedback.success && <p className="text-green-600 text-sm">{feedback.success}</p>}

      <div className="pt-6 flex flex-col sm:flex-row gap-4 mb-30">
        <button
          type="button"
          onClick={() => console.log('Preview venue', form)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-purple-500 text-purple-600 font-semibold hover:bg-purple-50 active:bg-purple-100 transition"
        >
          <span className="material-symbols-outlined">visibility</span> Preview venue
        </button>
        <button
          type="submit"
          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-purple-600 text-white font-semibold shadow-md hover:bg-purple-700 active:bg-purple-800 transition"
        >
          <span className="material-symbols-outlined">publish</span> Publish venue
        </button>
      </div>
    </form>
  );
}
