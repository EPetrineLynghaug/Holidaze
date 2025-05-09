import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router";

export default function ImageCarousel({ media = [], name = "", slide, setSlide }) {
  const total = media.length;
  const navigate = useNavigate();
  const lastTap = useRef(0); 
  const nextImg = useCallback(() => {
    if (!total) return;
    setSlide((i) => (i + 1) % total);
  }, [setSlide, total]);

  const prevImg = useCallback(() => {
    if (!total) return;
    setSlide((i) => (i - 1 + total) % total);
  }, [setSlide, total]);

 
  const debounce = (fn) => (e) => {
    const now = Date.now();
    if (now - lastTap.current < 150) return;
    lastTap.current = now;
    e.stopPropagation();
    fn();
  };

  if (!total) {
    return <div className="w-full aspect-video bg-gray-100" />;
  }

  return (
    <div className="relative w-full aspect-video select-none touch-manipulation">
      {/* Synlig bilde */}
      <img
        src={media[slide].url}
        alt={media[slide].alt || name}
        className="w-full h-full object-cover"
      />

      {/* Halvtransparente klikk‑soner */}
      <button
        aria-label="Previous image"
        onPointerUp={debounce(prevImg)}
        className="absolute inset-y-0 left-0 w-1/2 cursor-pointer focus:outline-none bg-transparent"
      />
      <button
        aria-label="Next image"
        onPointerUp={debounce(nextImg)}
        className="absolute inset-y-0 right-0 w-1/2 cursor-pointer focus:outline-none bg-transparent"
      />

      {/* Tilbake‑knapp */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(-1);
        }}
        className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50 transition"
        aria-label="Tilbake"
      >
        <span className="material-symbols-outlined text-sm text-gray-800">arrow_back</span>
      </button>

      {/* Teller */}
      <span className="absolute bottom-4 left-4 z-10 text-xs bg-black/70 text-white px-2 py-0.5 rounded-full">
        {slide + 1}/{total}
      </span>
    </div>
  );
}
