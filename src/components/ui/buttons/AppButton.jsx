export default function AppButton({
  children,
  variant = "primary",
  className = "",
  disabled = false,
  ...props
}) {
  let base =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-purple-400";
  let styles = "";

  if (variant === "primary") {
    styles =
      "bg-purple-600 text-white hover:bg-purple-700 shadow-sm disabled:opacity-50 disabled:pointer-events-none";
  } else if (variant === "outline") {
    styles =
      "bg-white text-purple-700 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-800 shadow-sm disabled:opacity-50 disabled:pointer-events-none";
  } else if (variant === "ghost") {
    styles =
      "bg-transparent text-purple-700 hover:text-purple-800 disabled:opacity-50 disabled:pointer-events-none";
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`px-5 py-2 text-base ${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
