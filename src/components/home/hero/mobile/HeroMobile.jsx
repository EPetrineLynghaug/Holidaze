import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeSearch } from "../../../../hooks/forms/useHomeSearch";

export default function HeroMobile() {
  const navigate = useNavigate();
  const [showImage, setShowImage] = useState(true);

  const {
    where,
    setWhere,
    guests,
    setGuests,
    when,
    setWhen,
    error,
    handleSubmit
  } = useHomeSearch();

  const onSearch = () => {
   
    const params = new URLSearchParams();
    params.set("where", "pets");           
    params.set("guests", String(guests));
    params.set("when", when);

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative h-70 w-screen overflow-hidden">
      {showImage && (
        <img
          src="/images/heroMobile.webp"
          alt="Hero background"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setShowImage(false)}
          draggable={false}
        />
      )}

      <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-lg shadow-lg border border-[#D1D1D1] m-4">
        <form
          className="flex flex-col space-y-3 w-full"
          aria-label="Search form"
          onSubmit={handleSubmit(onSearch)}
        >
          {/* Feilmelding */}
          {error && (
            <div className="text-red-600 text-xs mb-1 text-center">
              {error}
            </div>
          )}

          {/* Destination */}
          <div className="field-with-icon group bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2] flex items-center px-3">
            <label htmlFor="where" className="sr-only">Destination</label>
            <span className="material-symbols-outlined form-icon group-focus-within:text-[#3E35A2] text-[#6E6E6E]">
              language
            </span>
            <input
              id="where"
              name="where"
              type="text"
              placeholder="Destination"
              className="w-full py-3 bg-transparent text-[#6E6E6E] placeholder-[#6E6E6E] focus:outline-none text-xs rounded-[10px] ml-2"
              value={where}
              onChange={e => setWhere(e.target.value)}
              autoComplete="off"
            />
          </div>

          {/* Guests og Date */}
          <div className="flex space-x-4">
            <div className="field-with-icon group flex-1 bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2] flex items-center px-3">
              <label htmlFor="guests" className="sr-only">Guests</label>
              <span className="material-symbols-outlined form-icon group-focus-within:text-[#3E35A2] text-[#6E6E6E]">
                person_add
              </span>
              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                placeholder="Guests"
                className="w-full py-3 bg-transparent text-[#6E6E6E] placeholder-[#6E6E6E] focus:outline-none text-xs rounded-[10px] ml-2"
                value={guests}
                onChange={e => setGuests(Number(e.target.value) || 1)}
              />
            </div>

            <div className="field-with-icon group flex-1 bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2]">
              <label htmlFor="when" className="sr-only">Date</label>
              <input
                id="when"
                name="when"
                type="date"
                className="w-full pr-4 py-3 bg-transparent text-[#6E6E6E] focus:outline-none text-xs rounded-[10px]"
                value={when}
                onChange={e => setWhen(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Søke-knapp */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#5C50FF] to-[#645BFF] text-white text-base font-medium py-2 rounded-[10px] transition"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
