import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@cleano/cart_items';

export type CartItem = {
  id: string;
  name: string;
  detail: string;
  price: number;
  image: ImageSourcePropType;
  quantity: number;
};

type CartItemInput = Omit<CartItem, 'quantity'>;

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItemInput, options?: { quantity?: number; replace?: boolean }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearAll: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setItems(JSON.parse(stored));
      })
      .finally(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const addItem: CartContextValue['addItem'] = (item, options) => {
    const quantity = options?.quantity ?? 1;
    setItems((prev) => {
      const index = prev.findIndex((i) => i.id === item.id);
      if (index === -1) return [...prev, { ...item, quantity }];
      const next = [...prev];
      next[index] = options?.replace
        ? { ...item, quantity }
        : { ...next[index], ...item, quantity: next[index].quantity + quantity };
      return next;
    });
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearAll = () => setItems([]);

  const value = useMemo<CartContextValue>(
    () => ({ items, addItem, removeItem, updateQuantity, clearAll }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
