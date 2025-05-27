
export default function EditVenueButton({ onClick, disabled, loading, className = '', ...props }) {
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      disabled={loading || disabled}
      className={`
        flex items-center justify-center w-9 h-9 rounded-full
        bg-gray-100 hover:bg-purple-100 text-purple-700 shadow
        transition focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title="Edit"
      aria-label="Edit"
      {...props}
    >
      <span className="material-symbols-outlined text-xl" aria-hidden="true">
        {loading ? 'hourglass_empty' : 'edit'}
      </span>
    </button>
  );
}
