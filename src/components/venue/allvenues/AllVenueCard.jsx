import { useNavigate } from "react-router-dom";
import RatingStars from "../../ui/RatingStars";
import { useFavorites } from "../../context/FavoritesContext";
import FavoriteButton from "../../ui/buttons/FavoriteButton"; 

const PLACEHOLDER_IMG = "/images/heroMobile.webp";

export default function AllVenueCard({ venue }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();

  const {
    id,
    name,
    price,
    media = [],
    location = {},
    rating = 0,
  } = venue;

  const imgSrc = media[0]?.url || PLACEHOLDER_IMG;
  const imgAlt = media[0]?.alt || name || "Venue image";
  const imageCount = media.length;
  const isFavorite = favorites.some((fav) => fav.id === id);

  return (
    <div
      className="
        rounded-2xl border border-gray-100
        shadow-sm hover:shadow-md overflow-hidden
        transition hover:-translate-y-0.5 cursor-pointer
        max-w-[340px] w-full font-sans
      "
      onClick={() => navigate(`/venues/${id}`)}
      tabIndex={0}
      role="button"
      aria-label={`View venue ${name}`}
    >
      <div className="relative">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="w-full aspect-[16/9] object-cover rounded-t-2xl"
          loading="lazy"
          aria-label={imgAlt}
          onError={e => {
            if (!e.currentTarget.src.endsWith("heroMobile.webp")) {
              e.currentTarget.src = PLACEHOLDER_IMG;
            }
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-1/2 pointer-events-none rounded-t-2xl"
          style={{
            background:
              "linear-gradient(to top, rgba(34,34,34,0.12) 0%, rgba(255,255,255,0.0) 90%)",
          }}
        />
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            active={isFavorite}
            onClick={e => {
              e.stopPropagation();
              toggleFavorite(venue);
            }}
            size={32}
          />
        </div>
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
          {`1/${imageCount || 1}`}
        </span>
      </div>

      <div className="px-4 py-2 min-h-[100px] flex flex-col justify-center">
        <h3 className="text-[18px] font-normal tracking-wider text-gray-900 mb-0 truncate">
          {name}
        </h3>
        <p className="text-[13px] text-gray-500 truncate mb-0">
          {location?.city || ""}
          {location?.city && location?.country ? ", " : ""}
          {location?.country || ""}
        </p>
        <RatingStars value={rating} starSize={15} showValue className="mt-0.5 mb-1" />

        <div className="flex items-center justify-end mt-0">
          <span className="text-[18px] text-gray-900 font-bold flex items-center gap-1">
            {Number(price || 0).toLocaleString("no-NO")}
            <span className="text-[14px] font-medium text-gray-500">NOK</span>
            <span className="text-[13px] text-gray-400 ml-1 font-medium">/ night</span>
          </span>
        </div>
      </div>
    </div>
  );
}
