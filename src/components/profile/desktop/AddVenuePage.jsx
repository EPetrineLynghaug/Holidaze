import React, { useEffect, useState, useRef } from 'react';
import DateRangePicker from '../../../components/ui/calender/DateRangePicker';
import useBookingRanges from '../../../hooks/data/useBookingRanges';
import { useVenueForm } from '../../../hooks/useVenueForm';
import { ENV_OPTIONS, AUD_OPTIONS, FAC_OPTIONS } from '../../constants/VenueFormConfig';
import useNewVenueValidation from '../../../hooks/forms/useNewVenueValidation';
import { venueValidationRules } from '../../constants/NewVenueValidationConfig';

 export default function AddVenuePage({ userName, onCreated }) {
       
        const venueForm = useVenueForm(userName, onCreated);
        const { form, feedback, updateField, updateLocationField, toggleField, addImage, setImage, removeImage, submit } = venueForm;
      
        const bookingData = useBookingRanges(form.bookings);
        const { bookingRanges, disabledDates } = bookingData;
      

        const validation = useNewVenueValidation(
          {
            title:       form.title,
            description: form.description,
            address:     form.location.address,
            city:        form.location.city,
            country:     form.location.country,
            price:       form.price,
            guests:      form.guests,
          },
          venueValidationRules
        );
        const { values, errors, handleChange, remainingChars, isValid } = validation;
      
       
        const allImagesFilled  = form.images.every(url => url.trim() !== "");
        const hasDatesSelected = Boolean(form.dateRange?.startDate && form.dateRange?.endDate);
        const hasPrice         = Number(form.price) > 0;
        const hasGuests        = Number(form.guests) > 0;
      
        const allRequiredValid =
          isValid('title') &&
          isValid('description') &&
          isValid('address') &&
          isValid('city') &&
          isValid('country') &&
          allImagesFilled &&
          hasDatesSelected &&
          hasPrice &&
          hasGuests;
      
   
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
              <span className="material-symbols-outlined text-purple-600" aria-hidden>{icon}</span>
              {title}
            </h2>
            {children}
          </section>
        );
      
        const TYPE_ICONS = {
          House:     'home',
          Apartment: 'apartment',
          Hotel:     'hotel',
          Other:     'home_work',
        };
return (
  <main className="w-full max-h-screen overflow-y-auto scrollbar-hide">
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
      
      <Section icon="info" title="Basic information">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

    {/* Title */}
    <div className="mb-4">
      <label
        htmlFor="title"
        className="block text-base font-semibold text-gray-800 mb-2"
      >
        Title<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        id="title"
        name="title"
        type="text"
        defaultValue={form.title}
        onBlur={e => {
          handleChange('title')(e);
          updateField('title', e.target.value);
        }}
        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        maxLength={100}
        placeholder="Nordic lake cabin"
        className={`
          mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 transition
          ${errors.title
            ? 'border-red-500 focus:border-red-500'
            : 'focus:ring-purple-200 focus:border-purple-400'
          }
        `}
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>{remainingChars('title')} characters left</span>
        {errors.title && <span className="text-red-500">{errors.title}</span>}
      </div>
    </div>

    {/* Street address */}
    <div className="mb-6">
      <label
        htmlFor="address"
        className="block text-base font-semibold text-gray-800 mb-2"
      >
        Street address<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        id="address"
        name="address"
        type="text"
        defaultValue={form.location.address}
        onBlur={e => {
          handleChange('address')(e);
          updateLocationField('address', e.target.value);
        }}
        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        maxLength={200}
        placeholder="123 Main St"
        className="mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>{remainingChars('address')} characters left</span>
        {errors.address && <span className="text-red-500">{errors.address}</span>}
      </div>
    </div>

    {/* City */}
    <div className="mb-6">
      <label
        htmlFor="city"
        className="block text-base font-semibold text-gray-800 mb-2"
      >
        City<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        id="city"
        name="city"
        type="text"
        defaultValue={form.location.city}
        onBlur={e => {
          handleChange('city')(e);
          updateLocationField('city', e.target.value);
        }}
        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        maxLength={100}
        placeholder="Oslo"
        className="mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>{remainingChars('city')} characters left</span>
        {errors.city && <span className="text-red-500">{errors.city}</span>}
      </div>
    </div>

    {/* Country */}
    <div className="mb-6">
      <label
        htmlFor="country"
        className="block text-base font-semibold text-gray-800 mb-2"
      >
        Country<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        id="country"
        name="country"
        type="text"
        defaultValue={form.location.country}
        onBlur={e => {
          handleChange('country')(e);
          updateLocationField('country', e.target.value);
        }}
        onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
        maxLength={100}
        placeholder="Norway"
        className="mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
      />
      <div className="flex justify-between text-sm text-gray-500 mt-1">
        <span>{remainingChars('country')} characters left</span>
        {errors.country && <span className="text-red-500">{errors.country}</span>}
      </div>
    </div>

{/* Description (full-width) */}
<div className="md:col-span-2 mb-6 relative">
  <label
    htmlFor="description"
    className="flex items-center text-base font-semibold text-gray-800 mb-2"
  >
    Description<span className="text-red-500 ml-1">*</span>
    {/* Info-knapp */}
    <button
      type="button"
      className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none relative group"
    >
      <span className="material-symbols-outlined">info</span>
      {/* Tooltip */}
      <div className="absolute left-0 top-[100%] mt-1 w-64 p-3 bg-white border border-gray-200 rounded shadow-lg text-sm text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <ul className="list-disc pl-5 space-y-1 text-left">
          <li>What unique amenities do you offer?</li>
          <li>Check-in/check-out details</li>
          <li>Nearby attractions or transport links</li>
          <li>Any house rules or special tips</li>
        </ul>
      </div>
    </button>
  </label>

  <textarea
    id="description"
    name="description"
    rows={6}
    defaultValue={form.description}
    onBlur={e => {
      handleChange('description')(e);
      updateField('description', e.target.value);
    }}
    
    maxLength={8000}
    placeholder="Describe what makes your venue special"
    className="mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition resize-none"
  />

  <div className="flex justify-between text-sm text-gray-500 mt-1">
    <span>{remainingChars('description')} characters left</span>
    {errors.description && <span className="text-red-500">{errors.description}</span>}
  </div>
</div>
</div>
</Section>

{/* Venue type */}
<Section icon="home_pin" title="Venue type">
  <div className="space-y-6">
    <p className="text-sm font-medium text-gray-700">Venue type</p>
    <div className="flex flex-wrap gap-3">
      {Object.keys(TYPE_ICONS).map(t => (
        <Chip
          key={t}
          active={form.type === t}
          onClick={() => updateField('type', t)}
        >
          <span className="material-symbols-outlined text-base" aria-hidden>
            {TYPE_ICONS[t]}
          </span>
          {t}
        </Chip>
      ))}
    </div>
  </div>
</Section>

{/* Images */}
<Section icon="calendar_month" title="Images">
  <div className="space-y-6">
    <p className="text-sm font-medium text-gray-700">
      Images (URLs)<span className="text-red-500 ml-1">*</span>
    </p>
    {form.images.map((url, i) => (
      <div key={i} className="flex gap-3 items-center">
        <input
          type="url"
          defaultValue={url}
          onBlur={e => setImage(i, e.target.value)}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
          placeholder="https://example.com/photo.jpg"
        />
        <button
          type="button"
          onClick={() => removeImage(i)}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition"
        >
          <span className="material-symbols-outlined text-lg" aria-hidden>
            delete
          </span>
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={addImage}
      disabled={!allImagesFilled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
        ${allImagesFilled
          ? 'bg-purple-50 hover:bg-purple-100 text-purple-700'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
    >
      <span className="material-symbols-outlined text-base" aria-hidden>
        add_photo_alternate
      </span>
      Add image URL
    </button>
  </div>
</Section>
{/* Amenities */}
<Section icon="emoji_events" title="Amenities">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-6 gap-x-12">
    {[
      { title: 'Environments', opts: ENV_OPTIONS, field: 'environments' },
      { title: 'Audiences', opts: AUD_OPTIONS, field: 'audiences' },
      { title: 'Facilities', opts: FAC_OPTIONS, field: 'facilities' },
    ].map(({ title, opts, field }) => (
      <div key={field} className="space-y-2">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <div className="flex flex-wrap gap-3">
          {opts.map(o => (
            <Chip
              key={o.key}
              active={form[field].includes(o.key)}
              onClick={() => toggleField(field, o.key)}
            >
              <span className="material-symbols-outlined text-sm mr-1" aria-hidden>
                {o.icon}
              </span>
              {o.label}
            </Chip>
          ))}
        </div>
      </div>
    ))}
  </div>
</Section>
{/* Availability */}
<Section icon="event" title="Availability">
  <p className="text-sm font-medium text-gray-700 mb-3">
    Available dates<span className="text-red-500 ml-1">*</span>
  </p>
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
</Section>

{/* Price & Guests */}
<Section icon="attach_money" title="Price & Guests">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <label htmlFor="price" className="text-sm font-medium text-gray-700">
        Price per night (NOK)<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        id="price"
        name="price"
        type="number"
        defaultValue={form.price}
        onBlur={e => {
          handleChange('price')(e);
          updateField('price', e.target.value);
        }}
        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
      />
      {errors.price && (
        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
      )}
    </div>

    <div>
      <label htmlFor="guests" className="text-sm font-medium text-gray-700">
        Max guests<span className="text-red-500 ml-1">*</span>
      </label>
      <input
        id="guests"
        name="guests"
        type="number"
        defaultValue={form.guests}
        onBlur={e => {
          handleChange('guests')(e);
          updateField('guests', Number(e.target.value));
        }}
        className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
      />
      {errors.guests && (
        <p className="text-red-500 text-xs mt-1">{errors.guests}</p>
      )}
    </div>
  </div>
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
    disabled={!allRequiredValid}
    className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition
      ${allRequiredValid
        ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700 active:bg-purple-800'
        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
      }`}
  >
    <span className="material-symbols-outlined">publish</span> Publish venue
  </button>
</div>

    </form>
    </main>
  );
}
