import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import useSearch from '../../../hooks/useSearch';

export default function VenueSearchSlide({ className = '' }) {
    const location = useLocation();
    if (!location.pathname.startsWith('/venues')) return null;
  
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { data, loading, error } = useSearch(query);
    const navigate = useNavigate();
  
    const containerRef = useRef(null);
    const inputRef = useRef(null);
  
    useEffect(() => {
      if (open) inputRef.current?.focus();
    }, [open]);
  
    useEffect(() => {
      if (open && query === '') setOpen(false);
    }, [query]);
  
    useEffect(() => {
      function handleOutside(e) {
        if (open && containerRef.current && !containerRef.current.contains(e.target)) {
          setOpen(false);
          setQuery('');
        }
      }
      document.addEventListener('touchstart', handleOutside);
      return () => document.removeEventListener('touchstart', handleOutside);
    }, [open]);
  
    const sortedData = useMemo(
      () => data.slice().sort((a, b) => a.name.localeCompare(b.name)),
      [data]
    );
  
    const hasError = !loading && open && query && sortedData.length === 0;
  
    return (
      <div ref={containerRef} className={`relative flex items-center h-10 ${className}`}>
        <div className={`flex items-center bg-white rounded-full shadow border transition-all duration-300 ease-in-out overflow-hidden
            ${open ? 'w-64 sm:w-80 h-8' : 'w-8 h-8'}
            ${hasError ? 'border-red-500 animate-shake' : 'border-gray-300'}`}>
          {open && (
            <input
              ref={inputRef}
              type="search"
              placeholder="Search venues or profiles…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-sm bg-transparent px-3 py-1.5 outline-none placeholder-gray-500"
            />
          )}
  
          <button
            aria-label="Toggle search"
            onClick={() => {
              setOpen(o => !o);
              if (open) setQuery('');
            }}
            className="flex-none w-8 h-8 grid place-items-center hover:bg-gray-100 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg" aria-hidden="true">
              {loading ? 'autorenew' : open ? 'close' : 'search'}
            </span>
          </button>
        </div>
  
        {open && query && (
          <div className="absolute left-0 top-full mt-1 w-64 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-300 z-50 max-h-56 overflow-y-auto text-sm">
            {loading && (
              <p className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600">
                <span className="material-symbols-outlined animate-spin text-sm" aria-hidden="true">autorenew</span>
                Searching…
              </p>
            )}
            {error && (
              <p className="px-3 py-2 text-xs text-red-500">{error === 'Unauthorized: Invalid or expired token.' ? 'Session expired. Please log in again.' : error}</p>
            )}
            {!loading && !error && sortedData.length === 0 && (
              <p className="px-3 py-2 text-xs text-gray-500">No results found.</p>
            )}
            {!loading && !error && sortedData.length > 0 && (
              <ul className="divide-y">
                {sortedData.map(item => (
                  <li key={item.type + item.id}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        const routeName = item.username || item.name;
                        if (item.type === 'profile') {
                          console.log('Navigating to profile:', `/profiles/${routeName}`);
navigate(`/profiles/${routeName}`);
                        } else {
                          navigate(`/venues/${item.id}`);
                        }
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 flex flex-col"
                    >
                      <span className="font-medium text-sm truncate" title={item.name}>{item.name}</span>
                      {item.type === 'venue' && item.description && (
                        <span className="text-xs text-gray-500 line-clamp-2">{item.description}</span>
                      )}
                      {item.type === 'profile' && (
                        <span className="text-xs text-gray-500">Profile</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  }
