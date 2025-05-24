import React, { useState } from "react";
import SVGStar from "./SVGStar";

export default function RatingStars({
  value = 0,
  showValue = true,
  starSize = 12,
  className = "",
  interactive = false,
  onRate = null,
}) {
  const [hoverValue, setHoverValue] = useState(null);
  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div
      className={`flex items-center gap-0 ${className}`}
      style={{
        height: starSize,
        cursor: interactive ? "pointer" : undefined,
      }}
      onMouseLeave={() => interactive && setHoverValue(null)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        // beregn fyllprosent for hver stjerne
        const pct = Math.max(0, Math.min(1, displayValue - i));

        return (
          <span
            key={i}
            onMouseEnter={() => interactive && setHoverValue(i + 1)}
            onClick={() => interactive && onRate && onRate(i + 1)}
            style={{
              transition: "transform 0.18s",
              transform:
                interactive && hoverValue !== null && i < hoverValue
                  ? "scale(1.2)"
                  : "scale(1)",
              display: "inline-block",
            }}
          >
            <SVGStar
              fillPercentage={pct}
              size={starSize}
              className="text-purple-700"
            />
          </span>
        );
      })}

      {showValue && (
        <span
          className="ml-1"
          style={{
            fontSize: `${Math.round(starSize * 0.55)}px`,
            color: "#a3a3a3",
            fontWeight: "normal",
            lineHeight: 1,
            minWidth: "36px",
            display: "inline-block",
          }}
        >
          ({displayValue.toFixed(1)})
        </span>
      )}
    </div>
  );
}
