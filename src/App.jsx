// App.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

// Lazy-loaded pages
const Home          = lazy(() => import("./pages/Home"));
const Venues        = lazy(() => import("./pages/AllVenues"));
const VenueDetail   = lazy(() => import("./pages/VenueDetail"));
const Profile       = lazy(() => import("./pages/Profile"));
const ProfileDetail = lazy(() => import("./pages/ProfileDetail"));
const Login         = lazy(() => import("./pages/Login"));
const Register      = lazy(() => import("./pages/Register"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Favorites = lazy(() => import("./pages/Favorites"));


export default function App() {
  return (
    <div className="font-figtree tracking-10p min-h-screen">
      <Suspense fallback={<div className="p-4 text-center">Loading…</div>}>
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Alle andre ruter pakkes inn i Layout */}
          <Route path="/" element={<Layout />}>
            <Route index                   element={<Home />} />
            <Route path="venues"           element={<Venues />} />
            <Route path="venues/:id"       element={<VenueDetail />} />
            <Route path="profile"          element={<Profile />} />
            <Route path="profile/:username" element={<ProfileDetail />} />
             <Route path="search" element={<SearchResults />} />
               <Route path="favorites" element={<Favorites />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}
