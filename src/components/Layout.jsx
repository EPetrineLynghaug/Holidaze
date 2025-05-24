import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MainMobileMenu from './navigation/mobile/MainMobileMenu';
import MainDesktopMenu from './navigation/desktop/MainDesctopMeny';
import Footer from './footer/Footer';

export default function Layout() {
  const { pathname } = useLocation();
  const hideNavOn = ['/login', '/register'];
  const showNav = !hideNavOn.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <>
          <div className="block md:hidden">
            <MainMobileMenu />
          </div>
          <div className="hidden md:block">
            <MainDesktopMenu />
          </div>
        </>
      )}

      {/* Hovedinnhold */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer vises alltid */}
      <Footer />
    </div>
  );
}
