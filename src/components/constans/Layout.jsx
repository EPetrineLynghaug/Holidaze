import React from "react";
import { Outlet, useLocation } from "react-router";
import MainNavigation from "../navigation/MainMobileMenu";

export default function Layout() {
  const location = useLocation();
  const hideNavOn = ["/login", "/register"];
  const shouldHideNav = hideNavOn.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNav && <MainNavigation />}

      <main className="flex-1 px-4 max-w-screen-lg mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
