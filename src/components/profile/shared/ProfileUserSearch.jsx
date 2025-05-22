import React from 'react';
import { useNavigate } from 'react-router';

const PLACEHOLDER_AVATAR = "https://ui-avatars.com/api/?name=User&background=EEE&color=888&size=64";

export default function ProfileUserLink({ user }) {
  const navigate = useNavigate();

  const avatarUrl = user?.avatar?.url || PLACEHOLDER_AVATAR;
  const avatarAlt = user?.avatar?.alt || user?.name || "User";
  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : "User";

  return (
    <div
      className="flex items-center space-x-3 cursor-pointer mt-3"
      onClick={() => user?.name && navigate(`/profile/${user.name}`)}
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
  );
}