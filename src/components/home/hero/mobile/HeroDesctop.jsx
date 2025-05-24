export default function HeroDesktop() {
  return (
    <section
      className="
        relative w-full overflow-hidden
        h-[55vh]    
        md:h-[60vh] 
        lg:h-[75vh] 
      "
    >
      <video
        className="
          absolute inset-0
          w-full h-full
          object-cover
          object-center       
          md:object-[center_20%] 
          lg:object-center     
        "
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/VideoHero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className="
          absolute bottom-0 left-0 w-full
          h-[15vh] sm:h-[18vh] md:h-[20vh] lg:h-[22vh]
          bg-gradient-to-b from-transparent to-[#f4e7d7]
          pointer-events-none z-10
        "
      />
    </section>
  );
}
