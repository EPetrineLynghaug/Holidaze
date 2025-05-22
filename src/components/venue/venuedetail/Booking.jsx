
import React from "react";
import BottomSheet from "../../ui/popup/BottomSheet";
import BookingSuccessPopup from "../../ui/popup/BookingSuccessPopup";
import { BOOKING_STEPS, useBookingForm } from "../../../hooks/forms/useBookingForm"; 

export default function BookingBottomSheet({
  startDate,
  endDate,
  nights,
  priceString,
  onClose,
  onComplete,
  maxGuests, // <-- TA INN HER
}) {
  const {
    step,
    form,
    errors = {},
    submitting,
    feedback,
    updateField,
    next,
    back,
    submit,
  } = useBookingForm({ startDate, endDate }, onComplete);

  /* ---------- step-specific UI ---------- */
  const renderStep = () => {
    switch (step) {
      // 0 – confirm dates
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-[#3E35A2]">Do these dates look right?</p>
            <div className="border border-[#3E35A2]/10 rounded-lg p-4 space-y-1 text-sm bg-[#f4f5fa]">
              <p>
                From: <strong>{form.startDate.toLocaleDateString()}</strong>
              </p>
              <p>
                To:&nbsp;&nbsp;<strong>{form.endDate.toLocaleDateString()}</strong>
              </p>
              <p>
                Nights: <strong>{nights}</strong>
              </p>
              <p>
                Total: <strong>{priceString}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#3E35A2] underline text-sm self-start hover:opacity-80"
            >
              Edit dates
            </button>
          </div>
        );

      // 1 – guest info
      case 1:
        return (
          <div className="space-y-2">
            {[
              { key: "firstName", label: "First name" },
              { key: "lastName",  label: "Last name"  },
              { key: "phone",     label: "Phone", type: "tel" },
            ].map(f => (
              <div key={f.key} className="space-y-1">
                <input
                  type={f.type || "text"}
                  placeholder={f.label}
                  value={form[f.key]}
                  onChange={e => updateField(f.key, e.target.value)}
                  className={`
                    w-full px-4 py-2 border rounded-lg text-sm
                    focus:ring-2 focus:ring-[#3E35A2] bg-[#fcfcfe]
                    ${errors[f.key] ? "border-red-400" : "border-[#3E35A2]/20"}
                  `}
                />
                {errors[f.key] && (
                  <p className="text-red-500 text-xs">{errors[f.key]}</p>
                )}
              </div>
            ))}

            {/* guests */}
            <div className="space-y-1">
              <input
                type="number"
                min={1}
                max={maxGuests} // <--- SJEKK HER!
                placeholder="Guests"
                value={form.guests}
                onChange={e => updateField("guests", Number(e.target.value))}
                className={`
                  w-full px-4 py-2 border rounded-lg text-sm
                  focus:ring-2 focus:ring-[#3E35A2] bg-[#fcfcfe]
                  ${errors.guests ? "border-red-400" : "border-[#3E35A2]/20"}
                `}
              />
              {errors.guests && (
                <p className="text-red-500 text-xs">{errors.guests}</p>
              )}
              {maxGuests && (
                <p className="text-xs text-gray-400">
                  Max guests: {maxGuests}
                </p>
              )}
            </div>
          </div>
        );

      // 2 – payment
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#3E35A2]">
              Choose a payment method
            </p>
            {[
              { key: "card",   label: "Card"   },
              { key: "vipps",  label: "Vipps"  },
              { key: "paypal", label: "PayPal" },
            ].map(opt => (
              <label
                key={opt.key}
                className={`
                  flex items-center gap-3 border rounded-lg px-4 py-2 cursor-pointer
                  transition
                  ${form.paymentMethod === opt.key
                    ? "border-[#3E35A2] bg-[#f4f5fa]"
                    : "border-[#3E35A2]/20"}
                `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.key}
                  checked={form.paymentMethod === opt.key}
                  onChange={() => updateField("paymentMethod", opt.key)}
                />
                {opt.label}
              </label>
            ))}
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs">{errors.paymentMethod}</p>
            )}

            {/* demo card inputs */}
            {form.paymentMethod === "card" && (
              <div className="space-y-2">
                <input
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#3E35A2]"
                  placeholder="Card number"
                />
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#3E35A2]"
                    placeholder="MM/YY"
                  />
                  <input
                    className="flex-1 px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#3E35A2]"
                    placeholder="CVC"
                  />
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------- render sheet ---------- */
  return (
    <BottomSheet title="Complete booking" onClose={onClose}>
      <div className="flex flex-col h-full">
        {/* progress bar */}
        <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b border-[#3E35A2]/10 flex gap-1">
          {BOOKING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded transition-all duration-150
                ${i <= step ? "bg-[#3E35A2]" : "bg-[#E5E7EB]"}
              `}
            />
          ))}
        </div>

        {/* step content */}
        <div className="flex-1 overflow-auto p-4">{renderStep()}</div>

        {/* global error */}
        {feedback.error && (
          <p className="text-red-500 text-sm text-center px-4">
            {feedback.error}
          </p>
        )}

        {/* CTA */}
        <div className="p-3 bg-white border-t border-[#3E35A2]/10 sticky bottom-0 flex gap-2">
          {step > 0 && (
            <button
              onClick={back}
              className="flex-1 py-2 border border-[#3E35A2] text-[#3E35A2] rounded-lg font-semibold hover:bg-[#f4f5fa] transition"
            >
              Back
            </button>
          )}
          <button
            onClick={step === BOOKING_STEPS.length - 1 ? submit : next}
            disabled={submitting}
            className="flex-1 py-2 bg-[#3E35A2] hover:bg-[#5948bb] text-white rounded-lg font-semibold disabled:opacity-50 transition"
          >
            {submitting
              ? "Sending…"
              : step === BOOKING_STEPS.length - 1
              ? "Pay & book"
              : "Next"}
          </button>
        </div>
      </div>

      {/* success popup */}
      {feedback.success && (
        <BookingSuccessPopup
          message={
            "You'll find all your reservations\nunder “Bookings” on your profile."
          }
          onClose={onClose}
        />
      )}
    </BottomSheet>
  );
}
