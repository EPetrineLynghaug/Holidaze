import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/context/FavoritesContext";
import AllVenueCard from "../components/venue/allvenues/AllVenueCard";
import useAuthUser from "../hooks/auth/useAuthUser";
import LoginPromptPopup from "../components/ui/popup/LoginPromptPopup";

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const user = useAuthUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);


  useEffect(() => {
    if (!user) {
      setShowLoginPrompt(true);
    }
  }, [user]);

  const handleClosePrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 relative">
      <h2 className="text-2xl font-semibold mb-6">Your Favorites</h2>

      {user && favorites.length === 0 && (
        <p className="text-center text-gray-500">You haven't added any favorites yet.</p>
      )}

      {user && favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {favorites.map((venue) => (
            <AllVenueCard key={venue.id} venue={venue} />
          ))}
        </div>
        
      )}

     {!user && showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <LoginPromptPopup
            onClose={handleClosePrompt}
            onLogin={handleGoToLogin}
            onRegister={handleGoToRegister}
          />
        </div>
      )}
    </div>

  );
}
