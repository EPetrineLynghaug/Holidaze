const destinations = [
  { id: 1, name: 'Norway', img: '/images/norway.JPG' },
  { id: 2, name: 'Italy', img: '/images/italia.JPG' },
  { id: 3, name: 'Japan', img: '/images/japan.JPG' },
  { id: 4, name: 'Brazil', img: '/images/brasil.JPG' },
  { id: 5, name: 'Canada', img: '/images/canada.JPG' },
  { id: 6, name: 'Australia', img: '/images/australia.JPG' },
];

const PLACEHOLDER_IMG = "/images/australia.JPG";

export default function CountriesSection() {
  const handleImgError = (e) => {
    e.currentTarget.onerror = null; // unngå infinite loop
    e.currentTarget.src = PLACEHOLDER_IMG;
  };

  return (
    <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">
      <h3 className="font-figtree font-semibold text-xl sm:text-2xl md:text-3xl text-center md:text-left mb-6 md:mb-8">
        Featured Destinations
      </h3>
      <div className="grid gap-6 grid-cols-3 sm:grid-cols-6 place-items-center">
        {destinations.map(dest => (
          <div key={dest.id} className="flex flex-col items-center">
            <img
              src={dest.img}
              alt={dest.name}
              loading="lazy"
              decoding="async"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm"
              onError={handleImgError}
              width={80}
              height={80}
            />
            <span className="mt-2 text-sm text-gray-700">{dest.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
