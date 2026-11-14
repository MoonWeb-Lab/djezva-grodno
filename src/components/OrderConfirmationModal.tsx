import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, ArrowRight } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import confetti from 'canvas-confetti';
import type { OrderFormData } from '../types/menu';
import type { SendOrderResult } from '../services/telegram';

interface OrderConfirmationModalProps {
  orderResult: SendOrderResult | null;
  formData: OrderFormData | null;
  totalPrice: number;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  orderResult,
  formData,
  totalPrice,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8C3B2B', '#4A1C1A', '#FAF7F2', '#D8CFC2', '#22C55E'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!orderResult || !formData) return null;

  const isTakeaway = formData.orderType === 'takeaway';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-[400px] bg-white rounded-[28px] p-6 shadow-2xl border border-[#1E1612]/10 z-10 text-center"
          >
            {/* Animated Check Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 350, damping: 20 }}
              className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner"
            >
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </motion.div>

            <span className="mt-3 block text-[11px] font-bold text-[#8C3B2B] tracking-widest uppercase">
              ЗАКАЗ УСПЕШНО ПРИНЯТ
            </span>

            <h3 className="font-serif text-[24px] font-bold text-[#1E1612] mt-0.5">
              Заказ #{orderResult.orderNumber}
            </h3>

            <p className="mt-2 text-[13.5px] text-[#6E655F] leading-relaxed">
              Бариста «Джезвы» уже начал варить кофе на горячем песке и готовить ваши блюда!
            </p>

            {/* Receipt Box */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#D8CFC2] text-left text-[12.5px] space-y-2">
              <div className="flex items-start gap-2">
                {isTakeaway ? (
                  <MapPin className="w-4 h-4 text-[#8C3B2B] shrink-0 mt-0.5" />
                ) : (
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-semibold text-[#1E1612]">
                    {isTakeaway ? 'Самовывоз:' : 'Адрес доставки:'}
                  </span>{' '}
                  <span className="text-[#6E655F]">
                    {isTakeaway
                      ? 'Гродно, ул. Советская, 5'
                      : `${formData.street}${
                          formData.apartment
                            ? formData.apartment.toLowerCase().includes('кв')
                              ? `, ${formData.apartment}`
                              : `, кв. ${formData.apartment}`
                            : ''
                        }`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#8C3B2B] shrink-0" />
                <div>
                  <span className="font-semibold text-[#1E1612]">Время: </span>
                  <span className="text-[#6E655F]">
                    {isTakeaway
                      ? formData.takeawayTiming === 'custom'
                        ? `К ${formData.customTime}`
                        : `Через ${formData.takeawayTiming.replace('min', '')} мин`
                      : 'Курьер вызван (Яндекс Доставка)'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1E1612]/8 flex items-center justify-between font-bold text-[14px] text-[#1E1612]">
                <span>К оплате:</span>
                <span className="text-[#8C3B2B]">{totalPrice.toFixed(1)} BYN</span>
              </div>
            </div>

            {/* Social / Instagram Link */}
            <a
              href="https://instagram.com/djezva_grodno"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 inline-flex items-center gap-1.5 text-[12px] text-[#8C3B2B] hover:underline font-semibold"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>@djezva_grodno в Instagram</span>
            </a>

            {/* Close Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="mt-5 w-full py-3 px-4 rounded-full bg-[#1E1612] hover:bg-black text-white text-[14px] font-bold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Вернуться в меню</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
