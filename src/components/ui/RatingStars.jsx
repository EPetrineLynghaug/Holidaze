import React from "react";
import useStars from "../../hooks/useStars";


export default function RatingStars({
  rating = 0,
  reviewCount,
  size = "base",
  colorClass = "text-[#3E35A2]", 
}) {
  const stars = useStars(rating);

  const sizeCls =
    size === "xs"
      ? "text-xs"
      : size === "sm"
      ? "text-sm"
      : size === "lg"
      ? "text-lg"
      : "text-base";

  return (
    <div className="flex items-center">
      {stars.map((type, i) => {
        const iconName =
          type === "half" ? "star_half" : "star"; 

       
        const colour = type === "empty" ? "text-gray-300" : colorClass;
        const fill = type === "empty" ? 0 : 1;

        return (
          <span
            key={i}
            className={`material-symbols-outlined ${sizeCls} ${colour}`}
            style={{ fontVariationSettings: `'FILL' ${fill}` }}
          >
            {iconName}
          </span>
        );
      })}

      {/* (4.6) */}
      <span className={`ml-1 ${sizeCls} text-gray-500`}>
        ({rating.toFixed(1)})
      </span>

      {/* · 37 */}
      {typeof reviewCount === "number" && (
        <span className={`ml-1 ${sizeCls} text-gray-400`}>· {reviewCount}</span>
      )}
    </div>
  );
}
