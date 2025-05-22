import React from "react";

export default function VenueDescription({ description }) {
  if (!description) return null;
  return (
    <section className="mt-0 mb-6 px-4 max-w-3xl">
      <h2
        className="font-semibold text-2xl mb-4 text-left"
        style={{
          fontFamily: "'Figtree', sans-serif",
          letterSpacing: "0.04em",
          color: "#222",
        }}
      >
        Description
      </h2>
      <p
        className="text-gray-800 text-lg leading-relaxed whitespace-pre-line text-left"
        style={{
          fontFamily: "'Figtree', sans-serif",
          letterSpacing: "0.03em",
          lineHeight: "1.75",
          maxWidth: "42rem", 
        }}
      >
        {description.replace(/^Description:\s*/i, "")}
      </p>
    </section>
  );
}
