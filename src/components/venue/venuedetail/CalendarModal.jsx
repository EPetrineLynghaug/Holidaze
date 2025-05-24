import React, { useRef, useEffect, useMemo } from "react";
import BottomSheet from "../../ui/popup/BottomSheet";
import { DateRange } from "react-date-range";
import useWindowSize from "../../../hooks/utills/useWindowSize";
import BookingNextButton from "../../ui/buttons/BookingNextButton";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

// NOK-format-funksjon
const formatNOK = n =>
  `${new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 0 }).format(n)} NOK`;

export default function CalendarModal({
  selection,
  onSelectRange,
  disabledDates = [],
  onClose,
  onConfirm,
  pricePerNight,
  isInline = false,
}) {
  const ref = useRef(null);
  const { width } = useWindowSize();
  const isMobile = width < 600;

  const nights = useMemo(() => {
    const diffMs = selection.endDate - selection.startDate;
    const days = diffMs / (1000 * 60 * 60 * 24);
    return days > 0 ? Math.round(days) : 1;
  }, [selection]);

  const totalString = formatNOK(pricePerNight * nights);

  useEffect(() => {
    if (isInline) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, isInline]);

  const calendarClass = `
    p-2 bg-white rounded-xl shadow-lg ring-1 ring-gray-200
    [&_.rdrDateDisplayWrapper]:hidden
    [&_.rdrMonthName]:hidden
    [&_.rdrDays]:gap-1
    [&_.rdrWeekDays]:mb-1 [&_.rdrWeekDays]:text-xs
    [&_.rdrDayNumber span]:w-9 [&_.rdrDayNumber span]:h-9 [&_.rdrDayNumber span]:text-base
    [&_.rdrMonthAndYearPickers]:text-base
    transition-all
    flex flex-col justify-start items-center
    mx-auto
  `;

  // Inline (desktop)
  if (isInline) {
    return (
      <div
        ref={ref}
        className={calendarClass}
        style={{
          width: 330,
          height: 340,
          paddingBottom: "1.2rem",
          borderRadius: "1.25rem",
          boxShadow: "0 4px 32px 0 rgba(80,70,180,0.12)",
          border: "1px solid #F2F2F2",
        }}
        aria-label="Select date range"
      >
        <DateRange
          ranges={[selection]}
          onChange={(item) =>
            onSelectRange(item.selection.startDate, item.selection.endDate)
          }
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
    );
  }

  // Mobil/tablet modal
  return (
    <BottomSheet onClose={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Select date range"
        className={calendarClass}
        style={{
          width: isMobile ? "99vw" : "96vw",
          maxWidth: isMobile ? 340 : 400,
          borderRadius: "1.2rem",
          boxShadow: "0 4px 24px 0 rgba(80,70,180,0.10)",
        }}
      >
        <DateRange
          ranges={[selection]}
          onChange={(item) =>
            onSelectRange(item.selection.startDate, item.selection.endDate)
          }
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
      <div
        className={`
          fixed left-0 right-0 bottom-0
          bg-white/95
          rounded-b-[1.15rem]
          shadow-2xl
          z-[10000]
          text-center
          w-full
          flex justify-center
        `}
        style={{
          padding: isMobile
            ? "1.05rem 0 1.15rem 0"
            : "1.25rem 0 1.35rem 0",
          maxWidth: "100vw",
        }}
      >
      <div
  className={`
    fixed left-0 right-0 bottom-0
    bg-white/95
    rounded-b-[1.15rem]
    shadow-2xl
    z-[10000]
    text-center
    w-full
    px-4  
    pb-5   
  `}
>
  <BookingNextButton
    onClick={() => {
      onConfirm();
      onClose();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    ariaLabel={`Confirm booking for ${nights} night${nights > 1 ? "s" : ""}, total ${totalString}`}
    className="w-full max-w-sm mx-auto py-3"
  >
    Confirm · {totalString}
  </BookingNextButton>
</div>
      </div>
    </BottomSheet>
  );
}
