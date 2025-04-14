import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from './constans/layout';


// Sider
import Home from './pages/Home';
import AllVenues from './pages/AllVenues';
import Profile from './pages/Profile';

// Login & Register
import Login from './components/registerAndLogin/Login';
import Register from './components/registerAndLogin/Register';

function App() {
  return (
    <Router>
      {/* Alle Routes under Layout */}
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* index = "" => Home-siden: / */}
          <Route index element={<Home />} />

          {/* Andre sider: /venues, /profile osv. */}
          <Route path="venues" element={<AllVenues />} />
          <Route path="profile" element={<Profile />} />

          {/* Login og register */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
