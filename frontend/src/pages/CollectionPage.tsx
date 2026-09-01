import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { collections, type Collection } from "@/data/collections";
import { getProductsByCollection, getProducts, type SortKey } from "@/services/productService";
import type { Product } from "@/types/product";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortMenu } from "@/components/catalog/SortMenu";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/States";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/utils/cn";

export default function CollectionPage() {
  const { collection: slug } = useParams<{ collection: string }>();
  const reducedMotion = usePrefersReducedMotion();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("featured");
  const [related, setRelated] = useState<Product[]>([]);

  const collectionMeta = useMemo(
    () => collections.find((c) => c.slug === (slug?.toLowerCase() ?? "")) ?? null,
    [slug]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      const meta = collectionMeta;
      setCollection(meta);
      if (!meta) {
        setLoading(false);
        return;
      }
      const items = await getProductsByCollection(meta.name);
      if (!cancelled) {
        setProducts(items);
        setLoading(false);
      }
      const others = await getProducts();
      const otherPieces = others
        .filter((p) => p.collection.toLowerCase() !== meta.name.toLowerCase())
        .slice(0, 4);
      if (!cancelled) setRelated(otherPieces);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, collectionMeta]);

  // Local sort for collection grid
  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
        break;
      case "popular":
        list.sort((a, b) => Number(b.isBestSeller ?? false) - Number(a.isBestSeller ?? false));
        break;
      default:
        break;
    }
    return list;
  }, [products, sort]);

  const collectionIndex = collectionMeta
    ? collections.findIndex((c) => c.slug === collectionMeta.slug)
    : -1;
  const prevCollection = collectionIndex > 0 ? collections[collectionIndex - 1] : null;
  const nextCollection =
    collectionIndex >= 0 && collectionIndex < collections.length - 1
      ? collections[collectionIndex + 1]
      : null;

  if (!loading && !collection) {
    return (
      <div className="pt-16 lg:pt-20">
        <div className="container-jwel py-24 text-center">
          <h1 className="font-display text-3xl font-medium text-charcoal">Collection not found</h1>
          <p className="mx-auto mt-3 max-w-md font-body text-sm font-light text-stone">
            That collection doesn't exist. Explore every piece instead.
          </p>
          <Button to="/catalog" variant="outline" className="mt-8">
            Browse the full collection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative flex min-h-[56vh] items-end overflow-hidden">
        {collection && (
          <>
            <ImageWithFallback
              src={collection.hero}
              alt={collection.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
            <div className="container-jwel relative pb-12 pt-40">
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-body text-[0.68rem] font-medium uppercase tracking-[0.3em] text-champagne"
              >
                The {collection.name} collection {collection.spell && `· ${collection.spell}`}
              </motion.p>
              <motion.h1
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="mt-3 font-display text-5xl font-medium text-ivory sm:text-6xl lg:text-7xl"
              >
                {collection.name}
              </motion.h1>
              <motion.p
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="mt-5 max-w-xl font-body text-[0.95rem] font-light leading-relaxed text-ivory/85"
              >
                {collection.tagline}
              </motion.p>
            </div>
          </>
        )}
      </section>

      {/* Description band */}
      <section className="container-jwel py-14 lg:flex lg:items-start lg:justify-between lg:gap-16 lg:py-20">
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-xl font-display text-xl font-light leading-relaxed text-charcoal/85 sm:text-2xl"
        >
          {collection?.description}
        </motion.p>
        <div className="mt-8 shrink-0 lg:mt-0 lg:text-right">
          <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
            Collection ethos
          </p>
          <p className="mt-2 font-display text-2xl font-medium text-charcoal">
            {collection?.accent}
          </p>
        </div>
      </section>

      {/* Editorial split */}
      <section className="container-jwel pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <div className="relative overflow-hidden md:col-span-2 md:aspect-[3/4]">
            <ImageWithFallback
              src={collection?.editorial ?? ""}
              alt={`${collection?.name} editorial`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="relative hidden overflow-hidden md:col-span-3 md:block">
            <ImageWithFallback
              src={collection?.hero ?? ""}
              alt={`${collection?.name} campaign`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Products with sort */}
      <section className="container-jwel pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-charcoal/10 pb-5">
          <div>
            <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
              The pieces
            </p>
            <h2 className="mt-1 font-display text-3xl font-medium text-charcoal">
              {products.length} signature pieces
            </h2>
          </div>
          <div className="relative">
            <SortMenu value={sort} onChange={setSort} />
          </div>
        </div>
        {loading ? (
          <LoadingState label={`Curating ${collection?.name}`} />
        ) : (
          <ProductGrid products={sorted} />
        )}
      </section>

      {/* Related — other collections */}
      {related.length > 0 && (
        <section className="bg-ivory-deep/50 py-20">
          <div className="container-jwel">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
                  From other ateliers
                </p>
                <h2 className="mt-1 font-display text-3xl font-medium text-charcoal">
                  Continue the story
                </h2>
              </div>
              <Button to="/catalog" variant="ghost" size="sm" className="!pr-0">
                View all <Icon name="arrow-right" size={14} />
              </Button>
            </div>
            <div className="mt-8">
              <ProductGrid products={related} />
            </div>
          </div>
        </section>
      )}

      {/* Prev / next collection navigation */}
      {collection && (prevCollection || nextCollection) && (
        <section className="border-y border-charcoal/[0.07] bg-ivory">
          <div className="container-jwel flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              {prevCollection ? (
                <Link to={`/collection/${prevCollection.slug}`} className="group">
                  <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.22em] text-gold-deep">
                    Previous collection
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-display text-xl font-medium text-charcoal transition-colors group-hover:text-gold-deep">
                    <Icon name="arrow-right" size={16} className="rotate-180" />
                    {prevCollection.name}
                  </p>
                </Link>
              ) : (
                <span className="opacity-40">
                  <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.22em] text-gold-deep">
                    Previous collection
                  </p>
                  <p className="mt-1 font-display text-xl font-medium text-charcoal">—</p>
                </span>
              )}
              {nextCollection && (
                <Link to={`/collection/${nextCollection.slug}`} className="group text-right">
                  <p className="font-body text-[0.6rem] font-medium uppercase tracking-[0.22em] text-gold-deep">
                    Next collection
                  </p>
                  <p className="mt-1 flex items-center justify-end gap-2 font-display text-xl font-medium text-charcoal transition-colors group-hover:text-gold-deep">
                    {nextCollection.name}
                    <Icon name="arrow-right" size={16} />
                  </p>
                </Link>
              )}
            </div>
            <Button to="/catalog" variant="outline" size="sm" className="shrink-0">
              View all products <Icon name="arrow-right" size={14} />
            </Button>
          </div>
        </section>
      )}

      {/* Collection index */}
      <section className="container-jwel py-16">
        <p className="text-center font-body text-[0.65rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
          Explore all collections
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              to={`/collection/${c.slug}`}
              className={cn(
                "font-display text-xl font-medium transition-colors duration-300 hover:text-gold-deep",
                c.slug === slug ? "text-gold-deep" : "text-charcoal/70"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}