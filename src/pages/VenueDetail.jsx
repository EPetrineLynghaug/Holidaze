import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { VENUES_URL } from "../components/constans/api";

export default function VenueDetail() {
 
  const { id } = useParams();

 
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    const fetchVenueDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${VENUES_URL}/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching venue details");
        }
        const json = await response.json();
     
        setVenue(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetail();
  }, [id]);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>Error: {error}</p>;
  }


  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {venue ? (
        <>
          <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
            {venue.name}
          </h1>
          <img
            src={
              venue.media && venue.media[0] && venue.media[0].url
                ? venue.media[0].url
                : "https://via.placeholder.com/800x400?text=No+Image"
            }
            alt={
              venue.media && venue.media[0] && venue.media[0].alt
                ? venue.media[0].alt
                : "No image"
            }
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          <p style={{ marginTop: "20px", lineHeight: "1.6" }}>
            {venue.description}
          </p>
          <p style={{ color: "#666" }}>
            <strong>Location:</strong>{" "}
            {venue.location
              ? `${venue.location.address ? venue.location.address + ", " : ""}${
                  venue.location.city ? venue.location.city + ", " : ""
                }${venue.location.zip ? venue.location.zip + ", " : ""}${
                  venue.location.country ? venue.location.country + ", " : ""
                }${venue.location.continent ? venue.location.continent : ""}`
              : "Ukjent sted"}
          </p>
          <p style={{ fontWeight: "bold", marginTop: "10px" }}>
            Pris per natt: {venue.price} NOK
          </p>
          <p>
            <strong>Max Guests:</strong> {venue.maxGuests}
          </p>
          <p>
            <strong>Rating:</strong> {venue.rating}
          </p>
          <p>
            <strong>Created:</strong> {venue.created}
          </p>
          <p>
            <strong>Updated:</strong> {venue.updated}
          </p>
          <div style={{ marginTop: "20px" }}>
            <h3>Amenities</h3>
            {venue.meta ? (
              <ul>
                <li>WiFi: {venue.meta.wifi ? "Yes" : "No"}</li>
                <li>Parking: {venue.meta.parking ? "Yes" : "No"}</li>
                <li>Breakfast: {venue.meta.breakfast ? "Yes" : "No"}</li>
                <li>Pets Allowed: {venue.meta.pets ? "Yes" : "No"}</li>
              </ul>
            ) : (
              <p>No amenities available.</p>
            )}
          </div>
        </>
      ) : (
        <p>No venue details found.</p>
      )}
    </div>
  );
}
