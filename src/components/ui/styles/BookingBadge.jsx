export default function BookingBadge({ count = 0, className = "", ariaLabel }) {
  const bookingText = `${count} booking${count !== 1 ? "s" : ""}`;
  return (
    <span
      className={
        `bg-white/90 text-gray-800 font-semibold px-3 py-1 rounded-full text-xs shadow backdrop-blur-sm border border-gray-200 ` +
        className
      }
      aria-label={ariaLabel || bookingText}
      role="status"
    >
      {bookingText}
    </span>
  );
}