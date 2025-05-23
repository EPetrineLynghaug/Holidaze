import { useNavigate } from "react-router";
import MobileCloseButton from "../buttons/MobileCloseButton";

export default function BookingSuccessPopup({
  message = "You’ll find your bookings under Dashboard on your profile.",
  onClose,
  to = "/profile", 
}) {
  const navigate = useNavigate();

  const handleGo = () => {
    if (to) {
      navigate(to, { replace: true });
    }
    if (onClose) onClose();
  };

  // Knappetekst
  const buttonText = to ? "Go to profile" : "Close";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
        <MobileCloseButton
          onClick={onClose}
          className="!absolute !top-2 !right-2 w-8 h-8"
        />
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
          <span className="material-symbols-outlined text-4xl text-[#3E35A2]">
            check
          </span>
        </div>
        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          Thanks for your booking!
        </h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <button
          onClick={handleGo}
          className="mt-6 w-full py-2 rounded-lg bg-[#3E35A2] hover:bg-[#5939aa] text-white font-medium"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
