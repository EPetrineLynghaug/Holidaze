import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './styles/icons.css';
import "./index.css";
import { BrowserRouter as Router } from "react-router"; 

import { UserProvider } from './components/context/UserProvider'; 
import App from "./App.jsx";
import './index.css'; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </StrictMode>
);
