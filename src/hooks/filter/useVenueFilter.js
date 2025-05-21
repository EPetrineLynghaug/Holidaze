import { useMemo } from "react";

export function useVenueFilter(venues, activeCategory) {
  return useMemo(() => {
    if (activeCategory === "all") {
      return venues;
    }
    if (["wifi", "pets", "parking"].includes(activeCategory)) {
      return venues.filter((v) => v.meta?.[activeCategory]);
    }
    return venues.filter((v) => v.category === activeCategory);
  }, [venues, activeCategory]);
}
