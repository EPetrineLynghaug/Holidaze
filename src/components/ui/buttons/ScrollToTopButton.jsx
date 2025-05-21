import React, { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 250);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={`
        group fixed
        bottom-4
        left-1/2 -translate-x-1/2
        sm:left-auto sm:right-7 sm:translate-x-0
        md:bottom-10 md:right-14
        z-40
        bg-white border border-gray-200
        text-black rounded-full
        w-11 h-11 sm:w-12 sm:h-12
        flex items-center justify-center
        transition-all duration-300
        pointer-events-auto
        ${show ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"}
        hover:shadow-[0_12px_44px_0_rgba(92,80,255,0.16),0_3px_14px_0_rgba(62,53,162,0.12),0_2.5px_13px_0_rgba(80,80,120,0.13)]
        hover:-translate-y-1 hover:scale-105
        active:scale-95
        shadow-[0_7px_32px_0_rgba(92,80,255,0.12),0_1.5px_8px_0_rgba(62,53,162,0.10),0_2px_20px_0_rgba(80,80,120,0.10)]
      `}
      style={{
        boxShadow: "0 10px 38px 0 rgba(92,80,255,0.15), 0 2px 14px 0 rgba(50,50,90,0.07)"
      }}
    >
      <span
        className={`
          material-symbols-outlined
          text-xl sm:text-2xl md:text-3xl
          font-bold
          transition-transform duration-150
          group-hover:scale-110
        `}
        style={{
          textShadow: "0 3px 12px rgba(140,110,255,0.14), 0 1px 4px rgba(30,30,30,0.08)",
        }}
      >
        arrow_upward
      </span>
    </button>
  );
}
