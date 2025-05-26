// src/components/profile/mobile/EditVenueForm.jsx

import React, { useEffect, useState } from "react";
import DateRangePicker from "../../ui/calender/DateRangePicker";
import { useVenueForm } from "../../../hooks/forms/useVenueForm";
import useBookingRanges from "../../../hooks/data/useBookingRanges";
import {
  STEPS,
  ENV_OPTIONS,
  AUD_OPTIONS,
  FAC_OPTIONS,
} from "../../constants/VenueFormConfig";
import BottomSheet from "../../ui/popup/BottomSheet";
import useNewVenueValidation from "../../../hooks/forms/useNewVenueValidation";
import { venueValidationRules } from "../../constants/NewVenueValidationConfig";

export default function EditVenueForm({
  userName,
  onCreated,
  onClose,
  existingVenue,
}) {
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
    setInitialValues,
  } = useVenueForm(userName, onCreated);

  const [hasInitializedId, setHasInitializedId] = useState(null);

  // Setter form-feltene kun én gang per venue
  useEffect(() => {
    if (
      existingVenue &&
      setInitialValues &&
      hasInitializedId !== existingVenue.id
    ) {
      setInitialValues({
        title: existingVenue.name || "",
        description: existingVenue.description || "",
        images: (existingVenue.media || []).map((m) => m.url || ""),
        price:
          existingVenue.price != null
            ? String(existingVenue.price)
            : "",
        guests:
          existingVenue.maxGuests != null
            ? String(existingVenue.maxGuests)
            : "",
        location: {
          address: existingVenue.location?.address || "",
          city: existingVenue.location?.city || "",
          country: existingVenue.location?.country || "",
        },
        type: existingVenue.type || "",
        environments: existingVenue.environments || [],
        audiences: existingVenue.audiences || [],
        facilities: existingVenue.facilities || [],
        bathrooms:
          (existingVenue.meta && existingVenue.meta.bathrooms) || 1,
        dateRange:
          existingVenue.availability?.start &&
          existingVenue.availability?.end
            ? {
                startDate: new Date(existingVenue.availability.start),
                endDate: new Date(existingVenue.availability.end),
                key: "selection",
              }
            : {
                startDate: new Date(),
                endDate: new Date(),
                key: "selection",
              },
        bookings: existingVenue.bookings || [],
      });
      setHasInitializedId(existingVenue.id);
    }
  }, [existingVenue, setInitialValues, hasInitializedId]);

  const { bookingRanges, disabledDates } = useBookingRanges(form.bookings || []);

  const validation = useNewVenueValidation(
    {
      title: form.title,
      description: form.description,
      address: form.location.address,
      city: form.location.city,
      country: form.location.country,
      price: form.price,
      guests: form.guests,
    },
    venueValidationRules
  );
  const { errors, handleChange, remainingChars, isValid } = validation;

  const [touched, setTouched] = useState({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  useEffect(() => {
    if (feedback.success) {
      setTimeout(() => {
        if (onCreated) onCreated();
        if (onClose) onClose();
      }, 1000);
    }
  }, [feedback.success, onCreated, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleNextOrSubmit = () => {
    setShowAllErrors(false);
    if (step === STEPS.length - 1) {
      submit(existingVenue?.id); // <-- Denne gjør PATCH ved edit!
    } else {
      next();
    }
    if (
      document.activeElement &&
      typeof document.activeElement.blur === "function"
    ) {
      document.activeElement.blur();
    }
  };

  const requiredStar = <span className="text-red-500 ml-0.5">*</span>;
  const numberInputMode = {
    inputMode: "numeric",
    pattern: "[0-9]*",
    type: "text",
    autoComplete: "off",
    enterKeyHint: "done",
  };

  const isStepValid = () => true; // Alltid true ved editing

  // ========== RENDER STEPS FUNKSJON START ========== //
  const renderStepFields = () => {
    switch (step) {
      case 0:
        return (
          <div className="max-w-3xl mx-auto">
            <label className="block text-base font-semibold text-gray-800 mb-1 mt-2">
              Title{requiredStar}
            </label>
            <input
              className={`w-full px-4 py-2 border rounded-lg font-medium bg-white
                ${errors.title && (touched.title || showAllErrors)
                  ? "border-red-500"
                  : "border-gray-300"}
                focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-lg transition
              `}
              placeholder="Title"
              value={form.title}
              maxLength={100}
              onBlur={(e) => {
                setTouched((t) => ({ ...t, title: true }));
                handleChange("title")(e);
              }}
              onChange={(e) => updateField("title", e.target.value)}
              autoFocus
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>{remainingChars("title")} left</span>
            </div>
            {(touched.title || showAllErrors) && errors.title && (
              <div className="text-xs text-red-500 mt-0.5">{errors.title}</div>
            )}

            <label className="block text-base font-semibold text-gray-800 mb-1 mt-3">
              Description{requiredStar}
            </label>
            <textarea
              className={`w-full px-4 py-2 border rounded-lg bg-white
                ${errors.description && (touched.description || showAllErrors)
                  ? "border-red-500"
                  : "border-gray-300"}
                focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm resize-none h-24 transition
              `}
              placeholder="Description"
              value={form.description}
              maxLength={8000}
              onBlur={(e) => {
                setTouched((t) => ({ ...t, description: true }));
                handleChange("description")(e);
              }}
              onChange={(e) => updateField("description", e.target.value)}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>{remainingChars("description")} left</span>
            </div>
            {(touched.description || showAllErrors) && errors.description && (
              <div className="text-xs text-red-500 mt-0.5">{errors.description}</div>
            )}

            <label className="block text-base font-semibold text-gray-800 mb-1 mt-3">
              Street Address{requiredStar}
            </label>
            <input
              className={`w-full px-4 py-2 border rounded-lg bg-white
                ${errors.address && (touched.address || showAllErrors)
                  ? "border-red-500"
                  : "border-gray-300"}
                focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition
              `}
              placeholder="Street Address"
              value={form.location.address}
              maxLength={200}
              onBlur={(e) => {
                setTouched((t) => ({ ...t, address: true }));
                handleChange("address")(e);
              }}
              onChange={(e) =>
                updateField("location", {
                  ...form.location,
                  address: e.target.value,
                })
              }
            />
            <div className="flex justify-between text-xs text-gray-500 mt-0.5">
              <span>{remainingChars("address")} left</span>
            </div>
            {(touched.address || showAllErrors) && errors.address && (
              <div className="text-xs text-red-500 mt-0.5">{errors.address}</div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mt-3">
              <div className="flex-1">
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  City{requiredStar}
                </label>
                <input
                  className={`w-full px-4 py-2 border rounded-lg bg-white
                    ${errors.city && (touched.city || showAllErrors)
                      ? "border-red-500"
                      : "border-gray-300"}
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition
                  `}
                  placeholder="City"
                  value={form.location.city}
                  maxLength={100}
                  onBlur={(e) => {
                    setTouched((t) => ({ ...t, city: true }));
                    handleChange("city")(e);
                  }}
                  onChange={(e) =>
                    updateField("location", {
                      ...form.location,
                      city: e.target.value,
                    })
                  }
                />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>{remainingChars("city")} left</span>
                </div>
                {(touched.city || showAllErrors) && errors.city && (
                  <div className="text-xs text-red-500 mt-0.5">{errors.city}</div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Country{requiredStar}
                </label>
                <input
                  className={`w-full px-4 py-2 border rounded-lg bg-white
                    ${errors.country && (touched.country || showAllErrors)
                      ? "border-red-500"
                      : "border-gray-300"}
                    focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition
                  `}
                  placeholder="Country"
                  value={form.location.country}
                  maxLength={100}
                  onBlur={(e) => {
                    setTouched((t) => ({ ...t, country: true }));
                    handleChange("country")(e);
                  }}
                  onChange={(e) =>
                    updateField("location", {
                      ...form.location,
                      country: e.target.value,
                    })
                  }
                />
                <div className="flex justify-between text-xs text-gray-500 mt-0.5">
                  <span>{remainingChars("country")} left</span>
                </div>
                {(touched.country || showAllErrors) && errors.country && (
                  <div className="text-xs text-red-500 mt-0.5">{errors.country}</div>
                )}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-purple-700 mb-1">Type</p>
              <div className="flex flex-wrap gap-2">
                {["House", "Apartment", "Hotel", "Other"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => updateField("type", t)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full border text-sm transition ${
                      form.type === t
                        ? "bg-purple-300 text-white border-transparent"
                        : "bg-white text-purple-700 border-purple-200"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {t === "House"
                        ? "home"
                        : t === "Apartment"
                        ? "apartment"
                        : t === "Hotel"
                        ? "hotel"
                        : "home_work"}
                    </span>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="max-w-3xl mx-auto">
            {form.images.map((url, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-2 mt-1">
                <input
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300 text-sm"
                  placeholder="Image URL"
                  type="url"
                  value={url}
                  onBlur={(e) => setImage(i, e.target.value)}
                  onChange={(e) => setImage(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="material-symbols-outlined text-purple-700 text-xl"
                >
                  delete
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              disabled={!form.images.every((url) => url.trim() !== "")}
              className={`w-full mt-2 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
                form.images.every((url) => url.trim() !== "")
                  ? "bg-purple-200 hover:bg-purple-300 text-purple-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <span className="material-symbols-outlined text-base">add_a_photo</span>
              Add Photo
            </button>
            {form.images.length === 0 && (
              <div className="text-xs text-red-500 mt-1">
                At least one image is required
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="max-w-3xl mx-auto">
            {["Environments", "Audiences", "Facilities"].map((group, gi) => {
              const opts =
                gi === 0
                  ? ENV_OPTIONS
                  : gi === 1
                  ? AUD_OPTIONS
                  : FAC_OPTIONS;
              const field =
                gi === 0
                  ? "environments"
                  : gi === 1
                  ? "audiences"
                  : "facilities";
              return (
                <div key={group} className="mt-4">
                  <p className="text-sm font-medium text-purple-700 mb-2">
                    {group}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {opts.map((o) => {
                      const active = form[field].includes(o.key);
                      return (
                        <button
                          type="button"
                          key={o.key}
                          onClick={() => toggleField(field, o.key)}
                          className={`flex items-center gap-1 px-4 py-1 rounded-full border text-sm transition ${
                            active
                              ? "bg-purple-300 text-white border-transparent"
                              : "bg-white text-purple-700 border-purple-200"
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {o.icon}
                          </span>
                          <span>{o.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="mt-4">
              <p className="text-sm font-medium text-purple-700 mb-2">
                Bathrooms
              </p>
              <div className="flex gap-3">
                {[1, 2, 3].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => updateField("bathrooms", n)}
                    className={`px-4 py-1 rounded-full border text-sm ${
                      form.bathrooms === n
                        ? "bg-purple-300 text-white border-transparent"
                        : "bg-white text-purple-700 border-purple-200"
                    }`}
                  >
                    {n}
                    {n === 3 ? "+" : ""}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="max-w-3xl mx-auto">
            <p className="text-s font-medium text-purple-700 mt-2">
              Availability
            </p>
            <div className="rounded-lg mt-2">
              <DateRangePicker
                value={form.dateRange}
                onChange={({ startDate, endDate, rentalDays }) => {
                  updateField("dateRange", {
                    startDate,
                    endDate,
                    key: "selection",
                  });
                  updateField("rentalDays", rentalDays);
                }}
                bookingRanges={bookingRanges}
                disabledDates={disabledDates}
                minDate={new Date()}
              />
            </div>
            {!form.dateRange?.startDate || !form.dateRange?.endDate ? (
              <div className="text-xs text-red-500 mt-2">
                Please select available dates
              </div>
            ) : null}
          </div>
        );
      case 4:
        return (
          <div className="max-w-3xl mx-auto mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 ml-0.5">
                NOK{requiredStar}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-lg bg-white
                  ${errors.price && showAllErrors
                    ? "border-red-500"
                    : "border-gray-300"}
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition
                `}
                {...numberInputMode}
                placeholder="Price / night"
                value={form.price}
                onBlur={handleChange("price")}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  updateField("price", val);
                }}
              />
              {showAllErrors && errors.price && (
                <div className="text-xs text-red-500 mt-0.5">
                  {errors.price}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1 ml-0.5">
                Max guests{requiredStar}
              </label>
              <input
                className={`w-full px-4 py-2 border rounded-lg bg-white
                  ${errors.guests && showAllErrors
                    ? "border-red-500"
                    : "border-gray-300"}
                  focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition
                `}
                {...numberInputMode}
                placeholder="Max guests"
                value={form.guests}
                onBlur={handleChange("guests")}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  updateField("guests", val);
                }}
              />
              {showAllErrors && errors.guests && (
                <div className="text-xs text-red-500 mt-0.5">
                  {errors.guests}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // ========== RENDER STEPS FUNKSJON SLUTT ========== //

  return (
    <BottomSheet title="Edit Venue" onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-white z-10 flex w-full px-4 space-x-1 py-2 border-b border-purple-100 overflow-x-hidden">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded ${i <= step ? "bg-purple-500" : "bg-purple-100"}`}
            />
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-1">
          {renderStepFields()}
          {feedback.error && (
            <p className="text-red-500 text-sm">{feedback.error}</p>
          )}
          {feedback.success && (
            <p className="text-green-600 text-sm">{feedback.success}</p>
          )}
        </div>
        <div className="p-3 bg-white border-t border-purple-100 sticky bottom-0">
          <div className="flex gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="w-1/3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">
                  arrow_back
                </span>
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNextOrSubmit}
              className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white`}
            >
              <span className="text-base">
                {step === STEPS.length - 1 ? "Save changes" : "Next"}
              </span>
              <span className="material-symbols-outlined text-xl">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
