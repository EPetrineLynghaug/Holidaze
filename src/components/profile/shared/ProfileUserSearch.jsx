import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAuthUser from "../../../hooks/auth/useAuthUser";
import LoginToViewProfilePopup from "../../ui/popup/LoginToViewProfilePopup";

const PLACEHOLDER_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=EEE&color=888&size=64";

export default function ProfileUserLink({ user }) {
  const navigate = useNavigate();
  const currentUser = useAuthUser();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const avatarUrl = user?.avatar?.url || PLACEHOLDER_AVATAR;
  const avatarAlt = user?.avatar?.alt || user?.name || "User";
  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "User";

  const handleClick = () => {
    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }
    if (user?.name) {
      navigate(`/profile/${user.name}`);
    }
  };

  return (
    <>
      <div
        className="flex items-center space-x-3 cursor-pointer mt-3"
        onClick={handleClick}
      >
        <img
          src={avatarUrl}
          alt={avatarAlt}
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold text-indigo-600 hover:underline capitalize">
          {displayName}
        </span>
      </div>

      {showLoginPrompt && (
        <LoginToViewProfilePopup onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
}
