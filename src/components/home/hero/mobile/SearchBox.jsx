export default function SearchBox() {
  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 shadow-lg border border-[#D1D1D1] mx-auto w-[90%] max-w-2xl">
      <div className="flex flex-col space-y-3">
        {/* Destination */}
        <div className="field-with-icon group bg-white/80 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2]">
          <span className="material-symbols-outlined form-icon">language</span>
          <input
            type="text"
            placeholder="Destination"
            className="w-full pr-4 py-2 text-sm bg-transparent placeholder-[#6E6E6E] focus:outline-none"
          />
        </div>

        {/* Guests + Date */}
        <div className="flex gap-4">
          <div className="field-with-icon group flex-1 bg-white/80 border border-[#D1D1D1] rounded-[10px]">
            <span className="material-symbols-outlined form-icon">person_add</span>
            <input
              type="number"
              min="1"
              placeholder="Guests"
              className="w-full pr-4 py-2 text-sm bg-transparent placeholder-[#6E6E6E] focus:outline-none"
            />
          </div>
          <div className="field-with-icon group flex-1 bg-white/80 border border-[#D1D1D1] rounded-[10px]">
            <input
              type="date"
              className="w-full pr-4 py-2 text-sm bg-transparent text-[#6E6E6E] focus:outline-none"
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
    </div>
  );
}
