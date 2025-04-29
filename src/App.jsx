
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from './components/constans/Layout';

import Home from './pages/Home';
import Venues from './pages/AllVenues';
import VenueDetail from './pages/VenueDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* No navigation on login/register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All other routes use Layout with navigation */}
        <Route path="/" element={<Layout />}>  
          <Route index element={<Home />} />
          <Route path="venues" element={<Venues />} />
          <Route path="venues/:id" element={<VenueDetail />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
