
import { useState, useEffect, useRef } from "react";
import { VENUES_URL } from "../components/constants/api";
import AllVenueCard from "../components/venue/allvenues/AllVenueCard";
import ScrollToTopButton from "../components/ui/buttons/ScrollToTopButton";
import VenueCategoryBar from "../components/ui/buttons/VenueCategoryBar";
import { useVenueFilter } from "../hooks/filter/useVenueFilter";

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const limit = 100;
  const isFirst = useRef(true);

  const fetchVenues = async ({ pageNum = 1, replace = false }) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `${VENUES_URL}?limit=${limit}&page=${pageNum}&sort=created&sortOrder=desc`
      );
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const { data } = await resp.json();
      const categoryKeys = [
        'beach','cabin','ski','city','mountain','lake','desert',
        'forest','island','countryside','farm','luxury','historical',
        'pets','wifi','parking','family','all_inclusive'
      ];
      const enhanced = data.map(item => {
        const categoryKeys = [
          'beach','cabin','ski','city','mountain','lake','desert',
          'forest','island','countryside','farm','luxury','historical',
          'pets','wifi','parking','family','all_inclusive'
        ];
        // Velg tilfeldig kategori
        const randomCat = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        // Randomiser meta flags for wifi, pets og parking
        const randomMeta = {
          wifi: Math.random() < 0.5,
          pets: Math.random() < 0.5,
          parking: Math.random() < 0.5,
          ...item.meta
        };
        return {
          ...item,
          category: randomCat,
          meta: randomMeta
        };
      });
      setVenues(prev => (replace ? enhanced : [...prev, ...enhanced]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirst.current) {
      fetchVenues({ pageNum: 1, replace: true });
      isFirst.current = false;
    } else {
      fetchVenues({ pageNum: page, replace: page === 1 });
    }
  }, [page]);

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
          text-3xl md:text-4xl font-regular mb-4 mt-1
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

        <div className="mt-12 flex justify-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={loading && page === 1}
            className="px-6 py-2 bg-white font-semibold rounded-xl shadow hover:bg-purple-50 hover:text-purple-700 disabled:opacity-50 border border-gray-100 transition"
          >
            {loading && page === 1 ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-xl shadow hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {loading && page > 1 ? 'Loading...' : 'Load Next'}
          </button>
        </div>

        {loading && page > 1 && <p className="mt-4 text-center text-gray-500">Loading more…</p>}
      </div>
      <ScrollToTopButton />
    </>
  );
}
