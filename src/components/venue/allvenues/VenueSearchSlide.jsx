// src/components/venue/allvenues/VenueSearchSlide.jsx
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

  // Split and sort raw data
  // Only show profile tab if logged in
  const tabs = useMemo(() => {
    return TABS.filter(tab => tab.key !== 'profiles' || user);
  }, [user]);

  const { profiles, venues } = useMemo(() => {
    const ps = [];
    const vs = [];
    data.forEach(item => {
      if (item.type === 'profile') ps.push(item);
      else vs.push(item);
    });
    ps.sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
    vs.sort((a, b) => a.name.localeCompare(b.name));
    return { profiles: ps, venues: vs };
  }, [data]);

  // Filtered lists based on query
  const displayedProfiles = useMemo(() => {
    const lower = query.toLowerCase();
    return profiles.filter(p =>
      (p.displayName || p.name).toLowerCase().includes(lower)
    );
  }, [profiles, query]);

  const displayedVenues = useMemo(() => {
    const lower = query.toLowerCase();
    return venues.filter(v =>
      v.name.toLowerCase().includes(lower)
    );
  }, [venues, query]);

  if (!location.pathname.startsWith('/venues')) return null;

  return (
    <div ref={containerRef} className={`relative flex items-center h-10 ${className}`}>  
      <div className={`flex items-center bg-white rounded-full shadow border transition-all duration-300 ease-in-out overflow-hidden ${open ? 'w-64 sm:w-80 h-8' : 'w-8 h-8'}`}>        
        {open && (
          <input
            ref={inputRef}
            type="search"
            placeholder="Search venues or profiles…"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveTab('all'); }}
            className="flex-1 text-sm bg-transparent px-3 py-1.5 outline-none placeholder-gray-500"
          />
        )}
        <button
          aria-label="Toggle search"
          onClick={() => {
            setOpen(prev => {
              if (prev) setQuery('');
              return !prev;
            });
          }}
          className="flex-none w-8 h-8 grid place-items-center hover:bg-gray-100 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">
            {loading ? 'autorenew' : open ? 'close' : 'search'}
          </span>
        </button>
      </div>

      {open && query && (
        <div className="absolute left-0 top-full mt-1 w-64 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-300 z-50 max-h-64 overflow-hidden text-sm">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 text-center py-1 text-xs font-medium ${activeTab === tab.key ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              >{tab.label}</button>
            ))}
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-56 divide-y">
            {loading && (
              <div className="px-3 py-2 text-xs text-gray-600 flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-sm">autorenew</span>
                Searching…
              </div>
            )}
            {error && (
              <div className="px-3 py-2 text-xs text-red-500">{error}</div>
            )}
            {!loading && !error && (
              <>
                {(activeTab === 'all' || activeTab === 'profiles') && (
                  <ul className="divide-y">
                    {displayedProfiles.length > 0 ? displayedProfiles.map(p => (
                      <li key={`profile-${p.id}`}>                  
                        <Link
                          to={`/profile/${p.routeName}`}
                          onClick={() => { setOpen(false); setQuery(''); }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                        >
                          <img
                            src={p.avatar || '/images/default-avatar.png'}
                            onError={e => { e.currentTarget.src = '/images/default-avatar.png'; }}
                            alt={p.displayName || p.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="font-medium text-sm truncate">{p.displayName || p.name}</span>
                        </Link>
                      </li>
                    )) : (
                      <li className="px-3 py-2 text-xs text-gray-500">No profiles found.</li>
                    )}
                  </ul>
                )}
                {(activeTab === 'all' || activeTab === 'venues') && (
                  <ul className="divide-y">
                    {displayedVenues.length > 0 ? displayedVenues.map(v => (
                      <li key={`venue-${v.id}`}>                  
                        <Link
                          to={`/venues/${v.id}`}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 hover:bg-gray-50"
                        >
                          <span className="font-medium text-sm truncate" title={v.name}>{v.name}</span>
                        </Link>
                      </li>
                    )) : (
                      <li className="px-3 py-2 text-xs text-gray-500">No venues found.</li>
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
