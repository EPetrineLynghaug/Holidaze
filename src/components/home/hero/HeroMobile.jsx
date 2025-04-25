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
          
            <div className="relative bg-white/75 border border-[#D1D1D1] rounded-[10px]">
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6E6E6E]">
                language
              </span>
              <input
                id="where"
                name="where"
                type="text"
                placeholder="Where"
                className="w-full pl-12 pr-4 py-3 bg-transparent text-[#6E6E6E] placeholder-[#6E6E6E] focus:outline-none text-sm rounded-[10px]"
              />
            </div>

            {/* When & Guests side by side */}
            <div className="flex space-x-4">
              {/* Date input med native ikon */}
              <div className="flex-1 relative bg-white/75 border border-[#D1D1D1] rounded-[10px]">
                <input
                  id="when"
                  name="when"
                  type="date"
                  className="w-full px-4 py-3 bg-transparent text-[#6E6E6E] focus:outline-none text-sm rounded-[10px]"
                />
              </div>

          
              <div className="flex-1 relative bg-white/75 border border-[#D1D1D1] rounded-[10px]">
                <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6E6E6E]">
                  person_add
                </span>
                <input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-[#6E6E6E] focus:outline-none text-sm rounded-[10px]"
                />
              </div>
            </div>

            {/* Søkeknappen */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#5C50FF] to-[#645BFF] text-white text-sm font-medium py-3 rounded-[10px] transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}