import React, { useState } from "react";
import useStars from "../../hooks/useStars";

export default function RatingStars({
  initialRating = 0,
  size = "base",
  colorClass = "text-[#3E35A2]",
  onChange,
}) {
  const [rating, setRating] = useState(initialRating);
  const stars = useStars(rating);

  const handleClick = (newRating) => {
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

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
        const iconName = type === "half" ? "star_half" : "star";
        const colour = type === "empty" ? "text-gray-300" : colorClass;
        const fill = type === "empty" ? 0 : 1;

        return (
          <span
            key={i}
            onClick={() => handleClick(i + 1)}
            className={`material-symbols-outlined ${sizeCls} ${colour} cursor-pointer transition-transform hover:scale-110`}
            style={{ fontVariationSettings: `'FILL' ${fill}` }}
          >
            {iconName}
          </span>
        );
      })}

      {/* Viser rating (4.6) */}
      <span className={`ml-1 ${sizeCls} text-gray-500`}>
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}
