
import React, { useState, useEffect } from "react";
import { VENUES_URL } from "../constans/api"; 

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);


  const limit = 100;


  const fetchVenues = async (page) => {
    setLoading(true);
    try {
   
      const response = await fetch(`${VENUES_URL}?limit=${limit}&page=${page}`);
      if (!response.ok) {
        throw new Error("Noe gikk galt med henting av venues");
      }
      const json = await response.json();
 
      setVenues((prevVenues) => [...prevVenues, ...json.data]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchVenues(page);
  }, [page]);


  const handleReadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div>
      <h1>All Venues</h1>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      <div
        className="venues-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {venues.map((venue, index) => {
          const imageUrl =
            venue.media && venue.media[0] && venue.media[0].url
              ? venue.media[0].url
              : "https://via.placeholder.com/300x200?text=No+Image";
          const imageAlt =
            venue.media && venue.media[0] && venue.media[0].alt
              ? venue.media[0].alt
              : "Placeholder image";

          return (
            <div
              key={`${venue.id}-${index}`}
              className="venue-card"
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                width: "300px",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={imageUrl}
                alt={imageAlt}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <h2 style={{ fontSize: "1.2rem", margin: "10px 0" }}>
                {venue.name}
              </h2>
              <p style={{ color: "#666" }}>
                {venue.location && venue.location.city
                  ? venue.location.city
                  : "Ukjent sted"}
              </p>
              <p style={{ fontWeight: "bold" }}>Pris: {venue.price} NOK</p>
             
              <a href={`/venues/${venue.id}`}>Se profil</a>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button onClick={handleReadMore} disabled={loading}>
          {loading ? "Laster..." : "Read More"}
        </button>
      </div>
    </div>
  );
}
