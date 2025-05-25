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
    <section
      className="
        relative w-full overflow-hidden
        h-[55vh]
        md:h-[55vh]
        lg:h-[70vh]
      "
    >
      <div className="absolute inset-0 w-full h-full">
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            paddingTop: "56.25%", // 16:9 aspect ratio
          }}
        >
          {!showVideo ? (
            <img
              src="https://via.placeholder.com/1280x720?text=Video+Placeholder"
              alt="Fake video placeholder"
              className="absolute top-0 left-0 w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <iframe
              src="https://player.vimeo.com/video/1087466002?h=55ab3c81fe&badge=0&autopause=0&player_id=0&app_id=58479&controls=0&autoplay=1&muted=1&loop=1&background=1"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title="VideoHero"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          )}
        </div>
      </div>

      <div
        className="
          absolute bottom-0 left-0 w-full
          h-[20%] sm:h-[22%] md:h-[25%] lg:h-[25%]
          bg-gradient-to-b from-transparent to-[#f4e7d7]
          pointer-events-none z-10
        "
      />
    </section>
  );
}
