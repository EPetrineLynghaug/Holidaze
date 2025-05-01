
import React from 'react';
import HeroMobile from '../components/home/hero/mobile/HeroMobile';
import FeaturedExperiencesSection from '../components/home/sections/ExperienceCard/FeaturedExperiencesSection';
import WhyHolidazeSection from '../components/home/sections/WhyHolidaze/WhyHolidazeSection';
import MostPopularSection from '../components/home/sections/MostPopular/MostPopularSection';


export default function Home() {
  return (
    <div  className="font-figtree tracking-10p text-3xl">
         <HeroMobile />
         <FeaturedExperiencesSection />
         <WhyHolidazeSection />
         <MostPopularSection />
         
    </div>
  );
}
