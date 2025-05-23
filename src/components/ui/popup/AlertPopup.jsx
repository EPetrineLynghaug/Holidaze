import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MobileCloseButton from "../buttons/MobileCloseButton"; 

export default function AlertPopup({
  open = true,
  type = "success",       
  title,
  message,
  buttonText,
  onClose,
  onButton,
  to = "/profile",
  duration = 3500,         
}) {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100); // percent
  const timerRef = useRef();

  // Default-verdier
  const isSuccess = type === "success";
  title = title || (isSuccess ? "Settings Saved!" : "Oops! Something went wrong");
  message = message || (isSuccess
    ? "Your profile settings have been updated."
    : "We couldn't save your changes. Please try again.");
  buttonText = buttonText || (isSuccess ? "OK" : "Try Again");

  // Farger og ikon
  const icon = isSuccess ? "check_circle" : "error";
  const bgColor = isSuccess ? "bg-purple-100" : "bg-red-100";
  const iconColor = isSuccess ? "text-[#7c3aed]" : "text-red-600";
  const buttonBg = isSuccess ? "bg-[#7c3aed] hover:bg-[#4c1d95]" : "bg-red-600 hover:bg-red-700";
  const border = isSuccess ? "border-purple-200" : "border-red-200";

  // Progress & autolukk
  useEffect(() => {
    if (!open) return;
    setProgress(100);

    const started = Date.now();
    timerRef.current = setInterval(() => {
      const pct = Math.max(0, 100 - ((Date.now() - started) / duration) * 100);
      setProgress(pct);
      if (pct <= 0) {
        clearInterval(timerRef.current);
        onClose?.();
      }
    }, 30);

    return () => clearInterval(timerRef.current);
  }, [open, duration, onClose]);

  // Knapp handling
  function handleButton() {
    if (onButton) {
      onButton();
    } else if (isSuccess && to) {
      navigate(to, { replace: true });
      onClose?.();
    } else {
      onClose?.();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition">
      <div className={`relative w-11/12 max-w-xs bg-white rounded-2xl shadow-xl p-6 text-center border ${border}`}>
        {/* Mobile Close Button */}
        <MobileCloseButton
          onClick={onClose}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2"
          size="small"
        />
        {/* Icon */}
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${bgColor} mb-2`}>
          <span className={`material-symbols-outlined text-4xl ${iconColor}`}>
            {icon}
          </span>
        </div>
        {/* Title */}
        <h2 className="mt-2 text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-gray-700">{message}</p>
        {/* CTA */}
        <button
          onClick={handleButton}
          className={`mt-6 w-full py-2 rounded-lg ${buttonBg} text-white font-medium transition`}
        >
          {buttonText}
        </button>
        {/* Progress Bar */}
        <div className="absolute left-0 bottom-0 w-full h-1 rounded-b-2xl overflow-hidden bg-gray-200">
          <div
            className={`h-full transition-all duration-75 ${
              isSuccess ? "bg-purple-400" : "bg-red-400"
            }`}
            style={{
              width: `${progress}%`,
              transition: "width 30ms linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
