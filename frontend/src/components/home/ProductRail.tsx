import { useRef } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";

interface ProductRailProps {
  eyebrow: string;
  title: string;
  link: { to: string; label: string };
  products: Product[];
  className?: string;
  id?: string;
}

export function ProductRail({ eyebrow, title, link, products, className, id }: ProductRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section id={id} className={className}>
      <div className="container-jwel">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 lg:mb-10">
          <div>
            <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium text-charcoal sm:text-4xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={link.to}
              className="hidden items-center gap-2 font-body text-[0.66rem] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors duration-300 hover:text-gold-deep sm:inline-flex"
            >
              {link.label} <Icon name="arrow-right" size={14} />
            </Link>
            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                aria-label="Scroll products left"
                onClick={() => scrollBy(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors duration-300 hover:border-charcoal"
              >
                <Icon name="chevron-right" size={15} className="rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Scroll products right"
                onClick={() => scrollBy(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors duration-300 hover:border-charcoal"
              >
                <Icon name="chevron-right" size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:gap-5 sm:px-8 lg:px-12"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[68vw] shrink-0 snap-start sm:w-[46vw] md:w-[34vw] lg:w-[23.5vw] xl:w-[21vw]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}