// src/components/profile/AddVenuePage.jsx

import React, { useEffect } from 'react';
import DateRangePicker from '../../../components/ui/calender/DateRangePicker';
import useBookingRanges from '../../../hooks/data/useBookingRanges';
import { useVenueForm } from '../../../hooks/forms/useVenueForm';
import { ENV_OPTIONS, AUD_OPTIONS, FAC_OPTIONS } from '../../constants/VenueFormConfig';
import useNewVenueValidation from '../../../hooks/forms/useNewVenueValidation';
import { venueValidationRules } from '../../constants/NewVenueValidationConfig';


export default function AddVenuePage({ userName, onCreated }) {
  const venueForm = useVenueForm(userName, onCreated);
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
  } = venueForm;

  const { bookingRanges, disabledDates } = useBookingRanges(form.bookings);
  const { errors, handleChange, remainingChars, isValid } =
    useNewVenueValidation(
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

  // Build the JSON payload exactly as your API expects
  function getPayload() {
    return {
      name:        form.title,
      description: form.description,
      media:       form.images.filter(u => !!u.trim()).map(url => ({ url: url.trim() })),
      price:       Number(form.price),
      maxGuests:   Number(form.guests),
      location: {
        address: form.location.address,
        city:    form.location.city,
        country: form.location.country,
      },
      meta: {
        ...ENV_OPTIONS.reduce((m,o) => ({ ...m, [o.key]: form.environments.includes(o.key) }), {}),
        ...AUD_OPTIONS.reduce((m,o) => ({ ...m, [o.key]: form.audiences.includes(o.key) }), {}),
        ...FAC_OPTIONS.reduce((m,o) => ({ ...m, [o.key]: form.facilities.includes(o.key) }), {}),
        bathrooms: form.bathrooms,
      },
      availability: {
        start: form.dateRange.startDate.toISOString().split('T')[0],
        end:   form.dateRange.endDate.toISOString().split('T')[0],
      }
    };
  }

  const allImagesFilled  = form.images.every(u => u.trim() !== '');
  const hasDatesSelected = !!(form.dateRange.startDate && form.dateRange.endDate);
  const hasPrice         = Number(form.price) > 0;
  const hasGuests        = Number(form.guests) > 0;

  const allValid =
    isValid('title') &&
    isValid('description') &&
    isValid('address') &&
    isValid('city') &&
    isValid('country') &&
    allImagesFilled &&
    hasDatesSelected &&
    hasPrice &&
    hasGuests;

  // prevent body scroll when date picker is open
  useEffect(() => {
    document.body.style.overflow = form.datePickerOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [form.datePickerOpen]);

 const handleSubmit = e => {
    e.preventDefault();
    if (!allValid) return;
    submit();   
  };
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
        <span className="material-symbols-outlined text-purple-600">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );

  const TYPE_ICONS = { House:'home', Apartment:'apartment', Hotel:'hotel', Other:'home_work' };

  return (
    <main className="w-full max-h-screen overflow-y-auto scrollbar-hide">
      <form onSubmit={handleSubmit} className="relative w-full mx-auto p-4 md:p-8 max-h-screen overflow-y-auto space-y-8">
        <header className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            List a new venue
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto md:mx-0">
            Share your amazing place with travelers and start earning today.
          </p>
        </header>

        {/* Basic info */}
        <Section icon="info" title="Basic information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-base font-semibold text-gray-800 mb-2">
                Title<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="title"
                type="text"
                defaultValue={form.title}
                onBlur={e => { handleChange('title')(e); updateField('title', e.target.value); }}
                maxLength={100}
                placeholder="Nordic lake cabin"
                className={`mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 transition ${
                  errors.title ? 'border-red-500 focus:border-red-500' : 'focus:ring-purple-200 focus:border-purple-400'
                }`}
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{remainingChars('title')} characters left</span>
                {errors.title && <span className="text-red-500">{errors.title}</span>}
              </div>
            </div>
            {/* Street address */}
            <div className="mb-6">
              <label htmlFor="address" className="block text-base font-semibold text-gray-800 mb-2">
                Street address<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                id="address"
                type="text"
                defaultValue={form.location.address}
                onBlur={e => { handleChange('address')(e); updateLocationField('address', e.target.value); }}
                maxLength={200}
                placeholder="123 Main St"
                className="mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>{remainingChars('address')} characters left</span>
                {errors.address && <span className="text-red-500">{errors.address}</span>}
              </div>
            </div>
            {/* City & Country */}
            {['city','country'].map(field => (
              <div key={field} className="mb-6">
                <label htmlFor={field} className="block text-base font-semibold text-gray-800 mb-2">
                  {field.charAt(0).toUpperCase()+field.slice(1)}<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id={field}
                  type="text"
                  defaultValue={form.location[field]}
                  onBlur={e => { handleChange(field)(e); updateLocationField(field, e.target.value); }}
                  maxLength={100}
                  placeholder={field === 'city' ? 'Oslo' : 'Norway'}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{remainingChars(field)} characters left</span>
                  {errors[field] && <span className="text-red-500">{errors[field]}</span>}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Description */}
        <Section icon="description" title="Description">
          <textarea
            rows={6}
            defaultValue={form.description}
            onBlur={e => { handleChange('description')(e); updateField('description', e.target.value); }}
            maxLength={8000}
            placeholder="Describe what makes your venue special"
            className="w-full rounded-xl border border-gray-300 px-5 py-3 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition resize-none"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{remainingChars('description')} characters left</span>
            {errors.description && <span className="text-red-500">{errors.description}</span>}
          </div>
        </Section>

        {/* Venue type */}
        <Section icon="home_pin" title="Venue type">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              {Object.entries(TYPE_ICONS).map(([t,icon]) => (
                <Chip
                  key={t}
                  active={form.type===t}
                  onClick={()=>updateField('type',t)}
                >
                  <span className="material-symbols-outlined">{icon}</span> {t}
                </Chip>
              ))}
            </div>
          </div>
        </Section>

        {/* Images */}
        <Section icon="calendar_month" title="Images">
          {form.images.map((url,i)=>(
            <div key={i} className="flex gap-3 items-center">
              <input
                type="url"
                defaultValue={url}
                onBlur={e=>setImage(i,e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition"
                placeholder="https://example.com/photo.jpg"
              />
              <button type="button" onClick={()=>removeImage(i)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-full">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addImage}
            disabled={!allImagesFilled}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition ${
              allImagesFilled
                ? 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined">add_photo_alternate</span> Add image URL
          </button>
        </Section>

        {/* Amenities */}
        <Section icon="emoji_events" title="Amenities">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              { title:'Environments', opts:ENV_OPTIONS, field:'environments' },
              { title:'Audiences',   opts:AUD_OPTIONS,   field:'audiences'   },
              { title:'Facilities',  opts:FAC_OPTIONS,    field:'facilities'  },
            ].map(({title,opts,field})=>(
              <div key={field}>
                <h3 className="mb-2 font-medium text-gray-800">{title}</h3>
                <div className="flex flex-wrap gap-3">
                  {opts.map(o=>(
                    <Chip
                      key={o.key}
                      active={form[field].includes(o.key)}
                      onClick={()=>toggleField(field,o.key)}
                    >
                      <span className="material-symbols-outlined">{o.icon}</span> {o.label}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Availability */}
        <Section icon="event" title="Availability">
          <DateRangePicker
            value={form.dateRange}
            onChange={({startDate,endDate,rentalDays})=>{
              updateField('dateRange',{startDate,endDate,key:'selection'});
              updateField('rentalDays',rentalDays);
            }}
            bookingRanges={bookingRanges}
            disabledDates={disabledDates}
            minDate={new Date()}
          />
        </Section>

        {/* Price & Guests */}
        <Section icon="attach_money" title="Price & Guests">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-gray-700">Price (NOK)<span className="text-red-500 ml-0.5">*</span></label>
              <input
                type="number"
                defaultValue={form.price}
                onBlur={e=>{handleChange('price')(e); updateField('price',e.target.value);}}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 transition"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Max Guests<span className="text-red-500 ml-0.5">*</span></label>
              <input
                type="number"
                defaultValue={form.guests}
                onBlur={e=>{handleChange('guests')(e); updateField('guests',e.target.value);}}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-4 focus:ring-purple-200 transition"
              />
              {errors.guests && <p className="mt-1 text-xs text-red-500">{errors.guests}</p>}
            </div>
          </div>
        </Section>

        {/* Feedback & Publish */}
        {feedback.error   && <p className="text-red-500 text-sm">{feedback.error}</p>}
        {feedback.success && <p className="text-green-600 text-sm">{feedback.success}</p>}

        <div className="pt-6 mb-30">
          <button
            type="submit"
            disabled={!allValid}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-semibold transition ${
              allValid
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
