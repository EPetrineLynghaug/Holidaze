import React, { useContext } from "react";
import { UserContext } from "../components/context/UserContext";

export default function Profile() {
  const { user } = useContext(UserContext);

  if (!user) {
    return <p>Ingen bruker logget inn.</p>;
  }

  return (
    <div className="profile-container">
      {/* Banner-seksjon */}
      <div className="banner">
        {user.banner && (
          <img
            src={user.banner.url}
            alt={user.banner.alt || "Banner"}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
        )}
      </div>

      {/* Profil-informasjon */}
      <div className="profile-details" style={{ padding: "1rem" }}>
        {user.avatar && (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "Avatar"}
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
          />
        )}
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
        <p>{user.bio}</p>
      </div>
    </div>
  );
}
