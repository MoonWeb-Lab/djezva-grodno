import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MapPin,
  Car,
  AlertCircle,
  Loader2,
  Coffee,
} from 'lucide-react';
import type {
  CartItem,
  OrderFormData,
  OrderFormErrors,
  OrderType,
  TakeawayTiming,
} from '../types/menu';
import { formatBelarusPhone, validateOrderForm } from '../services/validation';
import { sendOrderToTelegram } from '../services/telegram';
import type { SendOrderResult } from '../services/telegram';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  totalCount: number;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onOrderSuccess: (result: SendOrderResult, formData: OrderFormData) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  totalPrice,
  totalCount,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
}) => {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    phone: '',
    orderType: 'takeaway',
    takeawayTiming: '20min',
    customTime: '',
    street: '',
    apartment: '',
    entrance: '',
    comment: '',
  });

  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field refs for smooth scroll to first error
  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const streetInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBelarusPhone(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, customerName: e.target.value }));
    if (errors.customerName) {
      setErrors((prev) => ({ ...prev, customerName: undefined }));
    }
  };

  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, street: e.target.value }));
    if (errors.street) {
      setErrors((prev) => ({ ...prev, street: undefined }));
    }
  };

  const handleOrderTypeChange = (type: OrderType) => {
    setFormData((prev) => ({ ...prev, orderType: type }));
    // Clear delivery/pickup-specific errors
    setErrors((prev) => ({
      ...prev,
      street: undefined,
      customTime: undefined,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;

    // Strict validation
    const validation = validateOrderForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);

      // Smooth scroll to the first invalid field
      if (validation.firstErrorField === 'customerName') {
        nameInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInputRef.current?.focus();
      } else if (validation.firstErrorField === 'phone') {
        phoneInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        phoneInputRef.current?.focus();
      } else if (validation.firstErrorField === 'street') {
        streetInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        streetInputRef.current?.focus();
      } else if (validation.firstErrorField === 'customTime') {
        timeInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        timeInputRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await sendOrderToTelegram(formData, cart, totalPrice);
      setIsSubmitting(false);
      onOrderSuccess(result, formData);
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-stretch md:justify-end p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Sheet (Bottom sheet on mobile, right panel on desktop) */}
          <motion.div
            initial={isDesktop ? { x: '100%', y: 0 } : { y: '100%', x: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={isDesktop ? { x: '100%', y: 0 } : { y: '100%', x: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="relative w-full max-w-[430px] md:max-w-none md:w-[420px] max-h-[92vh] md:max-h-full h-auto md:h-full bg-[#F6F2EB] rounded-t-[28px] md:rounded-none md:rounded-l-[28px] shadow-2xl flex flex-col overflow-hidden z-10 border-t md:border-t-0 md:border-l border-[#1E1612]/10"
          >
            {/* Top Bar with Grab Handle & Title */}
            <div className="bg-white px-4 pt-3 pb-3 border-b border-[#1E1612]/8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#8C3B2B]/10 flex items-center justify-center text-[#8C3B2B]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-[18px] font-bold text-[#1E1612] leading-tight">
                    Корзина заказа
                  </h3>
                  <div className="text-[11.5px] text-[#6E655F]">
                    {totalCount > 0 ? `${totalCount} поз. · ${totalPrice.toFixed(1)} BYN` : 'Корзина пуста'}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Закрыть корзину"
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#F3ECE1] text-[#6E655F] hover:text-[#1E1612] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Container */}
            <div className="overflow-y-auto p-4 space-y-4 no-scrollbar flex-1">
              {cart.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white rounded-2xl border border-[rgba(30,22,18,0.08)]">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#8C3B2B]">
                    <Coffee className="w-7 h-7" />
                  </div>
                  <h4 className="font-serif text-[18px] font-bold text-[#1E1612]">
                    В корзине пока пусто
                  </h4>
                  <p className="mt-1 text-[13px] text-[#6E655F] max-w-xs mx-auto">
                    Выберите фирменные крепы, драники или кофе на песке из меню
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-5 py-2 rounded-full bg-[#8C3B2B] text-white text-[13px] font-bold shadow-sm"
                  >
                    Перейти к меню
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-2.5">
                    {cart.map((cartItem) => {
                      const modSummary: string[] = [];
                      if (cartItem.modifiers.selectedVolume) {
                        modSummary.push(cartItem.modifiers.selectedVolume.volume);
                      }
                      if (cartItem.modifiers.selectedMilk) {
                        modSummary.push(cartItem.modifiers.selectedMilk.label);
                      }
                      if (cartItem.modifiers.selectedSyrups) {
                        cartItem.modifiers.selectedSyrups.forEach((s) => modSummary.push(s.label));
                      }
                      if (cartItem.modifiers.selectedAddons) {
                        cartItem.modifiers.selectedAddons.forEach((a) => modSummary.push(a.label));
                      }

                      return (
                        <div
                          key={cartItem.cartItemId}
                          className="bg-white rounded-2xl p-3 border border-[rgba(30,22,18,0.08)] shadow-xs flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-[14.5px] font-bold text-[#1E1612] leading-snug truncate">
                              {cartItem.item.title}
                            </h4>
                            {modSummary.length > 0 && (
                              <p className="text-[11.5px] text-[#6E655F] truncate mt-0.5">
                                {modSummary.join(' · ')}
                              </p>
                            )}
                            {cartItem.comment && (
                              <p className="text-[11px] text-[#8C3B2B] italic truncate mt-0.5">
                                «{cartItem.comment}»
                              </p>
                            )}
                            <div className="mt-1 text-[13.5px] font-extrabold text-[#1E1612]">
                              {(cartItem.unitPrice * cartItem.quantity).toFixed(1)} BYN
                            </div>
                          </div>

                          {/* Stepper Controls */}
                          <div className="flex items-center gap-1.5 shrink-0 bg-[#FAF7F2] border border-[#1E1612]/10 rounded-full px-1.5 py-1">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(cartItem.cartItemId, -1)}
                              aria-label="Уменьшить"
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1E1612] shadow-xs active:scale-90"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-[13px] font-bold text-[#1E1612]">
                              {cartItem.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(cartItem.cartItemId, 1)}
                              aria-label="Увеличить"
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#1E1612] shadow-xs active:scale-90"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onRemoveItem(cartItem.cartItemId)}
                              aria-label="Удалить"
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#8C3B2B] shadow-xs active:scale-90 ml-0.5"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Mode Switcher */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[rgba(30,22,18,0.08)]">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E655F] mb-2">
                      Способ получения
                    </label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF7F2] rounded-xl border border-[#1E1612]/6">
                      <button
                        type="button"
                        onClick={() => handleOrderTypeChange('takeaway')}
                        className={`py-2 px-3 rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          formData.orderType === 'takeaway'
                            ? 'bg-[#8C3B2B] text-white shadow-sm'
                            : 'text-[#6E655F] hover:text-[#1E1612]'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>С собой</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOrderTypeChange('delivery')}
                        className={`py-2 px-3 rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          formData.orderType === 'delivery'
                            ? 'bg-[#8C3B2B] text-white shadow-sm'
                            : 'text-[#6E655F] hover:text-[#1E1612]'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>Доставка</span>
                      </button>
                    </div>

                    {/* Mode 1: Takeaway Details */}
                    {formData.orderType === 'takeaway' && (
                      <div className="mt-3 pt-3 border-t border-[#1E1612]/6 space-y-2.5">
                        <div className="flex items-center gap-2 text-[12.5px] text-[#1E1612] bg-[#FAF7F2] p-2.5 rounded-xl border border-[#D8CFC2]">
                          <MapPin className="w-4 h-4 text-[#8C3B2B] shrink-0" />
                          <div>
                            <span className="font-semibold">Самовывоз: </span>
                            <span>Гродно, ул. Советская, 5</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E655F] mb-1.5">
                            Время готовности
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {(
                              [
                                { id: '10min', label: '10 мин' },
                                { id: '20min', label: '20 мин' },
                                { id: '30min', label: '30 мин' },
                                { id: 'custom', label: 'Ко времени' },
                              ] as { id: TakeawayTiming; label: string }[]
                            ).map((timing) => (
                              <button
                                key={timing.id}
                                type="button"
                                onClick={() =>
                                  setFormData((p) => ({ ...p, takeawayTiming: timing.id }))
                                }
                                className={`py-1.5 px-2 rounded-lg text-[12px] font-medium transition-all ${
                                  formData.takeawayTiming === timing.id
                                    ? 'bg-[#1E1612] text-white font-bold'
                                    : 'bg-[#FAF7F2] text-[#1E1612] border border-[#1E1612]/10'
                                }`}
                              >
                                {timing.label}
                              </button>
                            ))}
                          </div>

                          {formData.takeawayTiming === 'custom' && (
                            <div className="mt-2">
                              <input
                                ref={timeInputRef}
                                type="time"
                                value={formData.customTime}
                                onChange={(e) =>
                                  setFormData((p) => ({ ...p, customTime: e.target.value }))
                                }
                                className={`w-full px-3 py-2 rounded-xl text-[13px] border bg-[#FAF7F2] outline-none ${
                                  errors.customTime
                                    ? 'border-red-500 ring-1 ring-red-500'
                                    : 'border-[#1E1612]/15 focus:border-[#8C3B2B]'
                                }`}
                              />
                              {errors.customTime && (
                                <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{errors.customTime}</span>
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Mode 2: Delivery Details */}
                    {formData.orderType === 'delivery' && (
                      <div className="mt-3 pt-3 border-t border-[#1E1612]/6 space-y-2.5">
                        <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#D8CFC2] text-[11.5px] text-[#4A1C1A] leading-snug">
                          ℹ️ Доставка выполняется курьером Яндекс Доставки по тарифу города (без 30% комиссии агрегатора). Оплата доставки курьеру при получении.
                        </div>

                        <div>
                          <label
                            htmlFor="delivery-street"
                            className="block text-[11px] font-bold uppercase tracking-wider text-[#6E655F] mb-1"
                          >
                            Улица и номер дома <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={streetInputRef}
                            id="delivery-street"
                            type="text"
                            placeholder="Например: ул. Советская, 5 или проспект Мира, 12"
                            value={formData.street}
                            onChange={handleStreetChange}
                            className={`w-full px-3 py-2 rounded-xl text-[13px] border bg-[#FAF7F2] outline-none transition-all ${
                              errors.street
                                ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30'
                                : 'border-[#1E1612]/15 focus:border-[#8C3B2B] focus:bg-white'
                            }`}
                          />
                          {errors.street && (
                            <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              <span>{errors.street}</span>
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label
                              htmlFor="delivery-apartment"
                              className="block text-[11px] font-bold uppercase tracking-wider text-[#6E655F] mb-1"
                            >
                              Квартира / офис
                            </label>
                            <input
                              id="delivery-apartment"
                              type="text"
                              placeholder="кв. 12"
                              value={formData.apartment}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, apartment: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-xl text-[13px] border border-[#1E1612]/15 bg-[#FAF7F2] focus:border-[#8C3B2B] focus:bg-white outline-none"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="delivery-entrance"
                              className="block text-[11px] font-bold uppercase tracking-wider text-[#6E655F] mb-1"
                            >
                              Подъезд / этаж
                            </label>
                            <input
                              id="delivery-entrance"
                              type="text"
                              placeholder="под. 1, эт. 3"
                              value={formData.entrance}
                              onChange={(e) =>
                                setFormData((p) => ({ ...p, entrance: e.target.value }))
                              }
                              className="w-full px-3 py-2 rounded-xl text-[13px] border border-[#1E1612]/15 bg-[#FAF7F2] focus:border-[#8C3B2B] focus:bg-white outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Customer Information & Validation */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[rgba(30,22,18,0.08)] space-y-3">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E655F]">
                      Данные гостя
                    </label>

                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="customer-name"
                        className="block text-[12px] font-semibold text-[#1E1612] mb-1"
                      >
                        Ваше имя <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={nameInputRef}
                        id="customer-name"
                        type="text"
                        placeholder="Как к вам обращаться"
                        value={formData.customerName}
                        onChange={handleNameChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-[13.5px] border outline-none transition-all ${
                          errors.customerName
                            ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30'
                            : 'border-[#1E1612]/15 bg-[#FAF7F2] focus:border-[#8C3B2B] focus:bg-white'
                        }`}
                      />
                      {errors.customerName && (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.customerName}</span>
                        </p>
                      )}
                    </div>

                    {/* Belarus Phone Field */}
                    <div>
                      <label
                        htmlFor="customer-phone"
                        className="block text-[12px] font-semibold text-[#1E1612] mb-1"
                      >
                        Телефон (Беларусь) <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={phoneInputRef}
                        id="customer-phone"
                        type="tel"
                        placeholder="+375 (XX) XXX-XX-XX"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-[13.5px] border outline-none transition-all font-mono ${
                          errors.phone
                            ? 'border-red-500 ring-1 ring-red-500 bg-red-50/30'
                            : 'border-[#1E1612]/15 bg-[#FAF7F2] focus:border-[#8C3B2B] focus:bg-white'
                        }`}
                      />
                      {errors.phone ? (
                        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.phone}</span>
                        </p>
                      ) : (
                        <p className="mt-1 text-[10.5px] text-[#6E655F]">
                          Операторы РБ: 29, 33, 44, 25 (9 цифр)
                        </p>
                      )}
                    </div>

                    {/* Order Comment */}
                    <div>
                      <label
                        htmlFor="customer-comment"
                        className="block text-[12px] font-semibold text-[#1E1612] mb-1"
                      >
                        Комментарий к заказу (опционально)
                      </label>
                      <input
                        id="customer-comment"
                        type="text"
                        placeholder="Например: позвонить за 5 минут, без приборов"
                        value={formData.comment}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, comment: e.target.value }))
                        }
                        className="w-full px-3.5 py-2 rounded-xl text-[13px] border border-[#1E1612]/15 bg-[#FAF7F2] focus:border-[#8C3B2B] focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Checkout Action */}
            {cart.length > 0 && (
              <div className="bg-white p-4 border-t border-[#1E1612]/8">
                <div className="flex items-center justify-between mb-3 text-[13px]">
                  <span className="text-[#6E655F]">Сумма заказа:</span>
                  <span className="font-extrabold text-[17px] text-[#1E1612]">
                    {totalPrice.toFixed(1)} BYN
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting}
                  onClick={handleSubmitOrder}
                  className="w-full py-3.5 px-4 rounded-full bg-[#8C3B2B] hover:bg-[#783023] disabled:opacity-60 text-white font-bold text-[15px] shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Отправляем в Джезву...</span>
                    </>
                  ) : (
                    <span>Оформить заказ · {totalPrice.toFixed(1)} BYN</span>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
