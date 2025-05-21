import React from "react";

export default function VenueDescription({ description }) {
  if (!description) return null;
  return (
    <section className="my-4 px-4">
      <h2 className="font-semibold text-lg mb-2">Description</h2>
      <p className="text-gray-700 whitespace-pre-line">
        {description}
      </p>
    </section>
  );
}
