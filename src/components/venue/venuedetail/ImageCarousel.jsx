import React, { useState } from "react";
import { useNavigate } from "react-router";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80";

export default function ImageCarousel({ media = [], name = "" }) {
  const [mainIdx, setMainIdx] = useState(0);
  const navigate = useNavigate();

  // Hvis ingen media, bruk placeholder
  const validMedia = media.length > 0
    ? media
    : [{ url: PLACEHOLDER_IMG, alt: "Placeholder image" }];

  // Mobil-navigasjon
  const prevMobile = () => setMainIdx(i => (i - 1 + validMedia.length) % validMedia.length);
  const nextMobile = () => setMainIdx(i => (i + 1) % validMedia.length);

  const total = validMedia.length;

  // Spesialcase: to bilder
  if (total === 2) {
    const otherIdx = validMedia[0] === validMedia[mainIdx] ? 1 : 0;
    return (
      <div className="w-full">
        {/* Desktop: 2-kolonne split 50/50 */}
        <div className="hidden md:grid grid-cols-2 w-full h-[32rem] rounded-2xl overflow-hidden bg-gray-100 shadow mb-6 gap-0">
          {/* Første eller nåværende hovedbilde */}
          <div className="relative">
            <img
              src={validMedia[mainIdx].url}
              alt={validMedia[mainIdx].alt || name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              draggable={false}
            />
            <button
              onClick={e => { e.stopPropagation(); navigate(-1); }}
              type="button"
              className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 border border-gray-300 rounded-full shadow hover:bg-gray-50 transition"
              aria-label="Tilbake"
            >
              <span className="material-symbols-outlined text-base text-gray-800">arrow_back</span>
            </button>
            <span className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {mainIdx + 1}/{total}
            </span>
          </div>
          {/* Andre bilde */}
          <button
            onClick={() => setMainIdx(otherIdx)}
            type="button"
            className="relative overflow-hidden"
          >
            <img
              src={validMedia[otherIdx].url}
              alt={validMedia[otherIdx].alt || name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </button>
        </div>
        {/* Mobilkarusell */}
        <div className="block md:hidden w-full">
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 shadow mb-2">
            <img
              src={validMedia[mainIdx].url}
              alt={validMedia[mainIdx].alt || name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {total > 1 && (
              <>
                <button
                  onClick={prevMobile}
                  className="absolute left-0 top-0 bottom-0 w-1/2"
                  aria-label="Forrige bilde"
                  type="button"
                />
                <button
                  onClick={nextMobile}
                  className="absolute right-0 top-0 bottom-0 w-1/2"
                  aria-label="Neste bilde"
                  type="button"
                />
              </>
            )}
            <button
              onClick={e => { e.stopPropagation(); navigate(-1); }}
              className="absolute top-2 left-2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 border border-gray-300 rounded-full shadow hover:bg-gray-50 transition"
              aria-label="Tilbake"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-gray-800">arrow_back</span>
            </button>
            <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs">
              {mainIdx + 1}/{total}
            </span>
          </div>
          {total > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
              {validMedia.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainIdx(idx)}
                  type="button"
                  className={`rounded-lg border-2 shadow-sm flex-shrink-0 transition-transform duration-200 ${
                    idx === mainIdx ? "border-blue-600 scale-105" : "border-gray-200 opacity-80 hover:opacity-100"
                  }`}
                  style={{ width: 56, height: 38 }}
                  aria-label={`Bilde ${idx + 1}`}
                >
                  <img
                    src={img.url}
                    alt={img.alt || name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Generelt case: 1 eller >2
  const thumbsGeneral = validMedia.filter((_, idx) => idx !== mainIdx).slice(0, 6);
  const m = thumbsGeneral.length;
  const areasGeneral =
    m <= 1
      ? [
          `"main main main"`,
          `"main main main"`,
          `"main main main"`,
        ].join("\n")
      : m >= 6
      ? [
          `"main thumb1 thumb2"`,
          `"main thumb3 thumb4"`,
          `"main thumb5 thumb6"`,
        ].join("\n")
      : m === 5
      ? [
          `"main thumb1 thumb2"`,
          `"main thumb3 thumb4"`,
          `"main thumb5 thumb5"`,
        ].join("\n")
      : m === 4
      ? [
          `"main thumb1 thumb2"`,
          `"main thumb3 thumb4"`,
          `"main thumb3 thumb4"`,
        ].join("\n")
      : m === 3
      ? [
          `"main thumb1 thumb2"`,
          `"main thumb1 thumb3"`,
          `"main thumb1 thumb3"`,
        ].join("\n")
      : /* m === 2 */ [
          `"main thumb1 thumb2"`,
          `"main thumb1 thumb2"`,
          `"main thumb1 thumb2"`,
        ].join("\n");

  return (
    <div className="w-full">
      {/* === TABLET & DESKTOP === */}
      <div
        className="hidden md:grid w-full h-[32rem] rounded-2xl overflow-hidden bg-gray-100 shadow mb-6"
        style={{
          gridTemplateColumns: "3fr 1fr 1fr",
          gridTemplateRows:    "repeat(3,1fr)",
          gridTemplateAreas:   areasGeneral,
          gap:                 "0.25rem",
          padding:             "0.5rem",
        }}
      >
        <div style={{ gridArea: "main" }} className="relative w-full h-full">
          <img
            src={validMedia[mainIdx].url}
            alt={validMedia[mainIdx].alt || name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
          <button
            onClick={e => { e.stopPropagation(); navigate(-1); }}
            type="button"
            className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 border border-gray-300 rounded-full shadow hover:bg-gray-50 transition"
            aria-label="Tilbake"
          >
            <span className="material-symbols-outlined text-base text-gray-800">arrow_back</span>
          </button>
          <span className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {mainIdx + 1}/{validMedia.length}
          </span>
        </div>

        {thumbsGeneral.map((img, i) => {
          const idx = validMedia.indexOf(img);
          return (
            <button
              key={idx}
              onClick={() => setMainIdx(idx)}
              type="button"
              style={{ gridArea: `thumb${i + 1}` }}
              className={`w-full h-full overflow-hidden border-2 rounded-lg transition-transform duration-200
                ${idx === mainIdx ? "border-blue-600 scale-105 shadow-lg" : "border-gray-200 hover:border-gray-400"}`}
              aria-label={`Bilde ${idx + 1}`}
            >
              <img
                src={validMedia[idx].url}
                alt={validMedia[idx].alt || name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </button>
          );
        })}
      </div>

      {/* === MOBIL === */}
      <div className="block md:hidden w-full">
        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 shadow mb-2">
          <img
            src={validMedia[mainIdx].url}
            alt={validMedia[mainIdx].alt || name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
          {validMedia.length > 1 && (
            <>
              <button
                onClick={prevMobile}
                className="absolute left-0 top-0 bottom-0 w-1/2"
                aria-label="Forrige bilde"
                type="button"
              />
              <button
                onClick={nextMobile}
                className="absolute right-0 top-0 bottom-0 w-1/2"
                aria-label="Neste bilde"
                type="button"
              />
            </>
          )}
          <button
            onClick={e => { e.stopPropagation(); navigate(-1); }}
            className="absolute top-2 left-2 z-10 w-9 h-9 flex items-center justify-center bg-white/90 border border-gray-300 rounded-full shadow hover:bg-gray-50 transition"
            aria-label="Tilbake"
            type="button"
          >
            <span className="material-symbols-outlined text-sm text-gray-800">arrow_back</span>
          </button>
          <span className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-0.5 rounded-full text-xs">
            {mainIdx + 1}/{validMedia.length}
          </span>
        </div>
        {validMedia.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
            {validMedia.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainIdx(idx)}
                type="button"
                className={`rounded-lg border-2 shadow-sm flex-shrink-0 transition-transform duration-200 ${
                  idx === mainIdx ? "border-blue-600 scale-105" : "border-gray-200 opacity-80 hover:opacity-100"
                }`}
                style={{ width: 56, height: 38 }}
                aria-label={`Bilde ${idx + 1}`}
              >
                <img
                  src={img.url}
                  alt={img.alt || name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
