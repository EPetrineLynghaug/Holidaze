import React from 'react';

export default function HeroMobile() {
  return (
    <section
      className="relative h-70 overflow-hidden"
      style={{
        backgroundImage: "url('/images/heroMobile.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/75 backdrop-filter backdrop-blur-sm rounded-2xl p-6 w-[90%] max-w-lg shadow-lg border border-[#D1D1D1]">
          <div className="flex flex-col space-y-3">

            {/* Destination */}
            <div className="field-with-icon group bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2]">
              <span className="material-symbols-outlined form-icon group-focus-within:text-[#3E35A2]">language</span>
              <input
                id="where"
                name="where"
                type="text"
                placeholder="Destination"
                className="w-full pr-4 py-3 bg-transparent text-[#6E6E6E] placeholder-[#6E6E6E] focus:outline-none text-xs rounded-[10px]"
              />
            </div>

            {/* Date and Guests side by side */}
            <div className="flex space-x-4">
              {/* Guests */}
              <div className="field-with-icon group flex-1 bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2]">
                <span className="material-symbols-outlined form-icon group-focus-within:text-[#3E35A2]">person_add</span>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  placeholder="Guests"
                  className="w-full pr-4 py-3 bg-transparent text-[#6E6E6E] placeholder-[#6E6E6E] focus:outline-none text-xs rounded-[10px]"
                />
              </div>

              {/* Date */}
              <div className="field-with-icon group flex-1 bg-white/75 border border-[#D1D1D1] rounded-[10px] focus-within:border-[#3E35A2]">
              
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
          </div>
        </div>
      </div>
    </section>
  );
}