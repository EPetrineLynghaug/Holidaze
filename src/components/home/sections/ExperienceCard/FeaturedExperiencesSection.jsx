import React from 'react';
import ExperienceCard from './ExperienceCard';

const experiences = [
  { id: 1, src: '/images/lake.png',   title: 'Lakeside',   price: 160, unit: 'night' },
  { id: 2, src: '/images/city.png',   title: 'City Break', price: 90,  unit: 'night' },
  { id: 3, src: '/images/cabins.png', title: 'Cabins',     price: 130, unit: 'night' },
];

export default function FeaturedExperiencesSection() {
  return (
    <section className="px-4 py-6 bg-[var(--color-BGcolor)]">
      <h2 className="font-figtree font-semibold text-2xl text-center mb-6">
        Explore Experience
      </h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {experiences.map((exp) => (
          <div key={exp.id} className="w-full max-w-[240px] sm:max-w-none">
            <ExperienceCard {...exp} />
          </div>
        ))}
      </div>
    </section>
  );
}
