import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/utils/cn";

interface ProductGridProps {
  products: Product[];
  className?: string;
  cardClassName?: string;
  prioritySlugs?: string[];
}

export function ProductGrid({ products, className, cardClassName, prioritySlugs }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-3 lg:gap-y-14 xl:grid-cols-4",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={prioritySlugs?.includes(product.slug) ?? false}
          className={cardClassName}
        />
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <div className="aspect-[4/5] w-full animate-pulse bg-sand" />
      <div className="mt-4 space-y-2">
        <div className="h-2.5 w-20 animate-pulse bg-sand" />
        <div className="h-4 w-3/4 animate-pulse bg-sand" />
      </div>
    </div>
  );
}