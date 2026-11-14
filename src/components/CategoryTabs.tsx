import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MenuCategory, MenuCategoryId } from '../types/menu';

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: MenuCategoryId;
  onSelectCategory: (id: MenuCategoryId) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active tab into view horizontally on mobile
  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const activeTabElement = scrollContainerRef.current.querySelector<HTMLElement>(
      `[data-category-id="${activeCategory}"]`
    );
    if (activeTabElement) {
      const container = scrollContainerRef.current;
      const scrollLeft =
        activeTabElement.offsetLeft - container.offsetWidth / 2 + activeTabElement.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeCategory]);

  return (
    <nav
      aria-label="Категории меню"
      className="sticky top-0 z-30 w-full bg-[#F6F2EB]/95 backdrop-blur-md border-b border-[#1E1612]/8 py-2.5 px-3 md:px-8"
    >
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 md:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth md:justify-center"
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              data-category-id={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`relative px-3.5 py-1.5 text-[13px] font-semibold rounded-full whitespace-nowrap transition-colors duration-200 shrink-0 ${
                isActive
                  ? 'text-white'
                  : 'text-[#6E655F] hover:text-[#1E1612] bg-[#FAF7F2] border border-[#1E1612]/6'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryIndicator"
                  className="absolute inset-0 rounded-full bg-[#8C3B2B] shadow-sm -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {category.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
