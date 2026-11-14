import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Check } from 'lucide-react';
import type {
  MenuItem,
  VolumeOption,
  ModifierOption,
  CartItemModifierSelection,
} from '../types/menu';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    modifiers: CartItemModifierSelection,
    quantity: number,
    comment?: string
  ) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  // Selected volume
  const [selectedVolume, setSelectedVolume] = useState<VolumeOption | undefined>(
    item.options?.volumes ? item.options.volumes[0] : undefined
  );

  // Selected milk
  const [selectedMilk, setSelectedMilk] = useState<ModifierOption | undefined>(undefined);

  // Selected syrups (multi-choice)
  const [selectedSyrups, setSelectedSyrups] = useState<ModifierOption[]>([]);

  // Selected add-ons (multi-choice)
  const [selectedAddons, setSelectedAddons] = useState<ModifierOption[]>([]);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Comment
  const [comment, setComment] = useState('');

  // Live Unit Price Calculation
  const unitPrice = useMemo(() => {
    let p = selectedVolume ? selectedVolume.price : item.basePrice;
    if (selectedMilk) p += selectedMilk.price;
    if (selectedSyrups.length > 0) {
      p += selectedSyrups.reduce((acc, s) => acc + s.price, 0);
    }
    if (selectedAddons.length > 0) {
      p += selectedAddons.reduce((acc, a) => acc + a.price, 0);
    }
    return p;
  }, [item, selectedVolume, selectedMilk, selectedSyrups, selectedAddons]);

  const totalPrice = unitPrice * quantity;

  const toggleSyrup = (syrup: ModifierOption) => {
    setSelectedSyrups((prev) =>
      prev.some((s) => s.id === syrup.id)
        ? prev.filter((s) => s.id !== syrup.id)
        : [...prev, syrup]
    );
  };

  const toggleAddon = (addon: ModifierOption) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleAdd = () => {
    onAddToCart(
      item,
      {
        selectedVolume,
        selectedMilk,
        selectedSyrups,
        selectedAddons,
      },
      quantity,
      comment.trim() || undefined
    );
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden z-10 border border-[#1E1612]/10"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-4 pb-3 border-b border-[#1E1612]/8">
              <div className="pr-4">
                <span className="text-[11px] font-bold text-[#8C3B2B] tracking-wider uppercase">
                  Настройка позиции
                </span>
                <h3 className="font-serif text-[18px] font-bold text-[#1E1612] leading-snug">
                  {item.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F3ECE1] text-[#6E655F] hover:text-[#1E1612] flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4 no-scrollbar">
              {/* Volume Options */}
              {item.options?.volumes && item.options.volumes.length > 0 && (
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#6E655F] mb-2">
                    Объём напитка
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {item.options.volumes.map((vol) => {
                      const isSelected = selectedVolume?.volume === vol.volume;
                      return (
                        <button
                          key={vol.volume}
                          type="button"
                          onClick={() => setSelectedVolume(vol)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#8C3B2B] bg-[#8C3B2B]/5 text-[#8C3B2B] font-bold'
                              : 'border-[#1E1612]/10 bg-white text-[#1E1612] hover:border-[#1E1612]/20'
                          }`}
                        >
                          <div>
                            <div className="text-[13px]">{vol.label}</div>
                            <div className="text-[11.5px] text-[#6E655F]">{vol.volume}</div>
                          </div>
                          <span className="text-[13px] font-semibold">{vol.price} BYN</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Milk Options */}
              {item.options?.milk && (
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#6E655F] mb-2">
                    Альтернативное молоко
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMilk(undefined)}
                      className={`p-2.5 rounded-xl border text-left text-[12.5px] transition-all ${
                        !selectedMilk
                          ? 'border-[#8C3B2B] bg-[#8C3B2B]/5 text-[#8C3B2B] font-bold'
                          : 'border-[#1E1612]/10 bg-white text-[#1E1612]'
                      }`}
                    >
                      Обычное (коровье)
                    </button>
                    {item.options.milk.map((milk) => {
                      const isSelected = selectedMilk?.id === milk.id;
                      return (
                        <button
                          key={milk.id}
                          type="button"
                          onClick={() => setSelectedMilk(milk)}
                          className={`p-2.5 rounded-xl border text-left text-[12.5px] transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#8C3B2B] bg-[#8C3B2B]/5 text-[#8C3B2B] font-bold'
                              : 'border-[#1E1612]/10 bg-white text-[#1E1612]'
                          }`}
                        >
                          <span>{milk.label}</span>
                          <span className="text-[11px] font-semibold text-[#8C3B2B]">
                            +{milk.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Syrup Options (Multi-select) */}
              {item.options?.syrups && (
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#6E655F] mb-2">
                    Сиропы (+1.5 BYN)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {item.options.syrups.map((syrup) => {
                      const isChecked = selectedSyrups.some((s) => s.id === syrup.id);
                      return (
                        <button
                          key={syrup.id}
                          type="button"
                          onClick={() => toggleSyrup(syrup)}
                          className={`p-2.5 rounded-xl border text-left text-[12px] flex items-center justify-between transition-all ${
                            isChecked
                              ? 'border-[#8C3B2B] bg-[#8C3B2B]/5 text-[#8C3B2B] font-bold'
                              : 'border-[#1E1612]/10 bg-white text-[#1E1612]'
                          }`}
                        >
                          <span>{syrup.label}</span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border ${
                              isChecked
                                ? 'bg-[#8C3B2B] border-[#8C3B2B] text-white'
                                : 'border-[#1E1612]/20'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Food Add-ons (Multi-select) */}
              {item.options?.addons && (
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-[#6E655F] mb-2">
                    Дополнительные добавки и соусы
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {item.options.addons.map((addon) => {
                      const isChecked = selectedAddons.some((a) => a.id === addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() => toggleAddon(addon)}
                          className={`p-2.5 rounded-xl border text-left text-[12px] flex items-center justify-between transition-all ${
                            isChecked
                              ? 'border-[#8C3B2B] bg-[#8C3B2B]/5 text-[#8C3B2B] font-bold'
                              : 'border-[#1E1612]/10 bg-white text-[#1E1612]'
                          }`}
                        >
                          <div>
                            <div>{addon.label}</div>
                            <span className="text-[11px] font-semibold text-[#8C3B2B]">
                              +{addon.price} BYN
                            </span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                              isChecked
                                ? 'bg-[#8C3B2B] border-[#8C3B2B] text-white'
                                : 'border-[#1E1612]/20'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special instructions */}
              <div>
                <label
                  htmlFor="special-instructions"
                  className="block text-[12px] font-bold uppercase tracking-wider text-[#6E655F] mb-1.5"
                >
                  Пожелания к приготовлению (опционально)
                </label>
                <input
                  id="special-instructions"
                  type="text"
                  placeholder="Например: без сахара, погорячее, соус отдельно"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2 text-[13px] rounded-xl border border-[#1E1612]/15 bg-[#FAF7F2] focus:bg-white focus:border-[#8C3B2B] focus:ring-1 focus:ring-[#8C3B2B] outline-none transition-all placeholder:text-[#6E655F]/60"
                />
              </div>
            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 border-t border-[#1E1612]/8 bg-white flex items-center justify-between gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#1E1612]/10 rounded-full px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Уменьшить количество"
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1E1612] hover:bg-[#F3ECE1] shadow-xs active:scale-90 transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-[14px] font-bold text-[#1E1612]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Увеличить количество"
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1E1612] hover:bg-[#F3ECE1] shadow-xs active:scale-90 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add Button with Total */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                className="flex-1 py-3 px-4 rounded-full bg-[#8C3B2B] hover:bg-[#783023] text-white font-bold text-[14px] shadow-md flex items-center justify-between transition-colors"
              >
                <span>Добавить</span>
                <span>{totalPrice.toFixed(1)} BYN</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
