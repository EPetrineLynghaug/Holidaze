import React from 'react';
import { Outlet, useLocation } from 'react-router';
import MainMobileMenu from './navigation/mobile/MainMobileMenu';
import MainDesktopMenu from "./navigation/desktop/MainDesctopMeny";

export default function Layout() {
  const { pathname } = useLocation();
  const hideNavOn = ['/login', '/register'];
  const showNav = !hideNavOn.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
 
      {showNav && (
        <>
          <div className="block md:hidden"> {/* Mobilmeny vises på små skjermer */}
            <MainMobileMenu />
          </div>
          <div className="hidden md:block"> {/* Desktop-meny vises fra tablet-størrelse (md) */}
            <MainDesktopMenu />
          </div>
        </>
      )}
      <main className="flex-1  mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
