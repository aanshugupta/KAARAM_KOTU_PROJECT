
export type Category = 'Sweets' | 'Pickles' | 'Spicy Powders' | 'Snacks' | 'Combos';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  ingredients: string[];
  shelfLife: string;
  storage: string;
  isBestSeller?: boolean;
  onOffer?: boolean;
  bestFor: string; // e.g., 'Daily use', 'Festive occasions', 'Gifting'
  prepMethod?: string;
  usageTips?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  isGift?: boolean;
  giftNote?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
}
