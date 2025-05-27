import React from "react";
import useAuthUser from "../../../hooks/auth/useAuthUser";

export default function FavoriteButton({
  active = false,
  onClick,
  size = 20,
  className = "",
  color = "var(--color-venue-favorite, #7c3aed)",
  requireAuth = false,
  onRequireLogin,
}) {
  const user = useAuthUser();
  // Hvis ingen er logget inn, kan knappen ikke være aktiv
  const isActive = user ? active : false;
  const outline = isActive ? color : "#52525b";

  const handleClick = (e) => {
    // Hindrer at klikket bobler opp til kortets click-handler
    e.stopPropagation();

    if (requireAuth && !user) {
      onRequireLogin?.();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-label={isActive ? "Remove from favorites" : "Add to favorites"}
      onClick={handleClick}
      disabled={requireAuth && !user}
      aria-disabled={requireAuth && !user}
      className={`
        group relative flex items-center justify-center rounded-full
        bg-white/70 shadow-sm
        transition-all duration-200
        ${requireAuth && !user ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        padding: 0,
        border: "1px solid #e5e7eb",
      }}
    >
      <svg
        width={size * 0.75}
        height={size * 0.75}
        viewBox="0 0 24 22"
        className="block"
      >
        {/* Outline-hjerte */}
        <path
          d="M12 21s-1.45-1.3-3.17-2.93C5.4 15.1 2 12.07 2 8.5
             2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09
             C13.09 4.01 14.76 3 16.5 3
             19.58 3 22 5.42 22 8.5
             c0 3.57-3.4 6.6-6.83 9.57
             C13.45 19.7 12 21 12 21z"
          fill="none"
          stroke={outline}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: isActive
              ? "drop-shadow(0 1px 8px rgba(62,53,162,0.08))"
              : "none",
            transition: "stroke 0.4s cubic-bezier(.4,2,.6,1)",
          }}
        />
        <g>
          <clipPath id="heart-clip">
            <path d="M12 21s-1.45-1.3-3.17-2.93C5.4 15.1 2 12.07 2 8.5
                      2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09
                      C13.09 4.01 14.76 3 16.5 3
                      19.58 3 22 5.42 22 8.5
                      c0 3.57-3.4 6.6-6.83 9.57
                      C13.45 19.7 12 21 12 21z" />
          </clipPath>
          <rect
            x="0"
            y="0"
            width="22"
            height={isActive ? 22 : 0}
            fill={color}
            clipPath="url(#heart-clip)"
            style={{
              transition: isActive
                ? "height 1s cubic-bezier(.5,1.5,.35,1)"
                : "height 0.8s cubic-bezier(.32,.84,.47,1)",
              height: isActive ? 22 : 0,
            }}
          />
        </g>
      </svg>
      <span className="sr-only">
        {isActive ? "Remove from favorites" : "Add to favorites"}
      </span>
    </button>
  );
}