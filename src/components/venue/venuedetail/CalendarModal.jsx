

import React, { useRef, useEffect, useMemo } from "react";
import BottomSheet from "../../ui/mobildemodal/BottomSheet";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


const NOK_TO_USD = 0.1;
const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n * NOK_TO_USD);

export default function CalendarModal({
  selection,
  onSelectRange,
  disabledDates = [],
  onClose,
  onConfirm,
  pricePerNight,
}) {
  const ref = useRef(null);

  // Antall netter (minst 1)
  const nights = useMemo(() => {
    const diffMs = selection.endDate - selection.startDate;
    const days = diffMs / (1000 * 60 * 60 * 24);
    return days > 0 ? Math.round(days) : 1;
  }, [selection]);

  const totalString = usd(pricePerNight * nights);

  // Lukk på klikk utenfor
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <BottomSheet onClose={onClose}>
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
          // Kun ditt eget utvalg som markeres
          ranges={[selection]}
          onChange={(item) =>
            onSelectRange(item.selection.startDate, item.selection.endDate)
          }
          // Disable alle bookede datoer som grå bokser
          disabledDates={disabledDates}
          months={1}
          direction="horizontal"
          showMonthAndYearPickers={false}
          showPreview={false}
          showDateDisplay={false}
          rangeColors={["#3E35A2"]}
          minDate={new Date()}
        />
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-r from-[#3E35A2] to-[#5939aa] px-6 py-4">
        <button
          onClick={() => {
            onConfirm();
            onClose();
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
