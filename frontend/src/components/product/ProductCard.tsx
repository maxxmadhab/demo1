import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/types/product";
import { useUI } from "@/context/UIContext";
import { useCompare } from "@/context/CompareContext";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { formatPrice } from "@/utils/format";
import { cn } from "@/utils/cn";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

const LIGHT_BADGES = new Set(["New"]);

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const { openQuickView } = useUI();
  const { isCompared, toggleCompare } = useCompare();
  const reducedMotion = useReducedMotion();
  const compared = isCompared(product.id);

  return (
    <motion.article
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group flex flex-col", className)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-sand">
        <Link
          to={`/product/${product.slug}`}
          className="block aspect-[4/5] w-full"
          aria-label={product.name}
        >
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          />
          {product.images[1] && (
            <ImageWithFallback
              src={product.images[1]}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="absolute inset-0 hidden h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 md:block"
            />
          )}
        </Link>

        {/* Badge */}
        {product.badge && (
          <Badge
            tone={LIGHT_BADGES.has(product.badge) ? "light" : "dark"}
            className="absolute left-3 top-3"
          >
            {product.badge}
          </Badge>
        )}

        {/* Wishlist */}
        <div className="absolute right-3 top-3 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-within:translate-y-0 md:focus-within:opacity-100">
          <WishlistButton product={product} size="sm" className="shadow-soft" />
        </div>

        {/* Hover actions — Quick View + Compare */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="pointer-events-auto inline-flex items-center gap-2 bg-charcoal/85 px-4 py-2.5 font-body text-[0.65rem] font-medium uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-colors duration-300 hover:bg-charcoal"
            aria-label={`Quick view ${product.name}`}
          >
            <Icon name="eye" size={14} />
            Quick View
          </button>
          <button
            type="button"
            onClick={() => toggleCompare(product)}
            aria-pressed={compared}
            aria-label={compared ? "Remove from compare" : "Add to compare"}
            title="Compare"
            className={cn(
              "pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300",
              compared
                ? "bg-gold/90 text-ivory"
                : "bg-white/85 text-charcoal backdrop-blur-sm hover:bg-white"
            )}
          >
            <Icon
              name="compare"
              size={15}
              className={cn(compared && "fill-none text-ivory")}
            />
            {compared && <span className="sr-only">In compare</span>}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 flex flex-col gap-1">
        <p className="font-body text-[0.62rem] font-medium uppercase tracking-[0.22em] text-gold-deep/90">
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/product/${product.slug}`}
              className="block font-display text-[1.05rem] font-medium leading-snug text-charcoal transition-colors duration-300 hover:text-gold-deep"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 font-body text-[0.72rem] font-light text-stone">
              {product.material} · {product.gemstone}
            </p>
          </div>
          <p className="shrink-0 pt-0.5 font-body text-[0.82rem] font-medium text-charcoal">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </motion.article>
  );
}