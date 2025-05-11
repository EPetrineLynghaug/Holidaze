import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import useSearch from '../../../hooks/useSearch';
import useAuthUser from '../../../hooks/useAuthUser';
const TABS = [
    { key: 'all', label: 'All' },
    { key: 'profiles', label: 'Profiles' },
    { key: 'venues', label: 'Venues' },
  ];
  
  export default function VenueSearchSlide({ className = '' }) {
    const user = useAuthUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const { data, loading, error } = useSearch(query);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
  
    useEffect(() => {
      if (open) inputRef.current?.focus();
    }, [open]);
  
    useEffect(() => {
      function handleOutside(e) {
        if (open && containerRef.current && !containerRef.current.contains(e.target)) {
          setOpen(false);
          setQuery('');
        }
      }
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);
  
    const tabs = useMemo(() => TABS.filter(tab => tab.key !== 'profiles' || user), [user]);
  
    const { profiles, venues } = useMemo(() => {
      const ps = [];
      const vs = [];
      data.forEach(item => item.type === 'profile' ? ps.push(item) : vs.push(item));
      ps.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
      vs.sort((a, b) => a.name.localeCompare(b.name));
      return { profiles: ps, venues: vs };
    }, [data]);
  
    const displayedProfiles = useMemo(() => profiles.filter(p => (p.displayName || p.name).toLowerCase().includes(query.toLowerCase())), [profiles, query]);
    const displayedVenues = useMemo(() => venues.filter(v => v.name.toLowerCase().includes(query.toLowerCase())), [venues, query]);
  
    if (!location.pathname.startsWith('/venues')) return null;
  
    return (
      <div ref={containerRef} className={`relative flex items-center ${className}`} role="search">
        <div
          className={`flex items-center bg-white rounded-full shadow transition-all duration-300 ease-in-out overflow-hidden
            ${open ? 'w-64 sm:w-80 h-10' : 'w-10 h-10'}`}
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
              placeholder="Search…"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveTab('all'); }}
              className="flex-1 text-sm sm:text-base bg-transparent px-4 py-2 outline-none placeholder-gray-500"
            />
          )}
          <button
            aria-label={open ? 'Close search' : 'Open search'}
            onClick={() => {
              setOpen(prev => { if (prev) setQuery(''); return !prev; });
            }}
            className="flex-none w-10 h-10 grid place-items-center rounded-full hover:bg-gray-100 active:scale-95 transition"
          >
            <span className="material-symbols-outlined text-lg text-gray-600">
              {loading ? 'autorenew' : open ? 'close' : 'search'}
            </span>
          </button>
        </div>
  
        {open && (
          <div className="absolute left-0 top-full mt-2 w-64 sm:w-80 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 z-50" role="dialog" aria-modal="false">
            {/* Tabs */}
            <div role="tablist" className="flex bg-gray-50">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  role="tab"
                  id={`tab-${tab.key}`}
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 text-center py-2 text-xs font-medium transition-colors duration-200
                    ${activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
  
            {/* Results */}
            <div
              id="search-listbox"
              role="region"
              aria-labelledby={`tab-${activeTab}`}
              className="mt-1 overflow-y-auto max-h-56 divide-y divide-gray-200 text-sm"
            >
              {loading && (
                <div className="px-4 py-2 flex items-center gap-2 text-xs text-gray-600">
                  <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                  Searching...
                </div>
              )}
              {error && (
                <div className="px-4 py-2 text-xs text-red-500">{error}</div>
              )}
              {!loading && !error && (
                <>                
                  {(activeTab === 'all' || activeTab === 'profiles') && (
                    <ul role="listbox" aria-label="Profile results" className="divide-y divide-gray-200">
                      {displayedProfiles.length > 0 ? displayedProfiles.map(p => (
                        <li key={p.id} role="option" className="px-4 py-2 hover:bg-gray-100 transition">
                          <Link
                            to={`/profile/${p.routeName}`}
                            onClick={() => { setOpen(false); setQuery(''); }}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={p.avatar || '/images/default-avatar.png'}
                              onError={e => { e.currentTarget.src = '/images/default-avatar.png'; }}
                              alt={p.displayName || p.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium text-sm truncate">{p.displayName || p.name}</span>
                          </Link>
                        </li>
                      )) : (
                        <li className="px-4 py-2 text-xs text-gray-500">No profiles found.</li>
                      )}
                    </ul>
                  )}
                  {(activeTab === 'all' || activeTab === 'venues') && (
                    <ul role="listbox" aria-label="Venue results" className="divide-y divide-gray-200">
                      {displayedVenues.length > 0 ? displayedVenues.map(v => (
                        <li key={v.id} role="option" className="px-4 py-2 hover:bg-gray-100 transition">
                          <Link
                            to={`/venues/${v.id}`}
                            onClick={() => setOpen(false)}
                            className="block font-medium text-sm truncate"
                            title={v.name}
                          >
                            {v.name}
                          </Link>
                        </li>
                      )) : (
                        <li className="px-4 py-2 text-xs text-gray-500">No venues found.</li>
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
  