import React, { useContext } from "react";
import { Outlet, NavLink } from "react-router";

import MainNavigation from "../navigation/MainMobileMenu";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Henter inn hele header/nav med logout-logikk */}
      <MainNavigation />

      {/* Hovedinnhold */}
      <main className="flex-1 p-4 max-w-screen-lg mx-auto">
        <Outlet />
      </main>
    </div>
  );
}