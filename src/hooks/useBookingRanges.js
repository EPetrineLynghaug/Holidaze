
import { useMemo } from "react";


export default function useBookingRanges(bookings = []) {
  return useMemo(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) {
      return { bookingRanges: [], disabledDates: [] };
    }


    const bookingRanges = bookings.map(({ dateFrom, dateTo }, i) => ({
      startDate: new Date(dateFrom),
      endDate: new Date(dateTo),
      key: `booked-${i}`,
    }));

  
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
