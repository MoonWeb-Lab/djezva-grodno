import React, { useState, useMemo, useRef } from 'react';
import { ShoppingBag, MapPin } from 'lucide-react';
import { InstagramIcon } from './components/InstagramIcon';
import { MENU_CATEGORIES, MENU_ITEMS } from './data/menuData';
import type { MenuItem, MenuCategoryId, CartItemModifierSelection, OrderFormData } from './types/menu';
import { useCart } from './hooks/useCart';
import type { SendOrderResult } from './services/telegram';

import { HeroSection } from './components/HeroSection';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuCard } from './components/MenuCard';
import { CompactMenuRow } from './components/CompactMenuRow';
import { FloatingCartButton } from './components/FloatingCartButton';
import { ItemCustomizerModal } from './components/ItemCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';

export const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>('all');
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Success Confirmation State
  const [lastOrderResult, setLastOrderResult] = useState<SendOrderResult | null>(null);
  const [lastOrderForm, setLastOrderForm] = useState<OrderFormData | null>(null);
  const [lastOrderPrice, setLastOrderPrice] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const menuAnchorRef = useRef<HTMLDivElement>(null);

  const {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  // Scroll to menu section from Hero
  const scrollToMenu = () => {
    menuAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Filtered Items
  const displayedItems = useMemo(() => {
    if (activeCategory === 'all') {
      return MENU_ITEMS;
    }
    return MENU_ITEMS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Handle direct "В ЗАКАЗ" click
  const handleQuickAdd = (item: MenuItem) => {
    // If item has volumes, select the first volume
    const defaultVolume = item.options?.volumes ? item.options.volumes[0] : undefined;
    addToCart(item, { selectedVolume: defaultVolume }, 1);
  };

  // Handle "НАСТРОИТЬ" click
  const handleOpenCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
  };

  // Add customized item to cart
  const handleCustomizedAdd = (
    item: MenuItem,
    modifiers: CartItemModifierSelection,
    quantity: number,
    comment?: string
  ) => {
    addToCart(item, modifiers, quantity, comment);
  };

  // Successful Order Handled
  const handleOrderSuccess = (result: SendOrderResult, formData: OrderFormData) => {
    setLastOrderResult(result);
    setLastOrderForm(formData);
    setLastOrderPrice(totalPrice);
    setIsConfirmationOpen(true);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#ECE6DC] flex justify-center py-0 sm:py-6 sm:px-4">
      {/* Mobile-first centered frame (390–430px wide) */}
      <main className="w-full max-w-[430px] min-h-screen sm:min-h-[920px] bg-[#F6F2EB] shadow-2xl relative flex flex-col sm:rounded-[36px] overflow-hidden border-x border-[#1E1612]/8">
        {/* Top Brand Header */}
        <header className="px-4 py-3 bg-[#FAF7F2] border-b border-[#1E1612]/6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.jpg"
              alt="Джезва логотип"
              className="w-8 h-8 rounded-full object-cover border border-[#1E1612]/10"
            />
            <div>
              <div className="font-serif font-black tracking-wider text-[15px] text-[#1E1612]">
                ДЖЕЗВА
              </div>
              <div className="flex items-center gap-1 text-[10.5px] text-[#6E655F]">
                <MapPin className="w-2.5 h-2.5 text-[#8C3B2B]" />
                <span>Гродно, Советская, 5</span>
              </div>
            </div>
          </div>

          {/* Cart Icon in Header */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Открыть корзину"
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white border border-[#1E1612]/10 text-[#1E1612] hover:bg-[#FAF7F2] shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#8C3B2B]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8C3B2B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalCount}
              </span>
            )}
          </button>
        </header>

        {/* Hero Section */}
        <HeroSection onExploreClick={scrollToMenu} />

        {/* Category Navigation Bar (Sticky) */}
        <div ref={menuAnchorRef}>
          <CategoryTabs
            categories={MENU_CATEGORIES}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        </div>

        {/* Menu Items Showcase */}
        <div className="px-3 py-4 space-y-4 flex-1">
          {displayedItems.map((item, index) => {
            // Render rich Magazine Card if image exists, otherwise clean Compact Row
            return item.image ? (
              <MenuCard
                key={item.id}
                item={item}
                index={index}
                onAddToCart={handleQuickAdd}
                onCustomize={handleOpenCustomizer}
              />
            ) : (
              <CompactMenuRow
                key={item.id}
                item={item}
                onAddToCart={handleQuickAdd}
                onCustomize={handleOpenCustomizer}
              />
            );
          })}
        </div>

        {/* Bistro Footer */}
        <footer className="mt-8 px-4 py-8 bg-[#FAF7F2] border-t border-[#1E1612]/8 text-center text-[#6E655F]">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="/images/logo.jpg"
              alt="Джезва лого"
              className="w-7 h-7 rounded-full border border-[#1E1612]/10"
            />
            <span className="font-serif font-bold text-[15px] text-[#1E1612]">
              Кофейня-бистро «Джезва»
            </span>
          </div>

          <p className="text-[12px] leading-relaxed max-w-[280px] mx-auto">
            Гродно, ул. Советская, 5 <br />
            Ежедневно: 08:00 – 23:00
          </p>

          <a
            href="https://instagram.com/djezva_grodno"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-[#8C3B2B] hover:text-[#4A1C1A] font-semibold"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>@djezva_grodno</span>
          </a>

          <div className="mt-6 text-[10.5px] text-[#6E655F]/70 border-t border-[#1E1612]/6 pt-3">
            © {new Date().getFullYear()} Джезва Гродно. Мобильный предзаказ и доставка.
          </div>
        </footer>

        {/* Floating Bottom Cart Button */}
        <FloatingCartButton
          totalCount={totalCount}
          totalPrice={totalPrice}
          onClick={() => setIsCartOpen(true)}
        />

        {/* Item Customizer Modal */}
        <ItemCustomizerModal
          item={customizingItem}
          isOpen={Boolean(customizingItem)}
          onClose={() => setCustomizingItem(null)}
          onAddToCart={handleCustomizedAdd}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          totalPrice={totalPrice}
          totalCount={totalCount}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onOrderSuccess={handleOrderSuccess}
        />

        {/* Order Confirmation Screen */}
        <OrderConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          orderResult={lastOrderResult}
          formData={lastOrderForm}
          totalPrice={lastOrderPrice}
        />
      </main>
    </div>
  );
};

export default App;
