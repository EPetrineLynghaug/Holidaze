// MobileCloseButton.jsx
export default function MobileCloseButton({
  onClick,
  ariaLabel = "Lukk",
  className = "",
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`
        flex items-center justify-center
        bg-white border border-gray-300 rounded-full shadow-md
        transition-transform hover:rotate-90 hover:scale-105
        w-9 h-9
        md:w-11 md:h-11
        ${className}
      `}
      type="button"
      tabIndex={0}
      style={{
        padding: "0.15rem",
      }}
    >
      <span className="material-symbols-outlined text-xl md:text-2xl text-gray-800 leading-none">
        close
      </span>
    </button>
  );
}
