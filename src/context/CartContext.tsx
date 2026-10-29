import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/product";
import { carts } from "../lib/mockBackend";
import { useProfile } from "./ProfileContext";

type CartContextValue = {
  items: Product[];
  itemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Logged in: the cart is saved to the mock backend per user and reloaded on login.
 * Logged out: the cart lives in memory only, and merges into the user's cart on an explicit login.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const { currentUserId, loginKind } = useProfile();
  const [items, setItems] = useState<Product[]>(() =>
    currentUserId ? carts.get(currentUserId) : [],
  );
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const prevUserId = useRef(currentUserId);

  useEffect(() => {
    const prev = prevUserId.current;
    if (prev === currentUserId) return;
    prevUserId.current = currentUserId;

    if (!currentUserId) {
      setItems([]);
      return;
    }
    const stored = carts.get(currentUserId);
    if (prev === null && loginKind === "login") {
      const merged = [...stored, ...itemsRef.current];
      carts.save(currentUserId, merged);
      setItems(merged);
      return;
    }
    setItems(stored);
  }, [currentUserId, loginKind]);

  const persist = useCallback(
    (next: Product[]) => {
      setItems(next);
      if (currentUserId) carts.save(currentUserId, next);
    },
    [currentUserId],
  );

  const addToCart = useCallback(
    (product: Product) => {
      persist([...items, product]);
    },
    [items, persist],
  );

  const removeFromCart = useCallback(
    (product: Product) => {
      const idx = items.findIndex((p) => p.id === product.id);
      if (idx < 0) return;
      const next = [...items];
      next.splice(idx, 1);
      persist(next);
    },
    [items, persist],
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      addToCart,
      removeFromCart,
      clearCart,
      totalPrice: items.reduce((s, p) => s + p.price, 0),
    }),
    [items, addToCart, removeFromCart, clearCart],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
