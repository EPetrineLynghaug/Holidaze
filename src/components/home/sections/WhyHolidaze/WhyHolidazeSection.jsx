
import React from 'react';

export default function WhyHolidazeSection() {
  const features = [
    {
      id: 1,
      iconName: 'language',
      title: 'Global Community',
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
      title: 'Host & make a difference',
      description: 'Share your home - create memories and extra income.',
    },
  ];

  return (
    <section className="mt-16 px-4 py-8 sm:py-12 bg-gray-50">
      {/* Section header */}
      <h2 className="text-2xl sm:text-2xl font-semibold text-center text-gray-900 mb-6">
        Why Holidaze?
      </h2>

      {/* Feature grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {features.map((f) => (
          <div key={f.id} className="flex items-start space-x-4">
            <span className="material-symbols-outlined w-8 h-8 text-[#5C50FF] flex-shrink-0">
              {f.iconName}
            </span>
            <div>
              <h3 className="text-lg sm:text-xl  text-gray-900 mb-0">
                {f.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {f.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="max-w-md mx-auto text-center mb-12 space-y-4">
        <img
          src="/images/venue.png"
          alt="Martin, host near Geiranger"
          className="mx-auto w-56 h-70 sm:w-64 sm:h-64 rounded-lg object-cover"
        />
        <blockquote className="relative px-4 italic text-gray-800 text-base sm:text-lg leading-relaxed before:content-['“'] before:absolute before:-left-2 before:-top-2 after:content-['”'] after:absolute after:-right-2 after:-bottom-0">
          Hosting through Holidaze gave me more than just bookings — it brought
          people, stories, and purpose into my everyday life.
        </blockquote>
        <p className="text-sm sm:text-base  text-gray-600">
          Martin, host near Geiranger
        </p>
      </div>

      {/* Call to action */}
      <div className="text-center mb-16 space-y-3">
        <button className="px-6 py-2 text-sm sm:text-base bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
          Start sharing your space
        </button>
        <p className="text-xs sm:text-sm text-gray-500">
          Your listing can be up in five minutes.
        </p>
      </div>
    </section>
  );
}
