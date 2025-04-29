import  { useEffect, useRef, useState } from 'react';
import MostPopularCard from './MostPopularCard.jsx';

const items = [
    {
      img: '/images/cozy-house.png',
      title: 'Cozy House',
      tag: 'Most Booked',
      subtitle: 'Saved 1.2K times this month',
    },
    {
      img: '/images/underwater-hotell.png',
      title: 'Underwater Hotel',
      tag: 'Most Viewed',
      subtitle: 'Over 10K views this week',
    },
    {
      img: '/images/cabin-snow.png',
      title: 'Cozy Cabin',
      tag: 'Top Rated',
      subtitle: '300+ five-star reviews',
    },
  ];
  
  export default function MostPopularSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
  
    const handleScroll = () => {
      const container = containerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const cardWidth = container.scrollWidth / items.length;
      const center = scrollLeft + containerWidth / 2;
      const index = Math.floor(center / cardWidth);
      setActiveIndex(index);
    };
  
    return (
      <section className="bg-white py-4">
        <div className="px-4 mb-4">
          <h2 className="text-xl font-semibold mb-1">
            Most Popular Right Now
          </h2>
          <p className="text-sm text-gray-500">
            Curated by travelers. Loved by thousands.
          </p>
        </div>
  
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide px-4 space-x-2 touch-auto"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`shrink-0 w-[70%] max-w-[240px] aspect-square snap-center transition-transform duration-300 ${
                index === activeIndex ? 'scale-100' : 'scale-95'
              }`}
            >
              <MostPopularCard {...item} />
            </div>
          ))}
        </div>
      </section>
    );
  }