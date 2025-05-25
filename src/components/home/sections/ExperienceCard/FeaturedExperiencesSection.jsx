

import ExperienceCard from './ExperienceCard';

const experiences = [
  { id: 1, src: '/images/lake.webp',   title: 'Lakeside',   price: 160, unit: 'night' },
  { id: 2, src: '/images/city.webp',   title: 'City Break', price:  90, unit: 'night' },
  { id: 3, src: '/images/cabins.webp', title: 'Cabins',     price: 130, unit: 'night' },
];

export default function FeaturedExperiencesSection() {
  return (
    <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">
      <h1 className="font-figtree font-semibold text-xl sm:text-2xl md:text-3xl text-center md:text-left mb-6 md:mb-8">
        Explore Experience
      </h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 place-items-center md:place-items-start">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="w-full max-w-[280px] md:max-w-[300px] lg:max-w-[340px] transition hover:-translate-y-0.5"
          >
            <ExperienceCard {...exp} />
          </div>
        ))}
      </div>
    </section>
  );
}