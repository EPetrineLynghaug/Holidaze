import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { useVenueForm } from '../../../hooks/useVenueForm';
import {
  STEPS,
  ENV_OPTIONS,
  AUD_OPTIONS,
  FAC_OPTIONS,
} from '../../constans/VenueFormConfig';
import BottomSheet from '../../../components/ui/mobildemodal/BottomSheet';

export default function AddVenueForm({ userName, onCreated, onClose }) {
   const navigate = useNavigate();
  const {
    step,
    form,
    feedback,
    updateField,
    toggleField,
    addImage,
    setImage,
    removeImage,
    next,
    back,
    submit,
  } = useVenueForm(userName, onCreated);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const renderStepFields = () => {
    switch (step) {
      case 0:
        return (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-lg font-medium"
              placeholder="Title"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
            />
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 resize-none mt-1 h-32 text-sm"
              placeholder="Description"
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 mt-1 text-sm"
              placeholder="Street Address"
              value={form.location.address}
              onChange={e => updateField('location', { ...form.location, address: e.target.value })}
            />
            <div className="flex gap-1 mt-1">
              <input
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-sm min-w-0"
                placeholder="City"
                value={form.location.city}
                onChange={e => updateField('location', { ...form.location, city: e.target.value })}
              />
              <input
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-sm min-w-0"
                placeholder="Country"
                value={form.location.country}
                onChange={e => updateField('location', { ...form.location, country: e.target.value })}
              />
            </div>
            <div className="mt-1 mb-1">
              <p className="text-sm font-medium text-purple-700 mb-1">Type</p>
              <div className="flex flex-wrap gap-1">
                {['House','Apartment','Hotel','Other'].map(t => (
                  <button
                    key={t}
                    onClick={() => updateField('type', t)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full border text-sm transition ${
                      form.type === t
                        ? 'bg-purple-300 text-white border-transparent'
                        : 'bg-white text-purple-700 border-purple-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {t === 'House' ? 'home' : t === 'Apartment' ? 'apartment' : t === 'Hotel' ? 'hotel' : 'home_work'}
                    </span>
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
              <div key={i} className="flex items-center space-x-2 mt-1">
                <input
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-sm"
                  placeholder="Image URL"
                  value={url}
                  onChange={e => setImage(i, e.target.value)}
                />
                <button
                  onClick={() => removeImage(i)}
                  className="material-symbols-outlined text-purple-700 text-xl"
                >
                  delete
                </button>
              </div>
            ))}
            <button
              onClick={addImage}
              className="w-full mt-1 py-2 bg-purple-200 hover:bg-purple-300 text-purple-700 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-base">add_a_photo</span>
              Add Photo
            </button>
          </>
        );
      case 2:
        return (
          <>
            {/* Environments, Audiences, Facilities */}
            {['Environments', 'Audiences', 'Facilities'].map((group, gi) => {
              const opts = gi === 0 ? ENV_OPTIONS : gi === 1 ? AUD_OPTIONS : FAC_OPTIONS;
              const field = gi === 0 ? 'environments' : gi === 1 ? 'audiences' : 'facilities';
              return (
                <div key={group} className="mt-4">
                  <p className="text-sm font-medium text-purple-700 mb-2">{group}</p>
                  <div className="flex flex-wrap gap-3">
                    {opts.map(o => {
                      const active = form[field].includes(o.key);
                      return (
                        <button
                          key={o.key}
                          onClick={() => toggleField(field, o.key)}
                          className={`flex items-center gap-1 px-4 py-1 rounded-full border text-sm transition ${
                            active
                              ? 'bg-purple-300 text-white border-transparent'
                              : 'bg-white text-purple-700 border-purple-200'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">{o.icon}</span>
                          <span>{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Bathrooms */}
            <div className="mt-4">
              <p className="text-sm font-medium text-purple-700 mb-2">Bathrooms</p>
              <div className="flex gap-3">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => updateField('bathrooms', n)}
                    className={`px-4 py-1 rounded-full border text-sm ${
                      form.bathrooms === n
                        ? 'bg-purple-300 text-white border-transparent'
                        : 'bg-white text-purple-700 border-purple-200'
                    }`}
                  >
                    {n}{n === 3 ? '+' : ''}
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <p className="text-sm font-medium text-purple-700 mb-2 mt-4">Availability</p>
            <div className="border rounded-lg overflow-hidden">
              <DateRange
                ranges={[form.dateRange]}
                onChange={r => updateField('dateRange', r.selection)}
                editableDateInputs
                moveRangeOnFirstSelection={false}
                minDate={new Date()}
              />
            </div>
          </>
        );
      case 4:
        return (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <input
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              type="number"
              placeholder="Price / night"
              value={form.price}
              onChange={e => updateField('price', e.target.value)}
            />
            <input
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              type="number"
              placeholder="Guests"
              min={1}
              value={form.guests}
              onChange={e => updateField('guests', Number(e.target.value))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <BottomSheet title="Create Venue" onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* Progress */}
        <div className="sticky top-0 bg-white z-10 flex w-full px-4 space-x-1 py-2 border-b border-purple-100 overflow-x-hidden">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded ${i <= step ? 'bg-purple-300' : 'bg-purple-100'}`}
            />
          ))}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-1">
          {renderStepFields()}
          {feedback.error && <p className="text-red-500 text-sm">{feedback.error}</p>}
          {feedback.success && <p className="text-green-600 text-sm">{feedback.success}</p>}
        </div>
        {/* Footer */}
        <div className="p-3 bg-white border-t border-purple-100 sticky bottom-0">
          <button
            onClick={step === STEPS.length - 1 ? submit : next}
            className="w-full py-2 bg-purple-300 hover:bg-purple-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <span className="text-base">
              {step === STEPS.length - 1 ? 'Submit' : 'Next'}
            </span>
            <span className="material-symbols-outlined text-xl">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
