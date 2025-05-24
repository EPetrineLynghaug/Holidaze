const PLACEHOLDER_IMG = "/images/australia.webp";

export default function HeroMobile() {
  return (
    <section className="relative h-70 w-screen overflow-hidden">

      <img
        src="/images/heroMobile.webp"
        alt="Hero background"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
        onError={e => {
          e.currentTarget.onerror = null; 
          e.currentTarget.src = PLACEHOLDER_IMG;
        }}
        draggable={false}
      />

      {/* Overlay med innhold */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-sm rounded-2xl p-6 mx-auto max-w-lg shadow-lg border border-[#D1D1D1] m-4">
        <form className="flex flex-col space-y-3 w-full" aria-label="Search form">
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
            />
          </div>

          {/* Date and Guests side by side */}
          <div className="flex space-x-4">
            {/* Guests */}
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
              />
            </div>

            {/* Date */}
            <div className="field-with-icon group flex-1 bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2]">
              <label htmlFor="when" className="sr-only">Date</label>
              <input
                id="when"
                name="when"
                type="date"
                className="w-full pr-4 py-3 bg-transparent text-[#6E6E6E] focus:outline-none text-xs rounded-[10px]"
              />
            </div>
          </div>

          {/* Search Button */}
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
