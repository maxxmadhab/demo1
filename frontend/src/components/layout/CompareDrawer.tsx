import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useUI } from "@/context/UIContext";
import { useCompare } from "@/context/CompareContext";
import { useEscapeKey } from "@/hooks/useOverlayBehavior";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/format";
import type { Product } from "@/types/product";

function CompareMark({ value, yes }: { value: string; yes?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${yes ? "bg-gold/20 text-gold-deep" : "bg-sand text-stone"}`}
      >
        <Icon name={yes ? "check" : "minus"} size={9} />
      </span>
      <span className="font-body text-xs font-light text-charcoal/75">{value}</span>
    </span>
  );
}

const ROWS: { label: string; get: (p: Product) => string }[] = [
  { label: "Price", get: (p) => formatPrice(p.price) },
  { label: "Material", get: (p) => p.material },
  { label: "Gemstone", get: (p) => p.gemstone },
  { label: "Occasion", get: (p) => p.occasion },
  { label: "Width", get: (p) => p.dimensions.width ?? "—" },
  { label: "Weight", get: (p) => p.dimensions.weight ?? "—" },
];

export function CompareDrawer() {
  const { compareOpen, setCompareOpen } = useUI();
  const { items, removeFromCompare, clearCompare } = useCompare();
  const reducedMotion = useReducedMotion();

  useEscapeKey(compareOpen, () => setCompareOpen(false));

  return (
    <AnimatePresence>
      {compareOpen && (
        <>
          <motion.button
            aria-label="Close compare"
            className="fixed inset-0 z-[65] cursor-default bg-charcoal/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setCompareOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Compare products"
            initial={reducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reducedMotion ? undefined : { x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[66] flex w-full max-w-[min(640px,100vw)] flex-col bg-ivory shadow-lift"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5 sm:px-8">
              <div>
                <p className="font-body text-[0.62rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
                  Compare
                </p>
                <h2 className="font-display text-2xl font-medium text-charcoal">
                  {items.length} piece{items.length === 1 ? "" : "s"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearCompare}
                    className="font-body text-[0.65rem] font-medium uppercase tracking-[0.18em] text-stone underline underline-offset-4 hover:text-charcoal"
                  >
                    Clear all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close compare"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-sand"
                >
                  <Icon name="close" size={19} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {items.length === 0 ? (
                <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand">
                    <Icon name="compare" size={22} className="text-stone" />
                  </div>
                  <p className="mt-4 font-display text-xl font-medium text-charcoal">
                    Nothing to compare yet
                  </p>
                  <p className="mt-2 max-w-xs font-body text-sm font-light text-stone">
                    Use the compare button on any product card to select up to three pieces.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {items.map((product) => (
                    <div key={product.id} className="flex flex-col">
                      <div className="relative overflow-hidden bg-sand">
                        <Link to={`/product/${product.slug}`} onClick={() => setCompareOpen(false)}>
                          <ImageWithFallback
                            src={product.images[0]}
                            alt={product.name}
                            className="aspect-[3/4] w-full object-cover"
                          />
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCompare(product.id)}
                          aria-label={`Remove ${product.name} from compare`}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-charcoal backdrop-blur-sm hover:bg-white"
                        >
                          <Icon name="close" size={13} />
                        </button>
                      </div>
                      <p className="mt-3 font-display text-[0.95rem] font-medium leading-snug text-charcoal">
                        {product.name}
                      </p>
                      <div className="mt-3 space-y-2.5 border-t border-charcoal/10 pt-3">
                        {ROWS.map((row) => (
                          <div key={row.label} className="flex flex-col gap-0.5">
                            <span className="font-body text-[0.6rem] font-medium uppercase tracking-[0.16em] text-stone">
                              {row.label}
                            </span>
                            <CompareMark value={row.get(product)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-charcoal/10 px-6 py-5 sm:px-8">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setCompareOpen(false)}
              >
                Keep browsing
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}