import React from 'react';

export default function WhyHolidazeFeature({ iconName, title, description }) {
  return (
    <div className="flex items-start space-x-3">
      <span
        className="material-symbols-outlined w-6 h-6 text-indigo-600 flex-shrink-0"
      >
        {iconName}
      </span>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
