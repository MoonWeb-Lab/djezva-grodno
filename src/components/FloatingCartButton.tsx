import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight } from 'lucide-react';

interface FloatingCartButtonProps {
  totalCount: number;
  totalPrice: number;
  onClick: () => void;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({
  totalCount,
  totalPrice,
  onClick,
}) => {
  return (
    <AnimatePresence>
      {totalCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-4 inset-x-0 mx-auto max-w-[430px] px-4 z-40 pointer-events-auto"
        >
          <motion.button
            data-testid="floating-cart-btn"
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            aria-label={`Корзина: ${totalCount} позиций на сумму ${totalPrice.toFixed(1)} BYN`}
            className="w-full flex items-center justify-between bg-[#8C3B2B] hover:bg-[#783023] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-white/15 backdrop-blur-md transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[15px]">Корзина</span>
              <span className="text-[13px] text-white/80">·</span>
              <span className="text-[14px] text-white/90 font-medium">
                {totalCount} поз.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[16px] tracking-tight">
                {totalPrice.toFixed(1)} BYN
              </span>
              <ChevronRight className="w-4 h-4 text-white/80" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
