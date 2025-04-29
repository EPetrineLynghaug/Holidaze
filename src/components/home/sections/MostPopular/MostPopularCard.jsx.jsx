import React from 'react';
import { motion } from 'framer-motion';
export default function MostPopularCard({ img, title, tag, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative w-full h-full rounded-[24px] overflow-hidden shadow-md"
    >
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover"
      />

      <div
        className="absolute top-3 left-3 px-3 py-[4px] rounded-full text-[11px] font-medium text-white"
        style={{ backgroundColor: '#AC8341EB' }}
      >
        • {tag}
      </div>

      <div className="absolute bottom-3 left-3 right-3 bg-black/70 text-white text-[11px] font-normal px-4 py-2 rounded-full">
        {subtitle}
      </div>
    </motion.div>
  );
}