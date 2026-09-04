import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useState } from "react";
import { useUI } from "@/context/UIContext";
import { useBag } from "@/context/BagContext";
import { useEscapeKey } from "@/hooks/useOverlayBehavior";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { formatPrice } from "@/utils/format";

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, setBagOpen } = useUI();
  const { addToBag } = useBag();
  const reducedMotion = useReducedMotion();
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  useEscapeKey(Boolean(quickViewProduct), closeQuickView);

  const handleClose = () => {
    closeQuickView();
    setImageIndex(0);
    setAdded(false);
  };

  const handleAddToBag = () => {
    if (!quickViewProduct) return;
    addToBag(quickViewProduct);
    setAdded(true);
    window.setTimeout(() => {
      handleClose();
      setBagOpen(true);
    }, 350);
  };

  return (
    <AnimatePresence>
      {quickViewProduct && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-charcoal/55 p-4 backdrop-blur-sm sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Quick view: ${quickViewProduct.name}`}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 0.97, y: 16, transition: { duration: 0.25 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl overflow-hidden bg-ivory shadow-lift"
          >
            <div className="grid max-h-[85vh] grid-cols-1 md:max-h-[80vh] md:grid-cols-2">
              {/* Image */}
              <div className="relative h-72 bg-sand sm:h-80 md:h-auto md:min-h-[30rem]">
                {quickViewProduct.images[imageIndex] && (
                  <ImageWithFallback
                    src={quickViewProduct.images[imageIndex]}
                    alt={quickViewProduct.name}
                    className="h-full w-full object-cover"
                  />
                )}
                {quickViewProduct.badge && (
                  <Badge className="absolute left-4 top-4">{quickViewProduct.badge}</Badge>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close quick view"
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-charcoal backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <Icon name="close" size={19} />
                </button>

                {quickViewProduct.images.length > 1 && (
                  <div className="absolute inset-x-4 bottom-4 flex justify-center gap-2">
                    {quickViewProduct.images.slice(0, 4).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Show image ${i + 1}`}
                        onClick={() => setImageIndex(i)}
                        className={`h-[3px] transition-all duration-500 ${
                          imageIndex === i ? "w-8 bg-charcoal" : "w-4 bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col overflow-y-auto p-6 sm:p-9 md:p-10">
                <p className="font-body text-[0.62rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
                  {quickViewProduct.category}
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium leading-snug text-charcoal sm:text-3xl">
                  {quickViewProduct.name}
                </h2>
                <p className="mt-3 font-body text-lg font-normal text-charcoal">
                  {formatPrice(quickViewProduct.price)}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-body text-xs font-light text-stone">
                  <span>
                    <strong className="font-medium text-charcoal">Material</strong> · {quickViewProduct.material}
                  </span>
                  <span>
                    <strong className="font-medium text-charcoal">Gemstone</strong> · {quickViewProduct.gemstone}
                  </span>
                </div>

                <p className="mt-5 font-body text-[0.88rem] font-light leading-relaxed text-charcoal/75">
                  {quickViewProduct.shortDescription}
                </p>


                {/* Thumbs */}
                {quickViewProduct.images.length > 1 && (
                  <div className="mt-6 flex gap-2">
                    {quickViewProduct.images.slice(0, 4).map((src, i) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setImageIndex(i)}
                        aria-label={`View image ${i + 1} of ${quickViewProduct.name}`}
                        className={`h-14 w-12 overflow-hidden bg-sand transition-all duration-300 ${
                          imageIndex === i ? "ring-1 ring-gold-deep" : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <ImageWithFallback src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto pt-8">
                  <div className="flex flex-1 items-center justify-center gap-4">
                    <WishlistButton product={quickViewProduct} label />
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={handleAddToBag}
                      aria-label={`Add ${quickViewProduct.name} to bag`}
                    >
                      {added ? (
                        <>
                          <Icon name="check" size={16} /> Added to Bag
                        </>
                      ) : (
                        "Add to Bag"
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-5">
                    <Link
                      to={`/contact?product=${encodeURIComponent(quickViewProduct.name)}&category=${encodeURIComponent(quickViewProduct.category)}`}
                      onClick={handleClose}
                      className="inline-flex items-center gap-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-gold-deep underline-offset-4 transition-colors hover:text-charcoal hover:underline"
                    >
                      <Icon name="mail" size={14} />
                      Enquire about this piece
                    </Link>
                    <span className="h-3 w-px bg-charcoal/15" aria-hidden="true" />
                    <Link
                      to={`/product/${quickViewProduct.slug}`}
                      onClick={handleClose}
                      className="inline-flex items-center gap-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.2em] text-charcoal underline-offset-4 transition-colors hover:text-gold-deep hover:underline"
                    >
                      View full details <Icon name="arrow-right" size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}