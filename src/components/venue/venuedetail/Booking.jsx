import BottomSheet from "../../ui/popup/BottomSheet";
import BookingSuccessPopup from "../../ui/popup/BookingSuccessPopup";
import { BOOKING_STEPS, useBookingForm } from "../../../hooks/forms/useBookingForm";

export default function BookingBottomSheet({
  startDate,
  endDate,
  nights,
  priceString,
  onClose,
  onEditDates,
  onComplete,
  maxGuests,
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
    clearFieldError,
  } = useBookingForm(
    { startDate, endDate, guestsDefault: maxGuests, maxGuests },
    onComplete
  );

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <p className="text-lg font-semibold text-[#3E35A2]">
              Do these dates look right?
            </p>
            <div className="border border-[#3E35A2]/10 rounded-lg p-4 space-y-1 text-base bg-[#f4f5fa]">
              <p>
                From: <strong>{form.startDate.toLocaleDateString()}</strong>
              </p>
              <p>
                To: <strong>{form.endDate.toLocaleDateString()}</strong>
              </p>
              <p>
                Nights: <strong>{nights}</strong>
              </p>
              <p>
                Total: <strong>{priceString}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={onEditDates ? onEditDates : back}
              className="text-[#3E35A2] underline text-base self-start hover:opacity-80"
              aria-label="Edit booking dates"
            >
              Edit dates
            </button>
          </div>
        );
      case 1:
        return (
          <form className="space-y-4" autoComplete="on" aria-label="Guest information form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="firstName" className="font-medium text-[#3E35A2] text-base">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={e => {
                    updateField("firstName", e.target.value);
                    clearFieldError("firstName");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-xl text-base
                    focus:ring-2 focus:ring-[#3E35A2] bg-[#fcfcfe]
                    ${errors.firstName ? "border-red-400" : "border-[#3E35A2]/20"}
                  `}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  required
                />
                {errors.firstName && (
                  <p id="firstName-error" className="text-red-500 text-xs">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="lastName" className="font-medium text-[#3E35A2] text-base">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={e => {
                    updateField("lastName", e.target.value);
                    clearFieldError("lastName");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-xl text-base
                    focus:ring-2 focus:ring-[#3E35A2] bg-[#fcfcfe]
                    ${errors.lastName ? "border-red-400" : "border-[#3E35A2]/20"}
                  `}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  required
                />
                {errors.lastName && (
                  <p id="lastName-error" className="text-red-500 text-xs">
                    {errors.lastName}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label htmlFor="phone" className="font-medium text-[#3E35A2] text-base">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={e => {
                    updateField("phone", e.target.value);
                    clearFieldError("phone");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-xl text-base
                    focus:ring-2 focus:ring-[#3E35A2] bg-[#fcfcfe]
                    ${errors.phone ? "border-red-400" : "border-[#3E35A2]/20"}
                  `}
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  required
                />
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-xs">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2 md:col-span-2">
                <label htmlFor="guests" className="font-medium text-[#3E35A2] text-base">
                  Guests
                </label>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min={1}
                  max={maxGuests}
                  step={1}
                  placeholder="Guests"
                  value={form.guests}
                  onChange={e => {
                    const val = e.target.value === "" ? "" : parseInt(e.target.value, 10);
                    updateField("guests", val);
                    clearFieldError("guests");
                  }}
                  className={`
                    w-full px-4 py-3 border rounded-xl text-base
                    focus:ring-2 focus:ring-[#3E35A2] bg-[#fcfcfe]
                    ${errors.guests ? "border-red-400" : "border-[#3E35A2]/20"}
                  `}
                  aria-invalid={!!errors.guests}
                  aria-describedby={errors.guests ? "guests-error" : undefined}
                  required
                />
                {errors.guests && (
                  <p id="guests-error" className="text-red-500 text-xs">
                    {errors.guests}
                  </p>
                )}
                <p className="text-xs text-gray-400">Max guests: {maxGuests}</p>
              </div>
            </div>
          </form>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm font-medium text-[#3E35A2]">Choose a payment method</p>
            {["vipps", "paypal"].map(opt => (
              <label
                key={opt}
                className={`
                  flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer
                  transition text-base
                  ${form.paymentMethod === opt
                    ? "border-[#3E35A2] bg-[#f4f5fa]"
                    : "border-[#3E35A2]/20"}
                `}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt}
                  checked={form.paymentMethod === opt}
                  onChange={() => {
                    updateField("paymentMethod", opt);
                    clearFieldError("paymentMethod");
                  }}
                  className="h-4 w-4"
                  aria-checked={form.paymentMethod === opt}
                  aria-label={opt.charAt(0).toUpperCase() + opt.slice(1)}
                  required
                />
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </label>
            ))}
            {errors.paymentMethod && (
              <p className="text-red-500 text-xs">{errors.paymentMethod}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const wrappedSubmit = () => {
    submit();
  };

  return (
    <BottomSheet title="Complete booking" onClose={onClose}>
      <div className="flex flex-col h-full">
        <div className="sticky top-0 z-10 bg-white px-4 py-2 border-b border-[#3E35A2]/10 flex gap-1">
          {BOOKING_STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded transition-all duration-150 ${
                i <= step ? "bg-[#3E35A2]" : "bg-[#E5E7EB]"
              }`}
              aria-current={i === step ? "step" : undefined}
            />
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4 pb-24">{renderStep()}</div>
        {feedback.error && (
          <p className="text-red-500 text-sm text-center px-4">{feedback.error}</p>
        )}
        <div className="p-3 bg-white border-t border-[#3E35A2]/10 sticky bottom-0 flex gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex-1 py-2 border border-[#3E35A2] text-[#3E35A2] rounded-lg font-semibold hover:bg-[#f4f5fa] transition"
              aria-label="Back"
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={step === BOOKING_STEPS.length - 1 ? wrappedSubmit : next}
            disabled={submitting}
            className="flex-1 py-2 bg-[#3E35A2] hover:bg-[#5948bb] text-white rounded-lg font-semibold disabled:opacity-50 transition"
            aria-label={
              step === BOOKING_STEPS.length - 1
                ? "Pay & book"
                : submitting
                ? "Sending…"
                : "Next"
            }
          >
            {submitting ? "Sending…" : step === BOOKING_STEPS.length - 1 ? "Pay & book" : "Next"}
          </button>
        </div>
      </div>
      {feedback.success && (
        <BookingSuccessPopup
          message={"You'll find all your reservations\nunder “Bookings” on your profile."}
          onClose={onClose}
        />
      )}
    </BottomSheet>
  );
}
