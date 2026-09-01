import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Icon } from "@/components/ui/Icon";
import { imageAlt } from "@/utils/images";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reducedMotion = useReducedMotion();
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goTo = useCallback(
    (i: number) => {
      const next = ((i % images.length) + images.length) % images.length;
      setDirection(next > index ? 1 : -1);
      setIndex(next);
    },
    [index, images.length]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image with swipe */}
      <div
        className="relative overflow-hidden bg-sand"
        onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStart === null) return;
          const delta = e.changedTouches[0].clientX - touchStart;
          if (Math.abs(delta) > 48) {
            if (delta < 0) next();
            else prev();
          }
          setTouchStart(null);
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            initial={reducedMotion ? false : { opacity: 0, x: direction > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: direction > 0 ? -60 : 60 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5]"
          >
            <ImageWithFallback
              src={images[index]}
              alt={imageAlt(name, index)}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows (desktop + touch affordance hidden on mobile swipes) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal backdrop-blur-sm transition-colors hover:bg-white sm:flex"
            >
              <Icon name="chevron-right" size={17} className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-charcoal backdrop-blur-sm transition-colors hover:bg-white sm:flex"
            >
              <Icon name="chevron-right" size={17} />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/85 px-3 py-1 font-body text-[0.65rem] font-medium tracking-[0.14em] text-charcoal backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5" role="tablist" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={index === i}
              aria-label={`View image ${i + 1}`}
              onClick={() => goTo(i)}
              onMouseEnter={() => goTo(i)}
              className={cn(
                "h-20 w-16 shrink-0 overflow-hidden bg-sand transition-all duration-300 sm:h-24 sm:w-20",
                index === i ? "ring-1 ring-gold-deep" : "opacity-75 hover:opacity-100"
              )}
            >
              <ImageWithFallback src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}