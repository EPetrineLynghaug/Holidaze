import React from "react";
import SVGStar from "./SVGStar";

export default function RatingStars({
  value = 0,
  showValue = true,
  starSize = 12, // px
  className = "",
}) {
  return (
    <div className={`flex items-center gap-0 ${className}`} style={{ height: starSize }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <SVGStar
          key={i}
          filled={i < Math.round(value)}
          className={`mx-0 ${i < Math.round(value) ? "text-purple-700" : "text-purple-700"}`}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-[10px] text-gray-400 font-normal" style={{ lineHeight: 1 }}>
          ({Number(value).toFixed(1)})
        </span>
      )}
    </div>
  );
}
