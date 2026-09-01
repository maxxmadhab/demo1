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

interface UIContextValue {
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  quickViewProduct: Product | null;
  bagOpen: boolean;
  compareOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  setBagOpen: (open: boolean) => void;
  setCompareOpen: (open: boolean) => void;
  closeAll: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  const anyOpen = mobileMenuOpen || searchOpen || quickViewProduct !== null || bagOpen || compareOpen;
  useBodyScrollLock(anyOpen);

  const closeAll = useCallback(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setQuickViewProduct(null);
    setBagOpen(false);
    setCompareOpen(false);
  }, []);

  const openQuickView = useCallback((product: Product) => {
    setSearchOpen(false);
    setQuickViewProduct(product);
  }, []);

  const value = useMemo(
    () => ({
      mobileMenuOpen,
      searchOpen,
      quickViewProduct,
      bagOpen,
      compareOpen,
      setMobileMenuOpen,
      setSearchOpen,
      openQuickView,
      closeQuickView: () => setQuickViewProduct(null),
      setBagOpen,
      setCompareOpen,
      closeAll,
    }),
    [mobileMenuOpen, searchOpen, quickViewProduct, bagOpen, compareOpen, openQuickView, closeAll]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}