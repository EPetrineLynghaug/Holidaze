import React from "react";
import { useNavigate } from "react-router-dom";
import { useHomeSearch } from "../../../../hooks/forms/useHomeSearch";

export default function SearchBox() {
  const navigate = useNavigate();
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
    <form
      onSubmit={handleSubmit(onSearch)}
      className="bg-white/60 backdrop-blur-md rounded-xl p-5 shadow-lg border border-[#D1D1D1] mx-auto w-[90%] max-w-2xl"
    >
      <div className="flex flex-col space-y-3">
        {/* Feilmelding */}
        {error && (
          <p className="text-red-600 text-xs -mt-2">{error}</p>
        )}

        {/* Destination */}
        <div className="field-with-icon group bg-white/80 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2] flex items-center px-3">
          <span className="material-symbols-outlined form-icon">language</span>
          <input
            id="where"
            name="where"
            type="text"
            placeholder="Destination"
            className="w-full pr-4 py-2 text-sm bg-transparent placeholder-[#6E6E6E] focus:outline-none"
            value={where}
            onChange={e => setWhere(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Guests + Date */}
        <div className="flex gap-4">
          <div className="field-with-icon group flex-1 bg-white/80 border border-[#D1D1D1] rounded-[10px] flex items-center px-3">
            <span className="material-symbols-outlined form-icon">person_add</span>
            <input
              id="guests"
              name="guests"
              type="number"
              min="1"
              placeholder="Guests"
              className="w-full pr-4 py-2 text-sm bg-transparent placeholder-[#6E6E6E] focus:outline-none"
              value={guests}
              onChange={e => setGuests(Number(e.target.value) || 1)}
            />
          </div>
          <div className="field-with-icon group flex-1 bg-white/80 border border-[#D1D1D1] rounded-[10px]">
            <input
              id="when"
              name="when"
              type="date"
              className="w-full pr-4 py-2 text-sm bg-transparent text-[#6E6E6E] focus:outline-none"
              value={when}
              onChange={e => setWhen(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Search */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#5C50FF] to-[#645BFF] text-white font-medium text-sm py-2 rounded-[10px]"
        >
          Search
        </button>
      </div>
    </form>
  );
}
