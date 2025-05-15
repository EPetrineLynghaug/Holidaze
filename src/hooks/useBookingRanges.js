import { useMemo } from "react";

export default function useBookingRanges(bookings = []) {
  return useMemo(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return { bookingRanges: [], disabledDates: [] };
    }

    const bookingRanges = bookings.map(({ dateFrom, dateTo }, i) => {
      const start = new Date(dateFrom);
      const end = new Date(dateTo);
      return {
        startDate: start,
        endDate: end,
        key: `booked-${i}`,
        color: "#f56565", 
        disabled: true,
      };
    });

    const disabledDates = bookingRanges.flatMap(({ startDate, endDate }) => {
      const dates = [];
      const cur = new Date(startDate);
      while (cur <= endDate) {
        dates.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
      }
      return dates;
    });

    return { bookingRanges, disabledDates };
  }, [bookings]);
}
