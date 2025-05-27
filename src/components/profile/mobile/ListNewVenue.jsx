import React, { useEffect, useState } from 'react';
import DateRangePicker from '../../../components/ui/calender/DateRangePicker';
import BottomSheet from '../../ui/popup/BottomSheet';
import { useVenueForm } from '../../../hooks/forms/useVenueForm';
import useBookingRanges from '../../../hooks/data/useBookingRanges';
import useNewVenueValidation from '../../../hooks/forms/useNewVenueValidation';
import {
  STEPS,
  ENV_OPTIONS,
  AUD_OPTIONS,
  FAC_OPTIONS,
} from '../../constants/VenueFormConfig';
import { venueValidationRules } from '../../constants/NewVenueValidationConfig';

export default function AddVenueForm({ userName, onCreated, onClose }) {
  const {
    step,
    form,
    feedback,
    updateField,
    updateLocationField,
    toggleField,
    addImage,
    setImage,
    removeImage,
    next,
    back,
    submit,    // ← kall uten args for POST
    reset,
  } = useVenueForm(userName, onCreated);

  const { bookingRanges, disabledDates } = useBookingRanges(form.bookings || []);

  // validerings‐hook som sjekker tekstfelt
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

  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  // Lukk & reset på suksess
  useEffect(() => {
    if (feedback.success) {
      setTimeout(() => {
        onCreated?.();
        onClose?.();
        reset?.();
      }, 800);
    }
  }, [feedback.success, onCreated, onClose, reset]);

  // Lås bakgrunn-scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Sjekk at alt er utfylt på siste steg
  const allImagesFilled = form.images.length > 0 && form.images.every(u => u.trim() !== '');
  const hasDates        = Boolean(form.dateRange?.startDate && form.dateRange?.endDate);
  const hasPrice        = Number(form.price) > 0;
  const hasGuests       = Number(form.guests) > 0;
  const allValid =
    isValid('title') &&
    isValid('description') &&
    isValid('address') &&
    isValid('city') &&
    isValid('country') &&
    allImagesFilled &&
    hasDates &&
    hasPrice &&
    hasGuests;

  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;

  const handleNextOrSubmit = () => {
    // Hvis vi er på siste steg og ikke valid → vis feilmeldinger
    if (step === STEPS.length - 1 && !allValid) {
      setShowAllErrors(true);
      return;
    }
    setShowAllErrors(false);

    if (step === STEPS.length - 1) {
      // Opprett nytt venue (POST)
      submit();
    } else {
      next();
    }
    document.activeElement?.blur();
  };

 
  const renderStepFields = () => {
    switch (step) {
      case 0: 
        return (
          <>
            <label className="block font-semibold text-gray-800">
              Title{requiredStar}
            </label>
            <input
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.title && showAllErrors ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-purple-200`}
              placeholder="Title"
              value={form.title}
              maxLength={100}
              onBlur={e => {
                setTouched(t => ({ ...t, title: true }));
                handleChange('title')(e);
              }}
              onChange={e => updateField('title', e.target.value)}
              autoFocus
            />
            {(touched.title || showAllErrors) && errors.title && (
              <p className="text-xs text-red-500">{errors.title}</p>
            )}

            <label className="block font-semibold text-gray-800 mt-4">
              Description{requiredStar}
            </label>
            <textarea
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.description && showAllErrors ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-purple-200 h-24 resize-none`}
              placeholder="Description"
              value={form.description}
              maxLength={8000}
              onBlur={e => {
                setTouched(t => ({ ...t, description: true }));
                handleChange('description')(e);
              }}
              onChange={e => updateField('description', e.target.value)}
            />
            {(touched.description || showAllErrors) && errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}

            <label className="block font-semibold text-gray-800 mt-4">
              Street Address{requiredStar}
            </label>
            <input
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.address && showAllErrors ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-purple-200`}
              placeholder="123 Main St"
              value={form.location.address}
              maxLength={200}
              onBlur={handleChange('address')}
              onChange={e => updateLocationField('address', e.target.value)}
            />
            {(showAllErrors && errors.address) && (
              <p className="text-xs text-red-500">{errors.address}</p>
            )}

            <div className="flex gap-2 mt-4">
              <div className="flex-1">
                <label className="block font-semibold text-gray-800">
                  City{requiredStar}
                </label>
                <input
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.city && showAllErrors ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-purple-200`}
                  placeholder="City"
                  value={form.location.city}
                  maxLength={100}
                  onBlur={handleChange('city')}
                  onChange={e => updateLocationField('city', e.target.value)}
                />
                {(showAllErrors && errors.city) && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-800">
                  Country{requiredStar}
                </label>
                <input
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors.country && showAllErrors ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-purple-200`}
                  placeholder="Country"
                  value={form.location.country}
                  maxLength={100}
                  onBlur={handleChange('country')}
                  onChange={e => updateLocationField('country', e.target.value)}
                />
                {(showAllErrors && errors.country) && (
                  <p className="text-xs text-red-500">{errors.country}</p>
                )}
              </div>
            </div>
          </>
        );

      case 1: // Images
        return (
          <div className="space-y-2">
            {form.images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-200"
                  placeholder="https://..."
                  value={url}
                  onBlur={e => setImage(i, e.target.value)}
                  onChange={e => setImage(i, e.target.value)}
                />
                <button
                  type="button"
                  className="text-red-600"
                  onClick={() => removeImage(i)}
                >
                  delete
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={!allImagesFilled}
              className={`px-4 py-2 rounded-lg text-sm ${
                allImagesFilled
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              onClick={addImage}
            >
              Add image URL
            </button>
          </div>
        );

      case 2: // Amenities
        return (
          <div className="space-y-4">
            {[ 
              { title: 'Environments', opts: ENV_OPTIONS, field: 'environments' },
              { title: 'Audiences',   opts: AUD_OPTIONS,   field: 'audiences' },
              { title: 'Facilities',  opts: FAC_OPTIONS,    field: 'facilities' },
            ].map(({ title, opts, field }) => (
              <div key={field}>
                <p className="font-medium text-purple-700">{title}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {opts.map(o => (
                    <button
                      key={o.key}
                      type="button"
                      onClick={() => toggleField(field, o.key)}
                      className={`inline-flex items-center gap-1 px-4 py-1 rounded-full border text-sm ${
                        form[field].includes(o.key)
                          ? 'bg-purple-300 text-white border-transparent'
                          : 'bg-white text-purple-700 border-purple-200'
                      }`}
                    >
                      <span className="material-symbols-outlined">{o.icon}</span>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 3: // Availability
        return (
          <DateRangePicker
            value={form.dateRange}
            onChange={({ startDate, endDate, rentalDays }) => {
              updateField('dateRange', { startDate, endDate, key: 'selection' });
              updateField('rentalDays', rentalDays);
            }}
            bookingRanges={bookingRanges}
            disabledDates={disabledDates}
            minDate={new Date()}
          />
        );

      case 4: // Price & Guests
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-gray-700">
                Price per night (NOK){requiredStar}
              </label>
              <input
                type="number"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.price && showAllErrors ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-purple-200`}
                value={form.price}
                onBlur={handleChange('price')}
                onChange={e => updateField('price', e.target.value)}
              />
            </div>
            <div>
              <label className="font-medium text-gray-700">
                Max guests{requiredStar}
              </label>
              <input
                type="number"
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.guests && showAllErrors ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-purple-200`}
                value={form.guests}
                onBlur={handleChange('guests')}
                onChange={e => updateField('guests', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <BottomSheet title="Create Venue" onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Progress bar */}
        <div className="sticky top-0 bg-white z-10 flex px-4 py-2 space-x-1 border-b border-purple-100">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded ${i <= step ? 'bg-purple-500' : 'bg-purple-100'}`}
            />
          ))}
        </div>

        {/* Innhold */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {renderStepFields()}
          {feedback.error   && <p className="text-red-500 text-sm">{feedback.error}</p>}
          {feedback.success && <p className="text-green-600 text-sm">{feedback.success}</p>}
        </div>

        {/* Footer-knapper */}
        <div className="p-3 bg-white border-t border-purple-100 sticky bottom-0">
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="w-1/3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                ← Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNextOrSubmit}
              disabled={step === STEPS.length - 1 && !allValid}
              className={`flex-1 py-2 rounded-lg text-white ${
                step === STEPS.length - 1
                  ? allValid
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600'
              }`}
            >
              {step === STEPS.length - 1 ? 'Publish venue →' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
