import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowDown } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { assetUrl } from '../utils/assets';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  return (
    <section className="relative w-full px-3 md:px-6 pt-3 md:pt-6">
      {/* ============================================================ */}
      {/* MOBILE HERO (< 768px): Exact original mobile design preserved */}
      {/* ============================================================ */}
      <div className="relative md:hidden h-[300px] w-full overflow-hidden rounded-[24px] shadow-lg border border-[#1E1612]/10">
        {/* Background Atmosphere Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          poster={assetUrl('images/logo.jpg')}
        >
          <source src={assetUrl('videos/atmosphere.mp4')} type="video/mp4" />
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

      {/* ============================================================ */}
      {/* DESKTOP HERO (>= 768px): Responsive 2-column layout           */}
      {/* ============================================================ */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-8 md:items-center bg-[#FAF7F2] p-6 lg:p-8 rounded-[32px] border border-[#1E1612]/10 shadow-sm">
        {/* Left Column: Atmosphere Video without cutoff */}
        <div className="relative aspect-[9/16] max-h-[440px] w-full max-w-[320px] mx-auto rounded-[24px] overflow-hidden shadow-md border border-[#1E1612]/10 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster={assetUrl('images/logo.jpg')}
          >
            <source src={assetUrl('videos/atmosphere.mp4')} type="video/mp4" />
          </video>
        </div>

        {/* Right Column: Status, Logo, Serif Headline, Address, CTA */}
        <div className="flex flex-col justify-center space-y-4 lg:space-y-5">
          {/* Status & Instagram */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12px] font-semibold text-[#1E1612] shadow-xs border border-[#1E1612]/8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Clock className="w-3.5 h-3.5 text-[#8C3B2B]" />
              <span>Открыто · 08:00–23:00</span>
            </div>

            <a
              href="https://instagram.com/djezva_grodno"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram кофейни Джезва"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#1E1612]/8 text-[#1E1612] hover:text-[#8C3B2B] text-[12px] font-semibold shadow-xs transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@djezva_grodno</span>
            </a>
          </div>

          {/* Logo & Brand title */}
          <div className="flex items-center gap-3">
            <img
              src={assetUrl('images/logo.jpg')}
              alt="Логотип Джезва"
              className="w-12 h-12 rounded-full object-cover border border-[#1E1612]/15 shadow-xs"
            />
            <div>
              <span className="text-[12px] font-bold tracking-[0.25em] text-[#8C3B2B] uppercase">
                ДЖЕЗВА · GRODNO
              </span>
              <div className="text-[13px] text-[#6E655F]">
                Спешелти-кофейня & гастро-бистро
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[32px] lg:text-[38px] font-bold leading-[1.18] text-[#1E1612]">
            Кофе на песке и блинная во дворике
          </h1>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-[14px] text-[#6E655F]">
            <MapPin className="w-4 h-4 text-[#8C3B2B] shrink-0" />
            <span className="font-medium">Гродно, ул. Советская, 5</span>
          </div>

          <p className="text-[13.5px] leading-relaxed text-[#6E655F]">
            Настоящий кофе по-восточному на горячем песке, авторские напитки и сытные крафтовые крепы в самом атмосферном дворике исторического центра Гродно.
          </p>

          {/* CTA Button */}
          <div className="pt-2 flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onExploreClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8C3B2B] hover:bg-[#722F22] text-white px-6 py-3 text-[14px] font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Выбрать блюда</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </motion.button>
            <div className="text-[12px] text-[#6E655F] italic">
              Быстрый предзаказ «с собой» и доставка
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
