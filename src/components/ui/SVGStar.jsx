// ui/SVGStar.jsx
export default function SVGStar({ filled = false, className = "", size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "1.3"}
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        transition: "color 0.1s"
      }}
      aria-hidden="true"
    >
      <polygon
        points="10,2 12.472,7.232 18,7.892 13.91,11.84 15.042,17.23 10,14.2 4.958,17.23 6.09,11.84 2,7.892 7.528,7.232"
        strokeLinejoin="round"
      />
    </svg>
  );
}
