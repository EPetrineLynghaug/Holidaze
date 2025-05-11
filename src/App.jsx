
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';

import Layout from './components/Layout'
import Home        from './pages/Home';
import Venues      from './pages/AllVenues';
import VenueDetail from './pages/VenueDetail';
import Profile     from './pages/Profile';
import Login       from './pages/Login';
import Register    from './pages/Register';
import ProfileDetail   from './pages/ProfileDetail';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ingen navigasjon på login/register */}
        <Route path="/login"   element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Alle andre ruter pakkes inn i Layout */}
        <Route path="/" element={<Layout />}>
          <Route index               element={<Home />} />
          <Route path="venues"       element={<Venues />} />
          <Route path="venues/:id"   element={<VenueDetail />} />
          <Route path="profile"      element={<Profile />} />
          <Route path="profile/:username" element={<ProfileDetail />} />

    {/* <Route path="*" element={<NotFound />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
