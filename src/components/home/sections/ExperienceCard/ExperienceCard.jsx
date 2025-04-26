import React from 'react';

export default function ExperienceCard({ src, title, price, unit }) {
  return (
    <article className="relative overflow-hidden rounded-xl shadow-md">
      {/* Bilde */}
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full h-48 sm:aspect-square sm:h-auto object-cover"
      />

      {/* Tekst-overlay plassert helt nederst med minimal padding og nær sammenheng */}
      <div className="absolute bottom-0 left-0 w-full bg-black/3   px-3 py-1 flex flex-col ">
        <h3 className="text-white text-lg font-bold leading-tight truncate">
          {title}
        </h3>
        <p className="text-white text-sm font-medium">
          From {price}$ / {unit}
        </p>
      </div>
    </article>
  );
}
