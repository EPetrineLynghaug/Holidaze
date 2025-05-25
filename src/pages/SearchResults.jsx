import { useLocation } from "react-router-dom";
import AllVenues from "../pages/AllVenues";

export default function SearchResults() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const category = params.get("where") || "pets";  

  return <AllVenues initialCategory="pets" />;
}
