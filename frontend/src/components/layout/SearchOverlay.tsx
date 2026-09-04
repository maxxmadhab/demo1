import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useUI } from "@/context/UIContext";
import { searchProducts } from "@/services/productService";
import type { Product } from "@/types/product";
import { useEscapeKey, useFocusTrap } from "@/hooks/useOverlayBehavior";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Icon } from "@/components/ui/Icon";
import { formatPrice } from "@/utils/format";

const POPULAR_SEARCHES = ["Diamond Ring", "Pearl", "Gold Hoops", "Bridal Set", "Sapphire"];

const SUGGESTED_CATEGORIES = [
  { label: "Rings", to: "/catalog?category=Rings" },
  { label: "Necklaces", to: "/catalog?category=Necklaces" },
  { label: "Bridal Jewelry", to: "/catalog?category=Bridal%20Jewelry" },
];

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, openQuickView } = useUI();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  useEscapeKey(searchOpen, () => setSearchOpen(false));
  useFocusTrap(searchOpen, panelRef);

  useEffect(() => {
    if (!searchOpen) {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 60);
      return () => window.clearTimeout(t);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const t = window.setTimeout(async () => {
      const res = await searchProducts(query);
      if (!cancelled) setResults(res.slice(0, 8));
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [query]);

  const closeAndNavigate = (to: string) => {
    setSearchOpen(false);
    navigate(to);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-charcoal/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          ref={panelRef}
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={reducedMotion ? false : { opacity: 0, y: -20, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mt-16 w-full max-w-3xl bg-ivory shadow-lift sm:mt-24"
          >
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-charcoal/10 px-6 py-5 sm:px-10">
              <Icon name="search" size={20} className="text-gold-deep" />
              <label htmlFor="search-input" className="sr-only">
                Search products
              </label>
              <input
                id="search-input"
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rings, necklaces, collections…"
                className="w-full bg-transparent font-display text-xl font-light text-charcoal placeholder:text-stone/50 focus:outline-none sm:text-2xl"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:text-charcoal"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-6 sm:px-10">
              {!query.trim() && (
                <div>
                  <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-stone">
                    Popular searches
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => {
                          setQuery(term);
                          inputRef.current?.focus();
                        }}
                        className="rounded-full border border-charcoal/15 px-4 py-2 font-body text-xs font-light text-charcoal/80 transition-colors duration-300 hover:border-gold-deep hover:text-gold-deep"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <p className="mt-8 font-body text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-stone">
                    Browse categories
                  </p>
                  <div className="mt-3 space-y-1">
                    {SUGGESTED_CATEGORIES.map((c) => (
                      <Link
                        key={c.label}
                        to={c.to}
                        onClick={() => setSearchOpen(false)}
                        className="block py-2 font-display text-xl font-medium text-charcoal transition-colors hover:text-gold-deep"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {query.trim() && (
                <div>
                  {results.length > 0 ? (
                    <>
                      <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-stone">
                        {results.length} result{results.length === 1 ? "" : "s"} for “{query}”
                      </p>
                      <ul className="mt-4 divide-y divide-charcoal/[0.07]">
                        {results.map((product) => (
                          <li key={product.id}>
                            <div className="group flex items-center gap-4 py-3">
                              <Link
                                to={`/product/${product.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="h-16 w-14 shrink-0 overflow-hidden bg-sand"
                                tabIndex={-1}
                              >
                                <ImageWithFallback
                                  src={product.images[0]}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </Link>
                              <div className="min-w-0 flex-1">
                                <Link
                                  to={`/product/${product.slug}`}
                                  onClick={() => setSearchOpen(false)}
                                  className="block truncate font-display text-lg font-medium text-charcoal transition-colors hover:text-gold-deep"
                                >
                                  {product.name}
                                </Link>
                                <p className="mt-0.5 font-body text-xs font-light text-stone">
                                  {product.category} · {product.material}
                                </p>
                              </div>
                              <p className="shrink-0 font-body text-sm font-medium text-charcoal">
                                {formatPrice(product.price)}
                              </p>
                              <button
                                type="button"
                                onClick={() => openQuickView(product)}
                                aria-label={`Quick view ${product.name}`}
                                className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal transition-colors duration-300 hover:border-gold-deep hover:text-gold-deep"
                              >
                                <Icon name="eye" size={15} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={() => closeAndNavigate(`/catalog?q=${encodeURIComponent(query)}`)}
                          className="font-body text-[0.68rem] font-medium uppercase tracking-[0.2em] text-gold-deep underline underline-offset-4 hover:text-gold"
                        >
                          View all results for “{query}”
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="py-10 text-center font-body text-sm font-light text-stone">
                      No pieces found for “{query}”. Try another search.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}