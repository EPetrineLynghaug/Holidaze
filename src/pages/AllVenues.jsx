import { useState } from "react";
import AllVenueCard from "../components/venue/allvenues/AllVenueCard";
import ScrollToTopButton from "../components/ui/buttons/ScrollToTopButton";
import VenueCategoryBar from "../components/ui/buttons/VenueCategoryBar";
import { useVenueFilter } from "../hooks/filter/useVenueFilter";
import LoadMoreButton from "../components/ui/buttons/LoadMoreVenuesButton";
import RefreshButton from "../components/ui/buttons/RefreshVenuesButton";
import { useAllVenues } from "../hooks/api/useAllVenues";

export default function AllVenues() {
  const [activeCategory, setActiveCategory] = useState("all");
  const {
    venues,
    setVenues,
    page,
    setPage,
    loading,
    error,
    fetchVenues,
  } = useAllVenues(100);

  const filteredVenues = useVenueFilter(venues, activeCategory);

  const handleRefresh = () => {
    fetchVenues({ pageNum: 1, replace: true });
    setPage(1);
  };
  const handleLoadMore = () => setPage(p => p + 1);

  if (loading && page === 1) return <p>Loading venues...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="
        max-w-full
        px-2 sm:px-6 md:px-18 xl:px-20
        py-8 pb-28
        bg-gradient-to-br from-gray-50 via-white to-purple-50 min-h-screen
      ">
        <h1 className="
          text-3xl md:text-4xl font-regular mt-6 mb-10
          text-center sm:text-left text-gray-900
          xl:pl-8 2xl:pl-16
        ">
          All Venues
        </h1>

        <VenueCategoryBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-x-10 gap-y-14
          place-items-center
          max-w-full mx-auto
        ">
          {filteredVenues.map(v => (
            <AllVenueCard key={v.id} venue={v} />
          ))}
        </div>

        <div className="mt-12 flex justify-center gap-3 sm:gap-6">
          <RefreshButton
            onClick={handleRefresh}
            loading={loading && page === 1}
            disabled={loading && page === 1}
          />
          <LoadMoreButton
            onClick={handleLoadMore}
            loading={loading && page > 1}
            disabled={loading}
          />
        </div>

        {loading && page > 1 && (
          <p className="mt-4 text-center text-gray-500">Loading more…</p>
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
}
