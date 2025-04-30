import React from 'react';
import { Outlet, useLocation } from 'react-router';
import MainMobileMenu from '../navigation/MainMobileMenu';

export default function Layout() {
  const { pathname } = useLocation();
  // not strictly needed now, since Login/Register are outside this Layout,
  // but you can keep it if you want to be extra safe:
  const hideNavOn = ['/login', '/register'];
  const showNav = !hideNavOn.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <MainMobileMenu />}
      <main className="flex-1  max-w-screen-lg mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
