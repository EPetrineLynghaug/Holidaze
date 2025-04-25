import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router";

import Layout from './components/constans/layout';


import Home from './pages/Home';
import AllVenues from './pages/AllVenues';
import Profile from './pages/Profile';
import VenueDetail from './pages/VenueDetail';


import Login from './pages/Login';
import Register from './pages/Register'

function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" element={<Layout />}>
        
          <Route index element={<Home />} />

       
        {/* Venues-ruter */}
        <Route path="venues">
            <Route index element={<AllVenues />} />
            {/* Dynamisk route for single venue detail */}
            <Route path=":id" element={<VenueDetail />} />
          </Route>
          
          <Route path="profile" element={<Profile />} />

     
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;