
export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onChange(!checked);
      }}
      className={`relative inline-flex h-8 w-16 rounded-full transition-colors duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
        ${checked ? "bg-purple-600" : "bg-gray-300"}
      `}
      style={{ minWidth: 64 }}
    >
      <span className="sr-only">{label}</span>
      <span
        className="absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-200"
        style={{ transform: checked ? "translateX(32px)" : "translateX(0)" }}
        aria-hidden="true"
      />
    </button>
  );
}
