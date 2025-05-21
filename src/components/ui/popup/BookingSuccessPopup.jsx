
import { useNavigate } from "react-router";

/**
 * @param {string}  message – body text (optional; defaults to dashboard note)
 * @param {() => void} onClose – runs after navigation / when X is clicked
 * @param {string} [to] – route to profile (default "/profile")
 */
export default function BookingSuccessPopup({
  message = "You’ll find your bookings under Dashboard on your profile.",
  onClose,
  to = "/profile",
}) {
  const navigate = useNavigate();

  const handleGo = () => {
    navigate(to, { replace: true });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative w-11/12 max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center">
        {/* close (X) */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* success icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
          <span className="material-symbols-outlined text-4xl text-[#3E35A2]">
            check
          </span>
        </div>

        {/* heading */}
        <h2 className="mt-4 text-lg font-semibold text-gray-800">
          Thanks for your booking!
        </h2>

        {/* body */}
        <p className="mt-2 text-sm text-gray-600">{message}</p>

        {/* CTA */}
        <button
          onClick={handleGo}
          className="mt-6 w-full py-2 rounded-lg bg-[#3E35A2] hover:bg-[#5939aa] text-white font-medium"
        >
          Go to profile
        </button>
      </div>
    </div>
  );
}
