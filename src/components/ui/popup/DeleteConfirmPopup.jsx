import React from "react";
import MobileCloseButton from "../buttons/MobileCloseButton"; // Husk riktig path!

export default function DeleteConfirmPopup({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
        {/* Mobile Close Button */}
        <MobileCloseButton
          onClick={onCancel}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2"
        />

        {/* Alert Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <span className="material-symbols-outlined text-4xl text-red-600">
            warning
          </span>
        </div>

        {/* Heading */}
        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          Are you sure?
        </h2>

        {/* Body text */}
        <p className="mt-2 text-sm text-gray-600">
          This action will permanently delete the item. You cannot undo this.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
