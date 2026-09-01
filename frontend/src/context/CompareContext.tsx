import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

const MAX_COMPARE = 3;

interface CompareContextValue {
  items: Product[];
  isCompared: (id: string) => boolean;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isFull: boolean;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const isCompared = useCallback(
    (id: string) => items.some((p) => p.id === id),
    [items]
  );

  const toggleCompare = useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromCompare = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearCompare = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      isCompared,
      toggleCompare,
      removeFromCompare,
      clearCompare,
      isFull: items.length >= MAX_COMPARE,
      count: items.length,
    }),
    [items, isCompared, toggleCompare, removeFromCompare, clearCompare]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}