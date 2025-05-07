import { useMemo } from "react";

export default function useStars(rating = 0, max = 5) {
  return useMemo(() => {
    const arr = [];
    for (let i = 1; i <= max; i++) {
      if (rating >= i - 0.25) arr.push("full");
      else if (rating >= i - 0.75) arr.push("half");
      else arr.push("empty");
    }
    return arr;
  }, [rating, max]);
}
