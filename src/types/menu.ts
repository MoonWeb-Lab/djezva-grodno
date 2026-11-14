export type MenuCategoryId = 'all' | 'pancakes' | 'breakfasts' | 'sand-coffee' | 'author-bar';

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
}

export interface VolumeOption {
  label: string;
  volume: string;
  price: number;
}

export interface ModifierOption {
  id: string;
  label: string;
  price: number;
}

export interface MenuItemOptions {
  volumes?: VolumeOption[];
  milk?: ModifierOption[];
  syrups?: ModifierOption[];
  addons?: ModifierOption[];
}

export interface MenuItem {
  id: string;
  title: string;
  category: Exclude<MenuCategoryId, 'all'>;
  description: string;
  weight?: string;
  volume?: string;
  basePrice: number;
  badge?: string;
  pairing?: string;
  image?: string;
  imagePosition?: string; // CSS object-position if needed
  options?: MenuItemOptions;
}

export interface CartItemModifierSelection {
  selectedVolume?: VolumeOption;
  selectedMilk?: ModifierOption;
  selectedSyrups?: ModifierOption[];
  selectedAddons?: ModifierOption[];
}

export interface CartItem {
  cartItemId: string; // unique hash including modifiers
  item: MenuItem;
  modifiers: CartItemModifierSelection;
  unitPrice: number;
  quantity: number;
  comment?: string;
}

export type OrderType = 'takeaway' | 'delivery';

export type TakeawayTiming = '10min' | '20min' | '30min' | 'custom';

export interface OrderFormData {
  customerName: string;
  phone: string;
  orderType: OrderType;
  takeawayTiming: TakeawayTiming;
  customTime: string;
  street: string;
  apartment: string;
  entrance: string;
  comment: string;
}

export interface OrderFormErrors {
  customerName?: string;
  phone?: string;
  street?: string;
  customTime?: string;
}
