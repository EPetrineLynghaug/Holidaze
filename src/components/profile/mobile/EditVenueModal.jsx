import React, { useEffect, useCallback } from 'react';
import DateRangePicker from '../../../components/ui/calender/DateRangePicker';
import useBookingRanges from '../../../hooks/useBookingRanges';
import BottomSheet from '../../../components/ui/mobildemodal/BottomSheet';
import { useVenueForm } from '../../../hooks/useVenueForm';
import { useManageVenues } from '../../../hooks/api/useVenues';
import {
    STEPS,
    ENV_OPTIONS,
    AUD_OPTIONS,
    FAC_OPTIONS,
  } from '../../../components/constants/VenueFormConfig';
export default function EditVenueForm({ userName, onCreated, onClose, existingVenue }) {
  const { createVenue, updateVenue } = useManageVenues();
  const {
    step,
    form,
    updateField,
    toggleField,
    addImage,
    setImage,
    removeImage,
    next,
    resetForm,
  } = useVenueForm(userName, onCreated);

  // Populate or reset form
  useEffect(() => {
    if (!existingVenue) {
      resetForm();
      return;
    }
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
  }, [existingVenue, resetForm, updateField]);

  // Submit handler
  const handleSubmit = useCallback(async () => {
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
        ...ENV_OPTIONS.reduce((acc, o) => ({
          ...acc,
          [o.key]: form.environments.includes(o.key),
        }), {}),
        ...AUD_OPTIONS.reduce((acc, o) => ({
          ...acc,
          [o.key]: form.audiences.includes(o.key),
        }), {}),
        ...FAC_OPTIONS.reduce((acc, o) => ({
          ...acc,
          [o.key]: form.facilities.includes(o.key),
        }), {}),
      },
      availability: {
        start: form.dateRange.startDate.toISOString().slice(0, 10),
        end: form.dateRange.endDate.toISOString().slice(0, 10),
      },
    };

    try {
      if (existingVenue?.id) {
        await updateVenue(existingVenue.id, payload);
      } else {
        await createVenue(payload);
      }
      onCreated();
    } catch (err) {
      console.error(err);
    }
  }, [createVenue, updateVenue, form, existingVenue, onCreated]);

  // Render fields for each step
  const renderFields = () => {
    switch (step) {
      case 0:
        return (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-lg"
              placeholder="Title"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
            />
            <textarea
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 h-32"
              placeholder="Description"
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
            />
            <input
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              placeholder="Address"
              value={form.location.address}
              onChange={e => updateField('location', { ...form.location, address: e.target.value })}
            />
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                placeholder="City"
                value={form.location.city}
                onChange={e => updateField('location', { ...form.location, city: e.target.value })}
              />
              <input
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
                placeholder="Country"
                value={form.location.country}
                onChange={e => updateField('location', { ...form.location, country: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-purple-700 mb-1">Type</p>
              <div className="flex gap-2">
                {['House', 'Apartment', 'Hotel', 'Other'].map(t => (
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
                  placeholder="Image URL"
                  value={url}
                  onChange={e => setImage(i, e.target.value)}
                />
                <button onClick={() => removeImage(i)} className="text-red-500 text-xl">
                  &times;
                </button>
              </div>
            ))}
            <button
              onClick={addImage}
              className="w-full mt-2 py-2 bg-purple-200 rounded-lg hover:bg-purple-300 text-purple-700 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              Add Image
            </button>
          </>
        );

      case 2:
        return (
          <>
            {[
              { label: 'Environments', opts: ENV_OPTIONS, field: 'environments' },
              { label: 'Audiences', opts: AUD_OPTIONS, field: 'audiences' },
              { label: 'Facilities', opts: FAC_OPTIONS, field: 'facilities' },
            ].map(group => (
              <div key={group.label} className="mt-4">
                <p className="text-sm font-medium text-purple-700 mb-1">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.opts.map(o => {
                    const active = form[group.field]?.includes(o.key);
                    return (
                      <button
                        key={o.key}
                        onClick={() => toggleField(group.field, o.key)}
                        className={`flex items-center gap-1 px-3 py-1 border rounded-full text-sm transition ${
                          active ? 'bg-purple-300 text-white' : 'bg-white text-purple-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">{o.icon}</span>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        );

      case 3:
        return (
          <>
            <p className="text-sm font-medium text-purple-700 mb-1">Availability</p>
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
        
          </>
        );

      case 4:
        return (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Price per night"
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              value={form.price}
              onChange={e => updateField('price', e.target.value)}
            />
            <input
              type="number"
              placeholder="Guests"
              min={1}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              value={form.guests}
              onChange={e => updateField('guests', e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BottomSheet title={existingVenue ? 'Edit Venue' : 'New Venue'} onClose={onClose}>
      <div className="flex flex-col h-full p-6 bg-gray-50 rounded-xl shadow-md">
        
        {/* Progress Bar */}
        <div className="sticky top-0 bg-white z-10 flex w-full px-4 space-x-1 py-3 border-b border-purple-200">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full ${i <= step ? 'bg-purple-400' : 'bg-purple-200'}`}
            />
          ))}
        </div>
  
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {renderFields()}
        </div>
  
        {/* Footer */}
        <div className="p-4 bg-white border-t border-purple-200 flex justify-end">
          <button
            onClick={step === STEPS.length - 1 ? handleSubmit : next}
            className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold shadow-md transition"
          >
            {step === STEPS.length - 1 ? (existingVenue ? 'Update Venue' : 'Create Venue') : 'Next'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}  
