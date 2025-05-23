export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Holidaze - profiles
export const PROFILES_URL = `${BASE_URL}/holidaze/profiles`;
export const PROFILE_BY_NAME_URL = (name) => `${PROFILES_URL}/${name}`;
export const PROFILE_BY_NAME_VENUES_URL = (name) =>
  `${PROFILES_URL}/${name}/venues`;
export const PROFILE_BY_NAME_BOOKINGS_URL = (name) =>
  `${PROFILES_URL}/${name}/bookings`;

// Holidaze - venues
export const VENUES_URL = `${BASE_URL}/holidaze/venues`;
export const VENUE_BY_ID_URL = (id) => `${VENUES_URL}/${id}`;

// Holidaze - bookings
export const BOOKINGS_URL = `${BASE_URL}/holidaze/bookings`;
export const BOOKING_BY_ID_URL = (id) => `${BOOKINGS_URL}/${id}`;
export const BOOKING_REVIEW_URL = (id) => `${BOOKING_BY_ID_URL(id)}/reviews`;
export const VENUE_REVIEW_URL = (venueId) =>
  `${VENUE_BY_ID_URL(venueId)}/reviews`;

// Holidaze – søk
export const PROFILES_SEARCH = `${PROFILES_URL}/search`;
export const VENUES_SEARCH = `${VENUES_URL}/search`;
