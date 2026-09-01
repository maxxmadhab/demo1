import { motion, useReducedMotion } from "motion/react";
import type { Product } from "@/types/product";
import { useWishlist } from "@/context/WishlistContext";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md";
  label?: boolean;
  variant?: "ghost" | "solid";
}

export function WishlistButton({
  product,
  className,
  size = "md",
  label = false,
  variant = "ghost",
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const reducedMotion = useReducedMotion();
  const active = isWishlisted(product.id);

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      whileTap={reducedMotion ? undefined : { scale: 0.9 }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors duration-300",
        variant === "ghost"
          ? "bg-white/85 text-charcoal hover:bg-white"
          : "bg-charcoal text-ivory hover:bg-charcoal-light",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        className
      )}
    >
      <motion.span
        key={active ? "active" : "inactive"}
        initial={reducedMotion ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 24, mass: 0.6 }}
        className="flex items-center gap-2"
      >
        <Icon
          name="heart"
          size={size === "sm" ? 17 : 19}
          className={cn("transition-colors duration-300", active && "fill-gold-deep text-gold-deep")}
        />
      </motion.span>
      {label && (
        <span className="hidden font-body text-xs tracking-[0.08em] uppercase sm:inline">
          {active ? "Saved" : "Save"}
        </span>
      )}
    </motion.button>
  );
}