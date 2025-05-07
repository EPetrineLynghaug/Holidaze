import React, { useRef, useEffect, useMemo } from "react";
import BottomSheet from "../mobildemodal/BottomSheet";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


// En enkel NOK → USD-konverterer
const NOK_TO_USD = 0.1;
const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n * NOK_TO_USD);

export default function CalendarPicker({
  selection,
  onSelectRange,
  disabledDates,
  mergedBookingRange,
  onClose,
  onConfirm,
  pricePerNight,
}) {
  const ref = useRef(null);

  // Lukk når man klikker utenfor
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Antall netter (min 1)
  const nights = useMemo(() => {
    const diff =
      (selection.endDate.getTime() - selection.startDate.getTime()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.round(diff) : 1;
  }, [selection]);

  // Totalpris
  const total = pricePerNight * nights;
  const totalString = usd(total);

  return (
    <BottomSheet onClose={onClose}>
      {/* Kalenderboksen */}
      <div
        ref={ref}
        className="
          p-3 mx-4 my-4 bg-white rounded-2xl shadow-lg ring-1 ring-gray-200
          [&_.rdrDateDisplayWrapper]:hidden
          [&_.rdrDays]:gap-2
          [&_.rdrWeekDays]:mb-2 [&_.rdrWeekDays]:text-base
          [&_.rdrDayNumber span]:w-14 [&_.rdrDayNumber span]:h-14 [&_.rdrDayNumber span]:text-xl
          [&_.rdrMonthAndYearPickers]:text-base
        "
      >
        <DateRange
          ranges={mergedBookingRange ? [selection, mergedBookingRange] : [selection]}
          onChange={(item) =>
            onSelectRange(item.selection.startDate, item.selection.endDate)
          }
          disabledDates={disabledDates}
          months={1}
          direction="horizontal"
          showMonthAndYearPickers={false}
          showPreview={false}
          showDateDisplay={false}
          rangeColors={["#3E35A2", "#3E35A2"]}
          minDate={new Date()}
        />
      </div>

      {/* Confirm-knapp */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-r from-[#3E35A2] to-[#5939aa] px-6 py-4">
        <button
          onClick={() => {
            onConfirm();
            onClose();
            // rull deg tilbake til toppen av VenueDetail
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="
            w-full bg-transparent text-white text-lg font-semibold
            rounded-xl shadow-2xl hover:opacity-90 transition-opacity duration-200
          "
        >
          Confirm · {totalString}
        </button>
      </div>
    </BottomSheet>
  );
}
