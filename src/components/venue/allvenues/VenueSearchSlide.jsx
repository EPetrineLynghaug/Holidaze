import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import useSearch from "../../../hooks/api/useSearch";
import useAuthUser from "../../../hooks/auth/useAuthUser";

const TABS = [
  { key: "all", label: "All" },
  { key: "profiles", label: "Profiles" },
  { key: "venues", label: "Venues" },
];

export default function VenueSearchSlide({ className = "" }) {
  const user = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { data, loading, error } = useSearch(query);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Fokuser input ved åpning
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Lukk dropdown om klikk utenfor
  useEffect(() => {
    function handleOutside(e) {
      if (open && containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Filtrer tabs basert på om bruker er logget inn
  const tabs = useMemo(() => TABS.filter((tab) => tab.key !== "profiles" || user), [user]);

  // Sorter og splitt data til profiler og venues
  const { profiles, venues } = useMemo(() => {
    const ps = [];
    const vs = [];
    data.forEach((item) => (item.type === "profile" ? ps.push(item) : vs.push(item)));
    ps.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
    vs.sort((a, b) => a.name.localeCompare(b.name));
    return { profiles: ps, venues: vs };
  }, [data]);

  // Filtrer viste resultater basert på søk
  const displayedProfiles = useMemo(
    () =>
      profiles.filter((p) =>
        (p.displayName || p.name).toLowerCase().includes(query.toLowerCase())
      ),
    [profiles, query]
  );
  const displayedVenues = useMemo(
    () => venues.filter((v) => v.name.toLowerCase().includes(query.toLowerCase())),
    [venues, query]
  );

  if (!location.pathname.startsWith("/venues")) return null;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center font-figtree ${className}`}
      role="search"
    >
      {/* Søkefelt */}
      <div
        className={`flex items-center rounded-full border border-gray-300 bg-white shadow-sm overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "w-72 sm:w-80 md:w-[370px] h-11" : "w-10 h-10"}`}
        style={{ minWidth: open ? "210px" : "40px" }}
      >
        {open && (
          <input
            ref={inputRef}
            type="search"
            role="searchbox"
            aria-label="Search venues or profiles"
            aria-autocomplete="list"
            aria-controls="search-listbox"
            aria-expanded={open}
            placeholder="Search venues or profiles..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveTab("all");
            }}
            className="flex-1 px-4 py-2 text-sm sm:text-base bg-transparent outline-none placeholder-gray-400 font-normal"
          />
        )}
        <button
          aria-label={open ? "Close search" : "Open search"}
          onClick={() => {
            setOpen((prev) => {
              if (prev) setQuery("");
              return !prev;
            });
          }}
          className="flex-none w-10 h-10 grid place-items-center rounded-full hover:bg-gray-100 active:scale-95 transition"
        >
          <span className="material-symbols-outlined text-lg text-gray-600">
            {loading ? "autorenew" : open ? "close" : "search"}
          </span>
        </button>
      </div>

      {/* Dropdown med resultater */}
      {open && (
        <div
          className="absolute left-0 top-[110%] mt-2 w-72 sm:w-80 md:w-[370px] bg-white rounded-xl shadow-lg ring-1 ring-gray-200 z-50 border border-gray-100 animate-fadein"
          role="dialog"
          aria-modal="false"
        >
          {/* Faner */}
          <div role="tablist" className="flex bg-gray-50 rounded-t-xl overflow-hidden border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                role="tab"
                id={`tab-${tab.key}`}
                aria-selected={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-center text-xs md:text-sm font-semibold tracking-wide transition-colors duration-200
                  ${
                    activeTab === tab.key
                      ? "text-indigo-600 bg-white border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-indigo-600 bg-gray-50"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Resultatliste */}
          <div
            id="search-listbox"
            role="region"
            aria-labelledby={`tab-${activeTab}`}
            className="max-h-60 overflow-y-auto divide-y divide-gray-100 text-sm"
          >
            {/* Loader */}
            {loading && (
              <div className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600">
                <span className="material-symbols-outlined animate-spin text-base">autorenew</span>
                Searching...
              </div>
            )}

            {/* Error */}
            {error && <div className="px-4 py-2 text-xs text-red-500">{error}</div>}

            {/* Resultater */}
            {!loading && !error && (
              <>
                {(activeTab === "all" || activeTab === "profiles") && (
                  <ul
                    role="listbox"
                    aria-label="Profile results"
                    className="divide-y divide-gray-100"
                  >
                    {displayedProfiles.length > 0 ? (
                      displayedProfiles.map((p) => (
                        <li
                          key={p.id}
                          role="option"
                          className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-indigo-50 transition"
                        >
                          <Link
                            to={`/profile/${p.routeName}`}
                            onClick={() => {
                              setOpen(false);
                              setQuery("");
                            }}
                            className="flex items-center gap-3 w-full"
                          >
                            <img
                              src={p.avatar || "/images/default-avatar.png"}
                              onError={(e) => {
                                e.currentTarget.src = "/images/default-avatar.png";
                              }}
                              alt={p.displayName || p.name}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <span className="font-normal text-sm truncate text-gray-900">
                              {p.displayName || p.name}
                            </span>
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-xs text-gray-400">
                        No profiles found.
                      </li>
                    )}
                  </ul>
                )}

                {(activeTab === "all" || activeTab === "venues") && (
                  <ul
                    role="listbox"
                    aria-label="Venue results"
                    className="divide-y divide-gray-100"
                  >
                    {displayedVenues.length > 0 ? (
                      displayedVenues.map((v) => (
                        <li
                          key={v.id}
                          role="option"
                          className="px-4 py-2 cursor-pointer hover:bg-indigo-50 transition"
                        >
                          <Link
                            to={`/venues/${v.id}`}
                            onClick={() => setOpen(false)}
                            className="block font-normal text-sm truncate text-gray-900"
                            title={v.name}
                          >
                            {v.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-xs text-gray-400">No venues found.</li>
                    )}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
