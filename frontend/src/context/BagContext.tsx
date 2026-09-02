import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

const STORAGE_KEY = "budhram:bag";

export interface BagItem {
  product: Product;
  quantity: number;
}

interface BagContextValue {
  items: BagItem[];
  /** Total quantity across all lines (navbar badge). */
  count: number;
  /** Number of distinct products in the bag. */
  lineCount: number;
  /** Sum of price × quantity. */
  subtotal: number;
  isInBag: (id: string) => boolean;
  addToBag: (product: Product, quantity?: number) => void;
  removeFromBag: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearBag: () => void;
}

const BagContext = createContext<BagContextValue | null>(null);

function loadBag(): BagItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BagItem =>
        Boolean(item && item.product && typeof item.quantity === "number")
    );
  } catch {
    return [];
  }
}

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>(() => {
    if (typeof window === "undefined") return [];
    return loadBag();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage unavailable — non-fatal
    }
  }, [items]);

  const addToBag = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, 99) }
            : item
        );
      }
      return [{ product, quantity: Math.max(1, quantity) }, ...prev];
    });
  }, []);

  const removeFromBag = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.product.id !== id)
        : prev.map((item) =>
            item.product.id === id ? { ...item, quantity: Math.min(quantity, 99) } : item
          )
    );
  }, []);

  const increment = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
      )
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.product.id !== id) return item;
        const next = item.quantity - 1;
        return next <= 0 ? item : { ...item, quantity: next };
      })
    );
  }, []);

  const clearBag = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  const isInBag = useCallback((id: string) => items.some((item) => item.product.id === id), [items]);

  const value = useMemo(
    () => ({
      items,
      count,
      lineCount: items.length,
      subtotal,
      isInBag,
      addToBag,
      removeFromBag,
      setQuantity,
      increment,
      decrement,
      clearBag,
    }),
    [
      items,
      count,
      subtotal,
      isInBag,
      addToBag,
      removeFromBag,
      setQuantity,
      increment,
      decrement,
      clearBag,
    ]
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) throw new Error("useBag must be used within BagProvider");
  return ctx;
}
