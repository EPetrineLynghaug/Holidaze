import React from "react";

export default function VenueDescription({ description }) {
  if (!description) return null;
  return (
    <section className="mt-0 mb-2 px-4">  
      <h2
        className="font-regular text-xl sm:text-2xl mb-2 text-left"
        style={{
          fontFamily: "'Figtree', sans-serif",
          letterSpacing: "0.1em",
          color: "#222",
        }}
      >
        Description
      </h2>
      <p
        className="text-gray-800 text-base sm:text-lg leading-relaxed whitespace-pre-line text-left"
        style={{
          fontFamily: "'Figtree', sans-serif",
          letterSpacing: "0.1em",
          lineHeight: "1.7",
        }}
      >
        {description.replace(/^Description:\s*/i, "")}
      </p>
    </section>
  );
}
