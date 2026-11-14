import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowDown } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="relative w-full px-3 pt-3">
      <div className="relative h-[300px] w-full overflow-hidden rounded-[24px] shadow-lg border border-[#1E1612]/10">
        {/* Background Atmosphere Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/logo.jpg"
        >
          <source src="/videos/atmosphere.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1612]/95 via-[#1E1612]/45 to-black/20" />

        {/* Top Header Row with Status & Instagram */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-[#1E1612] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Clock className="w-3 h-3 text-[#8C3B2B]" />
            <span>Открыто · 08:00–23:00</span>
          </div>

          <a
            href="https://instagram.com/djezva_grodno"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram кофейни Джезва"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-[#1E1612] hover:text-[#8C3B2B] shadow-sm transition-colors"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom Content & CTA */}
        <div className="absolute bottom-3.5 inset-x-3.5 z-10 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#F3ECE1] uppercase">
              ДЖЕЗВА · GRODNO
            </span>
          </div>

          <h1 className="font-serif text-[23px] sm:text-[25px] font-bold leading-tight text-white drop-shadow-sm">
            Кофе на песке и блинная во дворике
          </h1>

          <div className="flex items-center gap-1 text-[12px] text-[#F3ECE1]/90 mt-1 mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#E68A77] shrink-0" />
            <span>Гродно, ул. Советская, 5</span>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onExploreClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8C3B2B] hover:bg-[#722F22] text-white px-4 py-2 text-[13px] font-semibold shadow-md transition-colors"
            >
              <span>Выбрать блюда</span>
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
            </motion.button>
            <div className="text-[11px] text-[#FAF7F2]/80 italic">
              Быстрый предзаказ и доставка
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
