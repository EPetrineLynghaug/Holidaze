
export default function EditDatesButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        color: "var(--color-btn-dark)"
      }}
      className="underline text-base self-start hover:opacity-80 transition"
      aria-label="Edit booking dates"
    >
      Edit dates
    </button>
  );
}
