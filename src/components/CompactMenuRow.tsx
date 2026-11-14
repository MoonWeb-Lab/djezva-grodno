import React from 'react';
import { motion } from 'framer-motion';
import { Coffee, SlidersHorizontal, Plus } from 'lucide-react';
import type { MenuItem } from '../types/menu';

interface CompactMenuRowProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onCustomize: (item: MenuItem) => void;
}

export const CompactMenuRow: React.FC<CompactMenuRowProps> = ({
  item,
  onAddToCart,
  onCustomize,
}) => {
  const hasCustomizableOptions = Boolean(
    item.options?.volumes ||
    item.options?.milk ||
    item.options?.syrups ||
    item.options?.addons
  );

  return (
    <article className="bg-white rounded-[20px] p-4 border border-[rgba(30,22,18,0.12)] shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
      <div className="flex flex-col gap-2 flex-1 justify-between">
        {/* Top Badges / Metadata */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            {item.badge && (
              <span className="rounded-full bg-[#8C3B2B] px-2.5 py-0.5 text-[10.5px] font-bold text-white tracking-wide">
                {item.badge}
              </span>
            )}
            {(item.volume || item.weight) && (
              <span className="rounded-full bg-[#FAF7F2] border border-[#D8CFC2] px-2.5 py-0.5 text-[11px] font-semibold text-[#6E655F]">
                {item.volume || item.weight}
              </span>
            )}
          </div>

          {/* Price inline for compact row */}
          <div className="flex items-baseline gap-1">
            <span className="text-[19px] font-extrabold text-[#1E1612]">
              {item.options?.volumes ? `от ${item.basePrice}` : item.basePrice}
            </span>
            <span className="text-[11px] font-bold text-[#8C3B2B]">BYN</span>
          </div>
        </div>

        {/* Title & Description */}
        <div>
          <h2 className="font-serif text-[17px] font-bold text-[#1E1612] leading-snug">
            {item.title}
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#6E655F]">
            {item.description}
          </p>
        </div>

        {/* Pairing Capsule */}
        {item.pairing && (
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-[#FAF7F2] border border-[#D8CFC2] px-3 py-1 text-[11px] text-[#4A1C1A] w-fit">
            <Coffee className="w-3 h-3 text-[#8C3B2B] shrink-0" />
            <span className="font-medium">{item.pairing}</span>
          </div>
        )}

        {/* Actions Row */}
        <div className="mt-2 pt-2.5 border-t border-[rgba(30,22,18,0.06)] flex items-center justify-end gap-2">
          {hasCustomizableOptions && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onCustomize(item)}
              aria-label={`Настроить ${item.title}`}
              className="inline-flex items-center gap-1 rounded-full bg-white border border-[#D8CFC2] px-3 py-1.5 text-[11.5px] font-medium text-[#4A1C1A] hover:bg-[#FAF7F2] shadow-sm transition-colors"
            >
              <SlidersHorizontal className="w-3 h-3 text-[#8C3B2B]" />
              <span>НАСТРОИТЬ</span>
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onAddToCart(item)}
            aria-label={`Добавить в заказ ${item.title}`}
            className="inline-flex items-center gap-1 rounded-full bg-[#F3ECE1] hover:bg-[#E7DDCF] active:bg-[#DBCDBB] px-3.5 py-1.5 text-[12px] font-bold text-[#1E1612] shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#8C3B2B]" />
            <span>В ЗАКАЗ</span>
          </motion.button>
        </div>
      </div>
    </article>
  );
};
