import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { VENUES_URL } from "../components/constans/api";
export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 100;
  const navigate = useNavigate();
  const isFirstRender = useRef(true);

  const fetchVenues = async ({ pageNum = 1, replace = false }) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${VENUES_URL}?limit=${limit}&page=${pageNum}&sort=created&sortOrder=desc`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { data } = await res.json();
      setVenues(prev => (replace ? data : [...prev, ...data]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      fetchVenues({ pageNum: 1, replace: true });
      isFirstRender.current = false;
    } else {
      fetchVenues({ pageNum: page, replace: page === 1 });
    }
  }, [page]);

  const handleRefresh = () => {
    fetchVenues({ pageNum: 1, replace: true });
    setPage(1);
  };

  const handleLoadMore = () => setPage(prev => prev + 1);

  if (loading && page === 1) return <p>Loading venues...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">All Venues</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
        {venues.map(v => {
          const imgCount = v.media?.length ?? 0;
          const currentIndex = imgCount > 0 ? 1 : 0;
          const price = (v.price ?? 399).toFixed(2);
          const rating = (v.rating ?? 5).toFixed(1);
          const imageUrl = v.media?.[0]?.url || "https://via.placeholder.com/300x200?text=Ingen+Bilde";
          const imageAlt = v.media?.[0]?.alt || "Ingen bilde tilgjengelig";

          return (
            <div
              key={v.id}
              onClick={() => navigate(`/venues/${v.id}`)}
              className="cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition-shadow"
            >
              {/* Image + dynamic bottom shadow + overlays */}
              <div className="relative w-full pt-[56.25%] filter drop-shadow-[0_-8px_8px_rgba(0,0,0,0.4)]">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">
                  {currentIndex}/{imgCount}
                </span>
                <span
                  className="material-symbols-outlined icon-purple text-xs absolute top-2 right-2 cursor-pointer"
                  onClick={e => e.stopPropagation()}
                >
                  favorite_border
                </span>
              </div>

              {/* Info section */}
              <div className="px-4 pt-4 pb-5 flex flex-col">
                <h2 className="text-lg font-bold mb-1">{v.name}</h2>
                <p className="text-sm text-gray-500 mb-3">
                  {v.location?.city ?? 'undefined'}, {v.location?.country ?? 'undefined'}
                </p>

                <div className="flex justify-between items-center">
                  {/* Rating */}
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined icon-purple text-[0.rem] mr-[2px]"
                      >
                        star_outline
                      </span>
                    ))}
                    <span className="text-[0.5rem] text-gray-500 ml-1">({rating})</span>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-lg font-bold text-black">
                      ${price}
                    </span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleRefresh}
          disabled={loading && page === 1}
          className="px-5 py-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50"
        >
          {loading && page === 1 ? "Refreshing..." : "Refresh"}
        </button>
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="px-5 py-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50"
        >
          {loading && page > 1 ? "Loading..." : "Load Next 100"}
        </button>
      </div>

      {loading && page > 1 && (
        <p className="mt-4 text-center text-gray-500">Loading more venues…</p>
      )}
    </div>
  );
}

