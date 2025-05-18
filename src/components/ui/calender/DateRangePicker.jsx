import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';


export default function DateRangePicker({
  value,            
  onChange,         
  bookingRanges = [],
  disabledDates = [],
  minDate = new Date(),
  className = '',
}) {
  const { startDate, endDate } = value;
  const rentalDays = Math.max(
    1,
    Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  );

  const ranges = [
    ...bookingRanges.map(r => ({ ...r, color: '#f56565', disabled: true })),
    { startDate, endDate, key: 'selection' },
  ];

  const handleSelect = ({ selection }) => {
    const s = selection.startDate;
    const e = selection.endDate;
    const days = Math.max(
      1,
      Math.ceil((e - s) / (1000 * 60 * 60 * 24))
    );
    onChange({ startDate: s, endDate: e, rentalDays: days });
  };

  // tablet & up breakpoint
  const [isMdUp, setIsMdUp] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const onMq = e => setIsMdUp(e.matches);
    mql.addEventListener('change', onMq);
    return () => mql.removeEventListener('change', onMq);
  }, []);

  // shared summary JSX
  const Summary = (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-purple-700 text-lg font-semibold mb-4">
        Selected Dates
      </h3>
      <p className="text-gray-800 mb-2">
        <strong>From:</strong> {startDate.toLocaleDateString()}
      </p>
      <p className="text-gray-800 mb-2">
        <strong>To:</strong> {endDate.toLocaleDateString()}
      </p>
      <p className="text-gray-800">
        <strong>Total nights:</strong> {rentalDays}
      </p>
    </div>
  );

  return (
    <div className={`w-full ${className}`}>
      {isMdUp ? (
        <div className="flex gap-6">
          {/* Calendar 50% */}
          <div className="w-1/2 rounded-lg shadow-md overflow-hidden">
            <DateRange
              ranges={ranges}
              onChange={handleSelect}
              editableDateInputs={false}
              showDateDisplay={false}
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={true}
              minDate={minDate}
              disabledDates={disabledDates}
              months={1}
              direction="vertical"
              className="w-full"
            />
          </div>
          {/* Summary 50% */}
          <div className="w-1/2 sticky top-4">
            {Summary}
          </div>
        </div>
      ) : (
        <>
          {/* Mobile: full-width calendar */}
          <div className="rounded-lg shadow-md overflow-hidden">
            <DateRange
              ranges={ranges}
              onChange={handleSelect}
              editableDateInputs={false}
              showDateDisplay={false}
              moveRangeOnFirstSelection={false}
              retainEndDateOnFirstSelection={true}
              minDate={minDate}
              disabledDates={disabledDates}
              months={1}
              direction="vertical"
              className="w-full"
            />
          </div>
          {/* Pill summary */}
          <div className="flex justify-center w-full mt-4">
            <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full shadow-inner text-sm font-medium">
              From {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()} — {rentalDays}{' '}
              {rentalDays === 1 ? 'day' : 'days'}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
