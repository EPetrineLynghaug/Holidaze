import React from 'react';

export default function ExperienceCard({ src, title, price, unit }) {
  return (
    <article className="relative overflow-hidden rounded-xl shadow-md">
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full h-48 sm:aspect-square sm:h-auto object-cover rounded-xl "
      />

      {/* Legg tekst som en flex‐footer inne i bildet */}
      <div className="absolute inset-0 flex items-end p-4">
        <div>
          <h3 className="text-white text-lg font-bold">{title}</h3>
          <p className="text-white text-base font-semibold whitespace-nowrap mt-1">
            From {price}$ / {unit}
          </p>
        </div>
      </div>
    </article>
  );
}
