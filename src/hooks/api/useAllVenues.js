import { useState, useEffect, useRef } from "react";
import { VENUES_URL } from "../../components/constants/api";

// Husk å ta med denne!
const categoryKeys = [
  "beach",
  "cabin",
  "ski",
  "city",
  "mountain",
  "lake",
  "desert",
  "forest",
  "island",
  "countryside",
  "farm",
  "luxury",
  "historical",
  "pets",
  "wifi",
  "parking",
  "family",
  "all_inclusive",
];

export function useAllVenues(limit = 100) {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isFirst = useRef(true);

  const fetchVenues = async ({ pageNum = 1, replace = false }) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `${VENUES_URL}?limit=${limit}&page=${pageNum}&sort=created&sortOrder=desc`
      );
      if (!resp.ok) throw new Error(`Error ${resp.status}`);
      const { data } = await resp.json();
      const enhanced = data.map((item) => {
        const randomCat =
          categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const randomMeta = {
          wifi: Math.random() < 0.5,
          pets: Math.random() < 0.5,
          parking: Math.random() < 0.5,
          ...item.meta,
        };
        return {
          ...item,
          category: randomCat,
          meta: randomMeta,
        };
      });
      setVenues((prev) => (replace ? enhanced : [...prev, ...enhanced]));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFirst.current) {
      fetchVenues({ pageNum: 1, replace: true });
      isFirst.current = false;
    } else {
      fetchVenues({ pageNum: page, replace: page === 1 });
    }
    // eslint-disable-next-line
  }, [page]);

  return {
    venues,
    setVenues,
    page,
    setPage,
    loading,
    error,
    fetchVenues,
  };
}
