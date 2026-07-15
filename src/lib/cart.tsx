"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { apiFetch, getAuthToken } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

// Mirrors the response shape handled in /cart, kept minimal for counting.
type RawCartResponse =
  | Array<{ productId: string; name?: string; price?: number; img?: string; image?: string; quantity: number }>
  | {
      items?: RawCartResponse;
      data?: RawCartResponse;
      carts?: RawCartResponse;
    };

interface CartContextValue {
  items: CartItem[];
  count: number;
  loading: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
}

function normalizeCart(data: RawCartResponse): Array<{
  productId: string;
  name?: string;
  price?: number;
  img?: string;
  image?: string;
  quantity: number;
}> {
  if (Array.isArray(data)) return data;
  return (data.items ?? data.data ?? data.carts ?? []) as Array<{
    productId: string;
    name?: string;
    price?: number;
    img?: string;
    image?: string;
    quantity: number;
  }>;
}

const STORAGE_KEY = "aesthete-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (e.g. private mode)
    }
  }, [items]);

  // Hydrate the cart count from the server (same API the /cart page uses)
  // on refresh and after login, so the navbar badge reflects the real cart.
  useEffect(() => {
    if (isPending) {
      setLoading(true);
      return;
    }
    if (!session?.user) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    (async () => {
      try {
        const data = await apiFetch<RawCartResponse>(
          `/api/user/cart/${session.user.email}`
        );
        const list = normalizeCart(data);
        const mapped: CartItem[] = list.map((it) => ({
          id: it.productId,
          name: it.name ?? "",
          price: typeof it.price === "number" ? it.price : 0,
          image: it.img || it.image,
          qty: it.quantity,
        }));
        if (active) setItems(mapped);
      } catch {
        // Keep any local items if the server cart can't be reached.
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [isPending, session?.user?.email]);

  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))
    );

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, loading, addItem, removeItem, setQty }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
