import React from "react";

export default function SVGStar({
  fillPercentage = 0,    // 0 = tom, 0.5 = halv, 1 = full
  className = "",
  size = 15,
}) {
  const gradientId = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        transition: "color 0.1s",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercentage * 100}%`} stopColor="currentColor" />
          <stop offset={`${fillPercentage * 100}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <polygon
        points="10,2 12.472,7.232 18,7.892 13.91,11.84 15.042,17.23 10,14.2 4.958,17.23 6.09,11.84 2,7.892 7.528,7.232"
        fill={`url(#${gradientId})`}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
