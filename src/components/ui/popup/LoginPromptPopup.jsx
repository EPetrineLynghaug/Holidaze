import React from "react";
import { useNavigate } from "react-router";
import MobileCloseButton from "../buttons/MobileCloseButton"; 
export default function LoginPromptPopup({
  onClose,
  loginPath = "/login",
  registerPath = "/register",
}) {
  const navigate = useNavigate();
  const go = (p) => {
    navigate(p, { replace: true });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
        <MobileCloseButton
          onClick={onClose}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2"
        />

        {/* icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
          <span className="material-symbols-outlined text-4xl text-[#3E35A2]">
            lock
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          You need an account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Log in or create an account to make a booking.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => go(loginPath)}
            className="flex-1 py-2 rounded-lg bg-[#3E35A2] hover:bg-[#5939aa] text-white font-medium"
          >
            Log in
          </button>
          <button
            onClick={() => go(registerPath)}
            className="flex-1 py-2 rounded-lg border border-[#3E35A2] text-[#3E35A2] font-medium hover:bg-purple-50"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
