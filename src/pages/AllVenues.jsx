// src/pages/AllVenues.jsx
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
      console.log("Fetching venues:", url);
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
    // Force refresh selv om side er 1
    fetchVenues({ pageNum: 1, replace: true });
    setPage(1);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) return <p>Loading venues...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Venues</h1>
      <div style={{ margin: "1rem 0" }}>
        <button onClick={handleRefresh} disabled={loading && page === 1}>
          {loading && page === 1 ? "Refreshing..." : "Refresh"}
        </button>
        <button
          onClick={handleLoadMore}
          disabled={loading}
          style={{ marginLeft: 10 }}
        >
          {loading && page > 1 ? "Loading more..." : "Load Next 100"}
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {venues.map(v => (
          <div
            key={v.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              width: 300,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <img
                src={
                  v.media?.[0]?.url ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={v.media?.[0]?.alt || "No image"}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              <h2 style={{ margin: "10px 0" }}>{v.name}</h2>
              <p style={{ color: "#666" }}>
                {v.location?.city || "Unknown location"}
              </p>
              <p style={{ fontWeight: "bold" }}>Price: {v.price} NOK</p>
            </div>
            <button
              onClick={() => navigate(`/venues/${v.id}`)}
              style={{
                marginTop: 10,
                padding: '8px 12px',
                border: 'none',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              See Venue
            </button>
          </div>
        ))}
      </div>

      {loading && page > 1 && <p>Loading more venues…</p>}
    </div>
  );
}
