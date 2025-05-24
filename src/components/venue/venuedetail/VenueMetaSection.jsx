
const META_OPTIONS = [
  { key: "wifi", icon: "wifi", label: "Wi-Fi" },
  { key: "parking", icon: "local_parking", label: "Parking" },
  { key: "breakfast", icon: "free_breakfast", label: "Breakfast included" },
  { key: "pets", icon: "pets", label: "Pets allowed" },
];

export default function VenueMetaSection({ meta }) {
  if (!meta) return null;

  const filtered = META_OPTIONS.filter(opt => meta[opt.key]);
  if (!filtered.length) return null;

  return (
    <section className="mt-0 mb-6 px-4 max-w-3xl">
      <h2 className="font-semibold text-2xl mb-4 text-left text-gray-900 tracking-wide">
        Amenities
      </h2>
      <ul
        className="
          flex flex-col gap-5
          sm:flex-row sm:flex-wrap sm:gap-6
        "
      >
        {filtered.map(opt => (
          <li key={opt.key} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-gray-600">
              {opt.icon}
            </span>
            <span className="text-sm lg:text-base font-normal text-gray-700 whitespace-pre-line text-left max-w-4xl">
              {opt.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
