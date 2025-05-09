import React from 'react';
import { ENV_OPTIONS, AUD_OPTIONS, FAC_OPTIONS } from '../../constants/VenueFormConfig';


const STAT_OPTIONS = [
  { key: 'guests', icon: 'person', labelKey: 'maxGuests' },
  { key: 'beds', icon: 'bed', labelKey: 'maxGuests' },
  { key: 'bath', icon: 'shower', label: '1 bath' },
  { key: 'car', icon: 'directions_car', label: '1 garage' },
];

export function StatsIcons({ maxGuests }) {
  return (
    <div className="border-t  border-b border-[var(--color-border-soft)] py-6 my-4">
      <ul className="flex justify-around text-gray-600">
        {STAT_OPTIONS.map((option) => {
          const { key, icon, label, labelKey } = option;
          const text = labelKey === 'maxGuests'
            ? `${maxGuests} ${key === 'beds' ? 'beds' : 'guests'}`
            : label;
          return (
            <li key={key} className="flex flex-col items-center gap-2">
              <span className="material-symbols-outlined  mb-1" style={{ fontVariationSettings: " 'wght' 300,  'opsz' 32" }}>
              {icon}
            </span>
              <span className="text-xs leading-tight">{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function MetadataList({ meta }) {
  const renderOptions = (options) => {
    return options
      .filter((opt) => meta && meta[opt.key])
      .map((opt) => (
        <li key={opt.key} className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xl">{opt.icon}</span>
          <span className="text-sm text-gray-800">{opt.label}</span>
        </li>
      ));
  };

  return (
    <div className="mt-4">
      <h2 className="text-base font-semibold mb-2">Metadata</h2>
      <ul className="flex flex-wrap gap-4 text-gray-600">
        {renderOptions(ENV_OPTIONS)}
        {renderOptions(AUD_OPTIONS)}
        {renderOptions(FAC_OPTIONS)}
      </ul>
    </div>
  );
}

export default StatsIcons;
