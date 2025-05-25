import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "../src/components/ui/styles/icons.css";

import "./index.css";

import App from "./App.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
import { FavoritesProvider } from "./components/context/FavoritesContext.jsx";

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <FavoritesProvider>
      <App />
      </FavoritesProvider>
    </BrowserRouter>
    
  </React.StrictMode>
);
