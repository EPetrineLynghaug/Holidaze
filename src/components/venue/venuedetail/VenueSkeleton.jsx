import React from "react";

export default function VenueDetailSkeleton() {
  return (
    <div className="animate-pulse select-none">
      <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4" />
      <div className="px-4 pt-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}
