import { useNavigate } from "react-router-dom";
import HeroMobile from '../components/home/hero/mobile/HeroMobile';
import HeroDesktop from '../components/home/hero/desctop/HeroDesctop';
import SearchBox from '../components/home/hero/desctop/SearchBox';
import FeaturedExperiencesSection from '../components/home/sections/ExperienceCard/FeaturedExperiencesSection';
import WhyHolidazeSection from '../components/home/sections/WhyHolidaze/WhyHolidazeSection';
import MostPopularSection from '../components/home/sections/MostPopular/Destinations';

export default function Home() {
  const navigate = useNavigate();

  function handleSearch({ where, guests, when }) {
    navigate(
      `/search?where=${encodeURIComponent(where)}&guests=${guests}&when=${when}`
    );
  }

  return (
    <div className="font-figtree tracking-tight text-3xl">

{/* DESKTOP HERO */}
{/* DESKTOP HERO */}
<div className="hidden md:block relative w-screen h-[80vh] overflow-visible bg-black">
  {/* Kun video + overlay i egen wrapper med overflow-hidden */}
  <div className="absolute inset-0 overflow-hidden">
    <HeroDesktop className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
  </div>

  {/* Søkeboks som overlapper nederst */}
  <div
    className="
      absolute left-1/2 bottom-0
      w-full max-w-lg
      -translate-x-1/2 translate-y-1/2
      z-50
    "
  >
    <SearchBox onSearch={handleSearch} />
  </div>
</div>




      {/*** MOBILE HERO ***/}
      <div className="md:hidden">
        <HeroMobile onSearch={handleSearch} />
      </div>

      {/*** FEATURED EXPERIENCES ***/}
      <div className="max-w-screen-xl mx-auto px-4 pt-12 pb-16">
        <FeaturedExperiencesSection />
      </div>

      {/*** REST OF THE PAGE ***/}
      <main className="max-w-screen-xl mx-auto px-4 space-y-16 pb-16">
        <WhyHolidazeSection />
        <MostPopularSection />
      </main>
    </div>
  );
}
