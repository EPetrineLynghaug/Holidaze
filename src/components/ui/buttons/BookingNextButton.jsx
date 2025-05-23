// src/ui/buttons/BookingNextButton.jsx
export default function BookingNextButton({
  onClick,
  isLastStep,
  submitting,
  disabled = false,
  ariaLabel,
  children,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={submitting || disabled}
      className={`
        flex-1 py-2 rounded-lg font-semibold
        bg-[#3E35A2] text-white text-base
        hover:bg-[#5948bb] disabled:opacity-50 transition
        focus:outline-none
        min-w-[120px]
        ${className}
      `}
      aria-label={ariaLabel ||
        (isLastStep
          ? "Pay & book"
          : submitting
          ? "Sending…"
          : "Next")}
    >
      {children
        ? children
        : submitting
        ? "Sending…"
        : isLastStep
        ? "Pay & book"
        : "Next"}
    </button>
  );
}
