

export default function BookingBarButton({ onClick, disabled, submitting, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        bg-[#3E35A2]
        text-white
        font-medium
        text-sm
        px-4
        py-2
        rounded-md
        hover:bg-[#5939aa]
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        md:px-5 md:py-2.5
      "
      aria-label={submitting ? "Booking…" : "Book now"}
    >
      {children}
    </button>
  );
}