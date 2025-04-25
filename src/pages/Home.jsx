
import React from 'react';
import HeroMobile from '../components/home/hero/HeroMobile';
import FeaturedExperiencesSection from '../components/home/sections/ExperienceCard/FeaturedExperiencesSection';


export default function Home() {
  return (
    <div  className="font-figtree tracking-10p text-3xl">
         <HeroMobile />
         <FeaturedExperiencesSection />
         
    </div>
  );
}
