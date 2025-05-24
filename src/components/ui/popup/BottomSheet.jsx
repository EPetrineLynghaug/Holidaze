import React, { useEffect } from 'react';
import MobileCloseButton from "../buttons/MobileCloseButton";

export default function BottomSheet({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <section className="fixed inset-x-0 bottom-0 h-4/5 z-50">
      <div className="absolute inset-0 bg-white rounded-t-3xl shadow-lg flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 pt-6 pb-3 border-b border-purple-100">
          {/* Dummy for balanse til venstre */}
          <div className="w-9 h-9" />
          {/* Tittel */}
          <h2 className="text-lg font-semibold text-purple-900 text-center flex-1">
            {title}
          </h2>
          {/* X-knapp til høyre */}
          <MobileCloseButton onClick={onClose} className="mr-3" />
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}
