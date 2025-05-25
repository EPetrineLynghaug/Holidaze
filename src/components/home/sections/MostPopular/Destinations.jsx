
const destinations = [
  { id: 1, name: "australia" },
  { id: 2, name: "brasil" },
  { id: 3, name: "canada" },
  { id: 4, name: "italia" },
  { id: 5, name: "japan" },
  { id: 6, name: "norway" },
];

const PLACEHOLDER = "/images/australia.webp";

export default function CountriesSection() {
  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
   
    const jpg = `/images/${e.currentTarget.dataset.name.toLowerCase()}.JPG`;
    if (e.currentTarget.src.endsWith(".webp")) {
      e.currentTarget.src = jpg;
    } else {
      
      e.currentTarget.src = PLACEHOLDER;
    }
  };

  return (
    <section className="px-4 py-6 sm:px-6 md:px-8 lg:px-12">
      <h3 className="font-figtree font-semibold text-xl sm:text-2xl md:text-3xl text-center md:text-left mb-6 md:mb-8">
        Featured Destinations
      </h3>
      <div className="grid gap-6 grid-cols-3 sm:grid-cols-6 place-items-center">
        {destinations.map((dest) => {
          const webpSrc = `/images/${dest.name}.webp`;
          return (
            <div key={dest.id} className="flex flex-col items-center">
              <img
                data-name={dest.name}
                src={webpSrc}
                alt={dest.name}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm"
                width={80}
                height={80}
                onError={handleImgError}
              />
              <span className="mt-2 text-sm text-gray-700">
                {dest.name.charAt(0).toUpperCase() + dest.name.slice(1)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
