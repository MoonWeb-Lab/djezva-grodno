import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MenuItem, CartItem, CartItemModifierSelection } from '../types/menu';

const STORAGE_KEY = 'djezva_cart_v1';

// Generates a unique key based on item ID and selected modifiers
export function generateCartItemId(item: MenuItem, modifiers: CartItemModifierSelection): string {
  const parts = [item.id];
  if (modifiers.selectedVolume) {
    parts.push(`vol:${modifiers.selectedVolume.label}`);
  }
  if (modifiers.selectedMilk) {
    parts.push(`milk:${modifiers.selectedMilk.id}`);
  }
  if (modifiers.selectedSyrups && modifiers.selectedSyrups.length > 0) {
    const syrups = [...modifiers.selectedSyrups].map((s) => s.id).sort().join(',');
    parts.push(`syrups:${syrups}`);
  }
  if (modifiers.selectedAddons && modifiers.selectedAddons.length > 0) {
    const addons = [...modifiers.selectedAddons].map((a) => a.id).sort().join(',');
    parts.push(`addons:${addons}`);
  }
  return parts.join('|');
}

export function calculateUnitPrice(item: MenuItem, modifiers: CartItemModifierSelection): number {
  let price = modifiers.selectedVolume ? modifiers.selectedVolume.price : item.basePrice;
  if (modifiers.selectedMilk) {
    price += modifiers.selectedMilk.price;
  }
  if (modifiers.selectedSyrups) {
    price += modifiers.selectedSyrups.reduce((sum, s) => sum + s.price, 0);
  }
  if (modifiers.selectedAddons) {
    price += modifiers.selectedAddons.reduce((sum, a) => sum + a.price, 0);
  }
  return price;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = useCallback(
    (item: MenuItem, modifiers: CartItemModifierSelection = {}, quantity = 1, comment?: string) => {
      // Default volume if item has volumes and none was selected
      const finalModifiers: CartItemModifierSelection = {
        ...modifiers,
        selectedVolume:
          modifiers.selectedVolume || (item.options?.volumes ? item.options.volumes[0] : undefined),
      };

      const unitPrice = calculateUnitPrice(item, finalModifiers);
      const cartItemId = generateCartItemId(item, finalModifiers);

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((ci) => ci.cartItemId === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prevCart];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
            comment: comment || updated[existingIndex].comment,
          };
          return updated;
        } else {
          return [
            ...prevCart,
            {
              cartItemId,
              item,
              modifiers: finalModifiers,
              unitPrice,
              quantity,
              comment,
            },
          ];
        }
      });
    },
    []
  );

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((ci) => ci.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  };
}
