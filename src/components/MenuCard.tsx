import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, SlidersHorizontal, Plus } from 'lucide-react';
import type { MenuItem } from '../types/menu';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
  index: number;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onAddToCart,
  onCustomize,
  index,
}) => {
  const isPriority = index < 2;

  return (
    <article className="group bg-white rounded-[24px] overflow-hidden border border-[rgba(30,22,18,0.12)] shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
      {/* Top Photo with Floating Capsules */}
      {item.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2]">
          <img
            src={item.image}
            alt={item.title}
            loading={isPriority ? 'eager' : 'lazy'}
            decoding="async"
            style={{ objectPosition: item.imagePosition || 'center center' }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Top Left Capsule: Weight or Volume */}
          {(item.weight || item.volume) && (
            <div className="absolute top-3 left-3 z-10 rounded-full bg-[#F6F2EB]/95 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-[#1E1612] shadow-sm border border-[#1E1612]/8">
              {item.weight || item.volume}
            </div>
          )}

          {/* Floating Top Right Capsule: Status / Badge */}
          {item.badge && (
            <div className="absolute top-3 right-3 z-10 rounded-full bg-[#8C3B2B] px-3 py-1 text-[11px] font-bold text-white shadow-sm tracking-wide">
              {item.badge}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h2 className="font-serif text-[20px] font-bold text-[#1E1612] leading-snug">
            {item.title}
          </h2>

          <p className="mt-2 text-[13.5px] leading-relaxed text-[#6E655F] line-clamp-3">
            {item.description}
          </p>

          {/* Pairing Recommendation Capsule */}
          {item.pairing && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] border border-[#D8CFC2] px-3 py-1 text-[11.5px] text-[#4A1C1A]">
              <Coffee className="w-3.5 h-3.5 text-[#8C3B2B] shrink-0" />
              <span className="font-medium truncate">{item.pairing}</span>
            </div>
          )}
        </div>

        {/* Card Footer: Separated by border-t */}
        <div className="mt-4 pt-3.5 border-t border-[rgba(30,22,18,0.08)] flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-[22px] font-extrabold tracking-tight text-[#1E1612]">
              {item.options?.volumes ? `от ${item.basePrice}` : item.basePrice}
            </span>
            <span className="text-[12px] font-bold text-[#8C3B2B]">BYN</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onCustomize(item)}
              aria-label={`Настроить ${item.title}`}
              className="inline-flex items-center gap-1 rounded-full bg-white border border-[#D8CFC2] px-3 py-1.5 text-[12px] font-medium text-[#4A1C1A] hover:bg-[#FAF7F2] shadow-sm transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#8C3B2B]" />
              <span>НАСТРОИТЬ</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onAddToCart(item)}
              aria-label={`Добавить в заказ ${item.title}`}
              className="inline-flex items-center gap-1 rounded-full bg-[#F3ECE1] hover:bg-[#E7DDCF] active:bg-[#DBCDBB] px-3.5 py-1.5 text-[12.5px] font-bold text-[#1E1612] shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#8C3B2B]" />
              <span>В ЗАКАЗ</span>
            </motion.button>
          </div>
        </div>
      </div>
    </article>
  );
};
