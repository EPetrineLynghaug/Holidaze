
import React, { useEffect } from 'react';

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
          <button onClick={onClose} className="material-symbols-outlined text-xl text-purple-700">
            close
          </button>
          <h2 className="text-lg font-semibold text-purple-900">{title}</h2>
          <div className="w-6" />
        </div>
        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-6">
          {children}
        </div>
      </div>
    </section>
  );
}
