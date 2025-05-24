// src/hooks/auth/useAuthErrorMessage.js
export default function useAuthErrorMessage() {
  return (error) => {
    if (!error || typeof error !== "object") return "Something went wrong";

    if (error.status === 401) return "Incorrect email or password.";
    if (error.status === 404) return "User not found.";
    if (error.status === 500) return "Server error. Please try again later.";

    return error.message || "Login failed. Please try again.";
  };
}
