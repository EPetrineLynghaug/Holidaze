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
  FAC_OPTIONS
} from '../../constans/VenueFormConfig';



export default function AddVenueFormMobile({ userName, onCreated }) {
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
    submit
  } = useVenueForm(userName, onCreated);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              placeholder="Title"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
            />
            <textarea
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 h-64 resize-none"
              placeholder="Description"
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
            />
          </>
        );
      case 1:
        return (
          <>
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
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
              className="w-full mt-2 py-2 bg-purple-200 hover:bg-purple-300 text-purple-700 rounded-lg flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_a_photo</span>
              Add Photo
            </button>
          </>
        );
      case 2:
        return (
          <>
            {['Environments', 'Audiences', 'Facilities'].map((group, gi) => {
              const opts = gi === 0
                ? ENV_OPTIONS
                : gi === 1
                  ? AUD_OPTIONS
                  : FAC_OPTIONS;
              const field = gi === 0
                ? 'environments'
                : gi === 1
                  ? 'audiences'
                  : 'facilities';
              return (
                <div key={group}>
                  <p className="text-sm font-medium text-purple-700 mb-1">{group}</p>
                  <div className="flex flex-wrap gap-2">
                    {opts.map(o => {
                      const active = form[field].includes(o.key);
                      return (
                        <button
                          key={o.key}
                          onClick={() => toggleField(field, o.key)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full border ${
                            active
                              ? 'bg-purple-300 text-white border-transparent'
                              : 'bg-white text-purple-700 border-purple-200'
                          }`}
                        >
                          <span className="material-symbols-outlined">{o.icon}</span>
                          <span>{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div>
              <p className="text-sm font-medium text-purple-700 mb-1">Bathrooms</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => updateField('bathrooms', n)}
                    className={`px-3 py-1 rounded-full border ${
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
            <p className="text-sm font-medium text-purple-700 mb-1">Availability</p>
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
          <div className="grid grid-cols-2 gap-2">
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              type="number"
              placeholder="Price / night"
              value={form.price}
              onChange={e => updateField('price', e.target.value)}
            />
            <input
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
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
    <section className="fixed inset-x-0 bottom-0 h-4/5">
      <div className="absolute inset-0 bg-white rounded-t-3xl shadow-lg flex flex-col">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 pt-6 pb-3 border-b border-purple-100">
          {step > 0 ? (
            <button onClick={back} className="material-symbols-outlined text-xl text-purple-700">
              arrow_back
            </button>
          ) : (
            <button onClick={() => navigate('/')} className="material-symbols-outlined text-xl text-purple-700">
              close
            </button>
          )}
          <h2 className="text-lg font-semibold text-purple-900">Create Venue</h2>
          <span className="w-6" />
        </div>

        {/* Progress */}
        <div className="sticky top-[calc(3.75rem)] bg-white z-10 flex w-full px-4 space-x-1 py-2 border-b border-purple-100">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded ${i <= step ? 'bg-purple-300' : 'bg-purple-100'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {renderStep()}
          {feedback.error && <p className="text-red-500 text-sm">{feedback.error}</p>}
          {feedback.success && <p className="text-green-600 text-sm">{feedback.success}</p>}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-purple-100">
          <button
            onClick={step === STEPS.length - 1 ? submit : next}
            className="w-full py-3 bg-purple-300 hover:bg-purple-400 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            <span>{step === STEPS.length - 1 ? 'Submit' : 'Next'}</span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </div>

      </div>
    </section>
  );
}
