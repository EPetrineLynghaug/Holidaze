import { Link } from "react-router-dom";
import ExperienceCard from "./ExperienceCard";

const experiences = [
  { id: 1, src: "/images/lake.webp",   title: "Lakeside",   price: 160, unit: "night" },
  { id: 2, src: "/images/city.webp",   title: "City Break", price:  90, unit: "night" },
  { id: 3, src: "/images/cabins.webp", title: "Cabins",     price: 130, unit: "night" },
];

export default function FeaturedExperiencesSection() {
  return (
    <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-12 lg:mt-30 md:mt-20 sm-mt-3">
      <h1 className="font-figtree font-semibold  sm:text-3xl md:text-3xl text-center md:text-left sm:mb-0 mb-6 md:mb-8">
        Explore Experience
      </h1>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 place-items-center md:place-items-start">
        {experiences.map((exp) => (
          <Link
            key={exp.id}
            to="/venues"
            className="w-full max-w-[280px] md:max-w-[300px] lg:max-w-[340px] transition hover:-translate-y-0.5"
          >
            <ExperienceCard {...exp} />
          </Link>
        ))}
      </div>
    </section>
  );
}
