import { Link } from "react-router-dom";

export default function UserProfileLink({
  user,
  size = "xs",
  className = "",
  onClick,
}) {
  if (!user) return null;


  const name = user.displayName || user.name;
  const avatar =
    typeof user.avatar === "string"
      ? user.avatar
      : user.avatar?.url || "/images/default-avatar.jpg";
  const routeName = user.routeName || user.name;
  const linkTo = `/profile/${routeName}`;

  return (
    <div className="mt-2">
      <Link
        to={linkTo}
        onClick={onClick}
        className={`flex items-center gap-3 ${className}`}
      >
        <img
          src={avatar}
          onError={e => { e.currentTarget.src = "/images/default-avatar.jpg"; }}
          alt={name}
          className={`${
            size === "xs" ? "w-8 h-8" : "w-12 h-12"
          } rounded-full object-cover flex-shrink-0`}
          loading="lazy"
        />
        <span className="font-semibold text-base truncate text-indigo-700 capitalize">
          {name}
        </span>
      </Link>
    </div>
  );
}
