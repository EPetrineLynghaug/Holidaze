import React from 'react';
import { useNavigate } from 'react-router';

export default function ProfileUserLink({ user }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center px-4 py-2 space-x-3 cursor-pointer hover:bg-gray-50 rounded"
      onClick={() => navigate(`/profile/${user.name}`)}
    >
      <img
        src={user.avatar.url}
        alt={user.avatar.alt || user.name}
        className="w-10 h-10 rounded-full"
      />
      <span className="font-semibold text-indigo-600 hover:underline">
        {user.name}
      </span>
    </div>
  );
}
