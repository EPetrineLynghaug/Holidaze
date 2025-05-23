
export default function CalendarIconButton({
  onClick,
  ariaLabel = "Open calendar",
  className = "",
  style = {},
  icon = (
    <span className="material-symbols-outlined text-2xl">calendar_month</span>
  ),
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`flex items-center justify-center bg-[#3E35A2] hover:bg-[#271e8d] text-white rounded-full w-11 h-11 shadow transition-all duration-200 translate-y-1 ${className}`}
      style={style}
      {...props}
    >
      {icon}
    </button>
  );
}
