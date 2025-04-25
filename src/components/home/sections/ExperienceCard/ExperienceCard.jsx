// src/components/home/sections/FeaturedExperiences/ExperienceCard.jsx
import React from 'react';

export default function ExperienceCard({ src, title, price, unit }) {
  return (
    <article className="relative overflow-hidden rounded-xl shadow-md">
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full aspect-square object-cover"
      />
      <div className="absolute bottom-4 left-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
        <p className="text-white text-base font-semibold whitespace-nowrap mt-1">
          From {price}$ / {unit}
        </p>
      </div>
    </article>
  );
}
