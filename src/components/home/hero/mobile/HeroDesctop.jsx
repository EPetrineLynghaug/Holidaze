import React from "react";

export default function HeroDesktop() {
  const [showVideo, setShowVideo] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setShowVideo(true);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative w-full overflow-hidden aspect-video">
      {/* Bilde for mobil (sm og mindre) */}
      <div className="block md:hidden absolute inset-0 w-full h-full">
        <img
          src="/images/heroMobile.webp"
          alt="Hero mobile"
          className="w-full h-full object-cover"
          loading="eager"
          onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/placeholderMovie.webp"; }}
        />
      </div>
      
      {/* Video for tablet og desktop (md og opp) */}
      <div className="hidden md:block absolute inset-0 w-full h-full">
        {!showVideo ? (
          <img
            src="/images/heroVideoFallback.webp"
            alt="Hero video fallback"
            className="w-full h-full object-cover"
            loading="eager"
            onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = "/images/placeholderMovie.webp"; }}
          />
        ) : (
          <iframe
            src="https://player.vimeo.com/video/1087466002?h=55ab3c81fe&badge=0&autopause=0&player_id=0&app_id=58479&controls=0&autoplay=1&muted=1&loop=1&background=1"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            title="Hero video"
            className="w-full h-full object-cover"
            style={{ border: "none" }}
          />
        )}
      </div>
      
      {/* Gradient overlay */}
      <div
        className="
          absolute bottom-0 left-0 w-full
          h-[25%] bg-gradient-to-b from-transparent to-[#f4e7d7]
          pointer-events-none z-10
        "
      />
    </section>
  );
}
