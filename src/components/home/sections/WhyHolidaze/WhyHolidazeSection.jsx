import WhyHolidazeFeature from './WhyHolidazeFeature';
export default function WhyHolidazeSection() {
  const features = [
    {
      id: 1,
      iconName: 'language',
      title: 'Global community',
      description: 'Be a part of thousands travelling and sharing places.',
    },
    {
      id: 2,
      iconName: 'king_bed',
      title: 'Unique stays',
      description: 'From beachfront villas to treehouses.',
    },
    {
      id: 3,
      iconName: 'star',
      title: 'Personalize your trip',
      description: 'Find places and experiences that match your style.',
    },
    {
      id: 4,
      iconName: 'handshake',
      title:  'Host & create impact',
      description: 'Share your home - create memories and extra income.',
    },
  ];

  return (
    <section className=" p-12">
      {/* Overskrift */}
      <h2 className="font-figtree text-3xl font-semibold text-gray-900 text-center md:text-left mb-12">
        Why Holidaze?
      </h2>
{/* Features */}
<div className="grid gap-y-10 gap-x-6 sm:gap-x-8 md:gap-x-10 lg:gap-x-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-20">

  {features.map((f) => (
    <WhyHolidazeFeature
      key={f.id}
      iconName={f.iconName}
      title={f.title}
      description={f.description}
    />
  ))}
</div>

      {/* Testimonial + Bilde */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 mb-12">
        {/* Bilde */}
        <div className="flex justify-center md:justify-end">
          <img
            src="/images/venue.png"
            alt="Martin, host near Geiranger"
            className="w-72 h-72 md:w-80 md:h-80 object-cover rounded-xl shadow"
          />
        </div>

        {/* Sitat */}
  <div className="text-center md:text-left max-w-sm mx-auto md:mx-0 flex flex-col justify-center md:h-80">

          <blockquote className="relative italic text-gray-800 text-[18px] leading-relaxed px-2 max-w-[26ch]">
            <span className="absolute -top-4 -left-4 text-3xl text-gray-300">❝</span>
            <p className="mt-6 mb-4 whitespace-pre-line">
              Hosting through Holidaze
              {'\n'}gave me more than just bookings.
              {'\n\n'}It brought people, stories,
              {'\n'}and purpose into my everyday life.
            </p>
            <span className="absolute bottom-3 right-1 text-2xl text-gray-300">❞</span>
          </blockquote>
          <p className="mt-2 text-sm text-gray-600">Martin, host near Geiranger</p>
        </div>
      </div>
  <div className="text-center mt-4 sm:mt-6 md:mt-8">
        <button
          className="
            px-10 py-2 text-sm
            sm:px-8 sm:py-2.7 sm:text-base
            md:px-10 md:py-3 md:text-base
            lg:px-12 lg:py-3.5 lg:text-lg
            bg-indigo-600 text-white font-medium rounded-md
            hover:bg-indigo-700 transition
            mb-4 sm:mb-0
          "
        >
          Start sharing your space
        </button>
        <p className="mt-2 text-xs sm:text-sm text-gray-500">
          Your listing can be up in five minutes.
        </p>
      </div>
    </section>
  );
}

