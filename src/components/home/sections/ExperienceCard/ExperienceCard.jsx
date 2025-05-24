export default function ExperienceCard({ src, title, price, unit }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-gray-100 shadow hover:shadow-md bg-white">
      <img
        src={src}
        alt={title}
        loading="lazy"
        className="w-full h-[260px] object-cover" 
      />

      <div className="absolute bottom-0 left-0 w-full px-4 py-2 text-white bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        <p className="text-sm font-medium">From {price}$ / {unit}</p>
      </div>
    </article>
  );
}
