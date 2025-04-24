// src/pages/Profile.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../components/context/UserContext";
import DeleteVenueButton from "../components/buttons/DeleteVenueButton";
import { VENUES_URL, PROFILE_BY_NAME_VENUES_URL } from "../components/constans/api";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

 
  useEffect(() => {
    const storedManager = localStorage.getItem("venueManager");
    if (storedManager !== null) {
      setUser(prev => ({ ...prev, venueManager: storedManager === "true" }));
    }
  }, [setUser]);

  const [venueForm, setVenueForm] = useState({
    name: "",
    description: "",
    mediaUrl: "",
    price: "",
    maxGuests: "",
    city: "",
    address: "",
  });
  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [errorVenues, setErrorVenues] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user's venues
  const fetchVenues = async () => {
    if (!user) return;
    setLoadingVenues(true);
    setErrorVenues(null);
    try {
      const res = await fetch(PROFILE_BY_NAME_VENUES_URL(user.name), {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
      });
      if (!res.ok) throw new Error(`Kunne ikke hente venues (Status: ${res.status})`);
      const json = await res.json();
      setVenues(json.data);
    } catch (err) {
      setErrorVenues(err.message);
    } finally {
      setLoadingVenues(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [user]);

  if (!user) {
    return <p>Ingen bruker logget inn.</p>;
  }

  const handleToggleManager = (e) => {
    const isManager = e.target.checked;
    setUser(prev => ({ ...prev, venueManager: isManager }));
    localStorage.setItem("venueManager", isManager);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload = {
      name: venueForm.name,
      description: venueForm.description,
      media: venueForm.mediaUrl ? [{ url: venueForm.mediaUrl, alt: venueForm.name }] : [],
      price: Number(venueForm.price),
      maxGuests: Number(venueForm.maxGuests),
      rating: 0,
      meta: { wifi: false, parking: false, breakfast: false, pets: false },
      location: { address: venueForm.address, city: venueForm.city, zip: "", country: "", continent: "", lat: 0, lng: 0 },
    };

    try {
      const res = await fetch(VENUES_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
          "X-Noroff-API-Key": import.meta.env.VITE_NOROFF_API_KEY,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.errors?.[0]?.message || "Kunne ikke opprette venue");
      }
      setSuccessMessage("Venue opprettet!");
      setVenueForm({ name: "", description: "", mediaUrl: "", price: "", maxGuests: "", city: "", address: "" });
      fetchVenues();
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleDelete = (deletedId) => {
    setVenues(prev => prev.filter(v => v.id !== deletedId));
    setSuccessMessage("Venue slettet!");
  };

  return (
    <div className="profile-container" style={{ padding: '1rem' }}>
      <h1>Din profil</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <label style={{ display: 'block', margin: '1rem 0' }}>
        <input
          type="checkbox"
          checked={user.venueManager || false}
          onChange={handleToggleManager}
        />{' '}
        Venue Manager
      </label>

      <div className="profile-details" style={{ padding: '1rem' }}>
        {user.avatar && <img src={user.avatar.url} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />}
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        {user.bio && <p>{user.bio}</p>}
      </div>

      {user.venueManager && (
        <div className="venue-manager" style={{ borderTop: '1px solid #ccc', marginTop: '2rem', padding: '1rem' }}>
          <h3>Opprett ny Venue</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input type="text" name="name" value={venueForm.name} onChange={handleChange} placeholder="Navn" required />
            <textarea name="description" value={venueForm.description} onChange={handleChange} placeholder="Beskrivelse" required />
            <input type="url" name="mediaUrl" value={venueForm.mediaUrl} onChange={handleChange} placeholder="Media URL" />
            <input type="number" name="price" value={venueForm.price} onChange={handleChange} placeholder="Pris (NOK)" required />
            <input type="number" name="maxGuests" value={venueForm.maxGuests} onChange={handleChange} placeholder="Max Guests" required />
            <input type="text" name="city" value={venueForm.city} onChange={handleChange} placeholder="By" required />
            <input type="text" name="address" value={venueForm.address} onChange={handleChange} placeholder="Adresse" required />
            <button type="submit" style={{ gridColumn: '1 / -1' }}>Send inn Venue</button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Dine venues</h3>
        {loadingVenues && <p>Laster dine venues...</p>}
        {errorVenues && <p style={{ color: 'red' }}>{errorVenues}</p>}
        {!loadingVenues && venues.length === 0 && <p>Ingen venues funnet.</p>}
        <ul>
          {venues.map(v => (
            <li key={v.id} style={{ marginBottom: 8 }}>
              {v.name} (ID: {v.id})
              <DeleteVenueButton
                venueId={v.id}
                accessToken={user.accessToken}
                onDeleted={handleDelete}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
