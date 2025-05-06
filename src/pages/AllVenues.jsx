import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { VENUES_URL } from "../components/constants/api";

const PLACEHOLDER_IMG = "https://via.placeholder.com/300x200?text=Ingen+Bilde";

// Validate URL format
const isValidUrl = url => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 100;
  const navigate = useNavigate();
  const isFirst = useRef(true);

  const fetchVenues = async ({ pageNum = 1, replace = false }) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`${VENUES_URL}?limit=${limit}&page=${pageNum}&sort=created&sortOrder=desc`);
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const { data } = await resp.json();
      setVenues(prev => (replace ? data : [...prev, ...data]));
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

  const handleRefresh = () => {
    fetchVenues({ pageNum: 1, replace: true });
    setPage(1);
  };
  const handleLoadMore = () => setPage(p => p + 1);

  if (loading && page === 1) return <p>Loading venues...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">All Venues</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {venues.map(v => {
          const count = v.media?.length || 0;
          const raw = v.media?.[0]?.url;
          const valid = raw && isValidUrl(raw);
          const imgSrc = valid ? raw : PLACEHOLDER_IMG;
          const altText = valid ? (v.media[0].alt || v.name) : 'Ingen bilde tilgjengelig';

          return (
            <div
              key={v.id}
              onClick={() => navigate(`/venues/${v.id}`)}
              className="cursor-pointer overflow-hidden rounded-lg hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full pt-[56.25%] bg-gray-100">
                <img
                  src={imgSrc}
                  alt={altText}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                />
                <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full min-w-[2.5ch] text-center">
                  {count > 0 ? `1/${count}` : '0/0'}
                </span>
              </div>
              <div className="px-4 pt-4 pb-5 space-y-1">
                <h2 className="text-lg font-bold truncate">{v.name}</h2>
                <p className="text-sm text-gray-500">
                  {v.location?.city || '-'}, {v.location?.country || '-'}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-xs mr-1">
                        {i < Math.round(v.rating || 0) ? 'star' : 'star_outline'}
                      </span>
                    ))}
                    <span className="text-xs text-gray-500">({(v.rating||0).toFixed(1)})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">${(v.price||0).toFixed(2)}</span>
                    <span className="text-sm text-gray-500">/night</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={handleRefresh}
          disabled={loading && page===1}
          className="px-5 py-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50"
        >
          {loading && page===1 ? 'Refreshing...' : 'Refresh'}
        </button>
        <button
          onClick={handleLoadMore}
          disabled={loading}
          className="px-5 py-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50"
        >
          {loading && page>1 ? 'Loading...' : 'Load Next'}
        </button>
      </div>
      {loading && page>1 && <p className="mt-4 text-center text-gray-500">Loading more…</p>}
    </div>
  );
}
