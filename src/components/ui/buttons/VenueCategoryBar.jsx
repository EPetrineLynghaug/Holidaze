import { useState } from "react";

const categories = [
  { key: "all", label: "All", icon: "grid_view" },
  { key: "beach", label: "Beach", icon: "beach_access" },
  { key: "cabin", label: "Cabin", icon: "cottage" },
  { key: "ski", label: "Ski", icon: "downhill_skiing" },
  { key: "city", label: "City", icon: "location_city" },
  { key: "mountain", label: "Mountain", icon: "terrain" },
  { key: "lake", label: "Lake", icon: "water" },
  { key: "desert", label: "Desert", icon: "wb_sunny" },
  { key: "forest", label: "Forest", icon: "park" },
  { key: "island", label: "Island", icon: "waves" },
  { key: "countryside", label: "Countryside", icon: "grass" },
  { key: "farm", label: "Farm", icon: "agriculture" },
  { key: "luxury", label: "Luxury", icon: "villa" },
  { key: "historical", label: "Historical", icon: "castle" },
  { key: "pets", label: "Pets Allowed", icon: "pets" },
  { key: "wifi", label: "Wi-Fi", icon: "wifi" },
  { key: "parking", label: "Parking", icon: "local_parking" },
  { key: "family", label: "Family Friendly", icon: "family_restroom" },
  { key: "all_inclusive", label: "All Inclusive", icon: "room_service" },
];

export default function VenueCategoryBar({ activeCategory, onCategoryChange }) {
  const itemsPerPage = 7;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const extendedCategories = [...categories, ...categories, ...categories];
  const startPageIndex = totalPages;

  const [currentPage, setCurrentPage] = useState(startPageIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Carousel-beregning
  const containerWidth = 95 * itemsPerPage + 24 * (itemsPerPage - 1);
  const translateX = -currentPage * containerWidth;

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentPage >= totalPages * 2) {
      setCurrentPage(currentPage - totalPages);
    } else if (currentPage < totalPages) {
      setCurrentPage(currentPage + totalPages);
    }
  };

  const scrollPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage(prev => prev - 1);
  };

  const scrollNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentPage(prev => prev + 1);
  };

  return (
    <div className="w-full max-w-full px-2 sm:px-4 md:px-9 xl:px-8  min-w-0 mt-10 mb-10">
      <nav
        className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
        style={{ padding: "0.25rem 1rem", height: "3.5rem", overflow: "hidden" }}
        aria-label="Venue categories"
      >
        {/* Venstre pil */}
        <button
          onClick={scrollPrev}
          aria-label="Previous categories"
          className="flex items-center justify-center w-9 h-9 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          style={{ boxShadow: "0 2px 8px rgba(92,80,255,0.15)" }}
          type="button"
        >
          <span className="material-symbols-outlined text-3xl select-none">chevron_left</span>
        </button>

        {/* Kategorier */}
        <div className="flex flex-1" style={{ height: "3rem", position: "relative", overflow: "hidden" }}>
          <div
            className={`flex space-x-6 ${isTransitioning ? "transition-transform duration-300 ease-in-out" : ""}`}
            style={{
              transform: `translateX(${translateX}px)`,
              width: containerWidth * totalPages * 3
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedCategories.map(({ key, label, icon }, i) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={`${key}-${i}`}
                  onClick={() => onCategoryChange(key)}
                  className={`
                    flex items-center gap-2 cursor-pointer select-none whitespace-nowrap transition-colors duration-300 min-w-[95px] px-2 py-1
                    bg-transparent border-none shadow-none outline-none
                    ${isActive
                      ? "text-purple-600 font-semibold"
                      : "text-gray-600 hover:text-purple-600"}
                  `}
                  aria-pressed={isActive}
                  aria-label={label}
                  title={label}
                  type="button"
                  style={{ fontSize: "0.85rem" }}
                >
                  <span className={`material-symbols-outlined text-xl leading-none ${isActive ? "text-purple-600" : "text-gray-500"}`}>
                    {icon}
                  </span>
                  <span className="tracking-wide truncate max-w-full">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Høyre pil */}
        <button
          onClick={scrollNext}
          aria-label="Next categories"
          className="flex items-center justify-center w-9 h-9 rounded-full text-purple-600 hover:text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
          style={{ boxShadow: "0 2px 8px rgba(92,80,255,0.15)" }}
          type="button"
        >
          <span className="material-symbols-outlined text-3xl select-none">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
