
import HeroMobile from '../components/home/hero/mobile/HeroMobile';
import HeroDesktop from '../components/home/hero/mobile/HeroDesctop';
import SearchBox from '../components/home/hero/mobile/SearchBox';

import FeaturedExperiencesSection from '../components/home/sections/ExperienceCard/FeaturedExperiencesSection';
import WhyHolidazeSection from '../components/home/sections/WhyHolidaze/WhyHolidazeSection';
import MostPopularSection from '../components/home/sections/MostPopular/Destinations';

export default function Home() {
  return (
    <div className="font-figtree tracking-10p text-3xl">

<div className="hidden md:block relative min-h-[55vh] md:min-h-[65vh] lg:min-h-[80vh] bg-gradient-to-b from-[#dec5a2] via-[#f4e7d7] to-[#FAFAFA]">

        <HeroDesktop />

    
        <div
          className={`
            absolute left-1/2 z-30 w-[90%] max-w-3xl
            md:bottom-[50vh]    
            lg:bottom-[46vh]   
            transform -translate-x-1/2 -translate-y-1/2
          `}
        >
          <SearchBox />
        </div>

        <div className="w-full max-w-screen-xl mx-auto px-4 pt-[25vh] pb-16">
          <FeaturedExperiencesSection />
        </div>
      </div>


      <div className="block md:hidden">
        <HeroMobile />
        <div className="w-full max-w-screen-xl mx-auto px-4 pt-8 pb-16">
          <FeaturedExperiencesSection />
        </div>
      </div>

 
      <main className="w-full max-w-screen-xl mx-auto px-4 space-y-16 pb-16">
        <WhyHolidazeSection />
        <MostPopularSection />
      </main>

    </div>
  );

}


