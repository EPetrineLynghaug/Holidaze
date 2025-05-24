export default function BookingBackButton({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        color: "var(--color-btn-dark)",
        borderColor: "var(--color-btn-dark)",
        backgroundColor: "transparent",
      }}
      className={`
        flex-1 py-2 rounded-lg font-semibold 
        border hover:bg-[var(--color-btn-light)]
        transition
        focus:outline-none
      `}
      aria-label="Back"
      disabled={disabled}
    >
      Back
    </button>
  );
}
