import BookingBarButton from "../../ui/buttons/BookingBarButton";

export default function BookingBar({
  priceString,
  nights,
  onBook,
  submitting,
}) {
  return (
    <div className="
      fixed bottom-0 inset-x-0 w-full bg-white p-4 shadow-lg flex items-center border-t border-[var(--color-border-soft)]
      md:py-5
    ">
      <BookingBarButton onClick={onBook} disabled={submitting} submitting={submitting}>
        {submitting ? "Booking…" : "Book now"}
      </BookingBarButton>
      <div className="ml-auto flex items-baseline space-x-1">
        <span className="text-lg font-bold">{priceString}</span>
        <span className="text-sm text-gray-500">
          {nights > 1 ? " / total" : " / night"}
        </span>
      </div>
    </div>
  );
}