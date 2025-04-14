import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router";

import Layout from './components/constans/layout';


import Home from './pages/Home';
import AllVenues from './pages/AllVenues';
import Profile from './pages/Profile';


import Login from './components/registerAndLogin/Login';
import Register from './components/registerAndLogin/Register';

function App() {
  return (
    <Router>
    
      <Routes>
        <Route path="/" element={<Layout />}>
        
          <Route index element={<Home />} />

       
          <Route path="venues" element={<AllVenues />} />
          <Route path="profile" element={<Profile />} />

     
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
