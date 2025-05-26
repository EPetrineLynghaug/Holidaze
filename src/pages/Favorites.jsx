
import { useFavorites } from "../components/context/FavoritesContext";
import AllVenueCard from "../components/venue/allvenues/AllVenueCard"; 
import useAuthUser from "../hooks/auth/useAuthUser"; 

export default function Favorites() {
  const { favorites } = useFavorites();
  const user = useAuthUser();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-2">You must be logged in to view your favorites.</h2>
        <p className="mb-6">Log in or create an account to save and view your favorite venues.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Your Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">You haven't added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {favorites.map((venue) => (
            <AllVenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}
    </div>
  );
}
