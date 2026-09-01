import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useUI } from "@/context/UIContext";
import { useBag } from "@/context/BagContext";
import { useEscapeKey } from "@/hooks/useOverlayBehavior";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/utils/format";

export function BagDrawer() {
  const { bagOpen, setBagOpen } = useUI();
  const { items, subtotal, count, increment, decrement, setQuantity, removeFromBag } = useBag();
  const reducedMotion = useReducedMotion();

  useEscapeKey(bagOpen, () => setBagOpen(false));

  return (
    <AnimatePresence>
      {bagOpen && (
        <>
          <motion.button
            aria-label="Close shopping bag"
            className="fixed inset-0 z-[65] cursor-default bg-charcoal/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setBagOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            initial={reducedMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reducedMotion ? undefined : { x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[66] flex w-full max-w-[min(620px,100vw)] flex-col bg-ivory shadow-lift"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5 sm:px-8">
              <div>
                <p className="font-body text-[0.62rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
                  Your selection
                </p>
                <h2 className="font-display text-2xl font-medium text-charcoal">
                  Shopping bag {count > 0 && `· ${count}`}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setBagOpen(false)}
                aria-label="Close shopping bag"
                className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-sand"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
              {items.length === 0 ? (
                <div className="flex h-full min-h-72 flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand">
                    <Icon name="bag" size={22} className="text-stone" />
                  </div>
                  <p className="mt-4 font-display text-xl font-medium text-charcoal">
                    Your bag is empty
                  </p>
                  <p className="mt-2 max-w-xs font-body text-sm font-light text-stone">
                    Pieces you add will be kept here while you browse the collection.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setBagOpen(false)}
                    to="/catalog"
                  >
                    Explore the collection
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-charcoal/10">
                  {items.map(({ product, quantity }) => (
                    <li key={product.id} className="flex gap-5 py-6">
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={() => setBagOpen(false)}
                        className="relative block w-24 shrink-0 overflow-hidden bg-sand sm:w-28"
                      >
                        <ImageWithFallback
                          src={product.images[0]}
                          alt={product.name}
                          className="aspect-[4/5] w-full object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.2em] text-gold-deep">
                              {product.collection}
                            </p>
                            <Link
                              to={`/product/${product.slug}`}
                              onClick={() => setBagOpen(false)}
                              className="mt-0.5 block font-display text-lg font-medium leading-snug text-charcoal transition-colors hover:text-gold-deep"
                            >
                              {product.name}
                            </Link>
                            <p className="mt-0.5 font-body text-xs font-light text-stone">
                              {product.material} · {product.gemstone}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromBag(product.id)}
                            aria-label={`Remove ${product.name} from bag`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-sand hover:text-charcoal"
                          >
                            <Icon name="close" size={15} />
                          </button>
                        </div>

                        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                          <QuantityStepper
                            quantity={quantity}
                            onDecrement={() => {
                              if (quantity <= 1) removeFromBag(product.id);
                              else decrement(product.id);
                            }}
                            onIncrement={() => increment(product.id)}
                            onChange={(q) => setQuantity(product.id, q)}
                            label={`Quantity of ${product.name}`}
                          />
                          <p className="font-body text-[0.95rem] font-medium text-charcoal">
                            {formatPrice(product.price * quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-charcoal/10 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between pb-4">
                  <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.2em] text-stone">
                    Subtotal
                  </span>
                  <span className="font-display text-xl font-medium text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <Button variant="primary" className="w-full">
                  Proceed to checkout
                </Button>
                <p className="mt-3 text-center font-body text-[0.68rem] font-light text-stone">
                  Complimentary shipping worldwide · checkout coming soon
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
  onChange,
  label,
}: {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onChange: (q: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center border border-charcoal/20" aria-label={label}>
      <button
        type="button"
        onClick={onDecrement}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:bg-sand"
      >
        <Icon name="minus" size={13} />
      </button>
      <input
        type="number"
        min={1}
        max={99}
        value={quantity}
        onChange={(e) => {
          const q = parseInt(e.target.value, 10);
          if (!Number.isNaN(q)) onChange(q);
        }}
        aria-label="Quantity"
        className="h-9 w-11 border-x border-charcoal/20 bg-transparent text-center font-body text-sm text-charcoal focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center text-charcoal transition-colors hover:bg-sand"
      >
        <Icon name="plus" size={13} />
      </button>
    </div>
  );
}