import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { getProducts, priceBounds, type SortKey, type ProductFilters } from "@/services/productService";
import { buildFilterOptions, EMPTY_FILTERS, activeFilterCount, type FilterState } from "@/components/catalog/catalogFilters";
import { FilterControls, type FilterOptionSets } from "@/components/catalog/FilterControls";
import { FilterDrawer } from "@/components/catalog/FilterDrawer";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/shared/States";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LoadingState } from "@/components/shared/States";
import { titleCase } from "@/utils/format";

const SORT_KEYS: SortKey[] = ["featured", "newest", "popular", "price-asc", "price-desc"];

function parseSort(raw: string | null): SortKey {
  return raw && (SORT_KEYS as string[]).includes(raw) ? (raw as SortKey) : "featured";
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const reducedMotion = useReducedMotion();

  const [filters, setFilters] = useState<FilterState>(() => {
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const q = searchParams.get("q") ?? undefined;
    return {
      categories: category ? [category] : [],
      collections: collection ? [collection] : [],
      materials: [],
      gemstones: [],
      occasions: [],
      priceRange: null,
      searchTerm: q,
    };
  });

  const [sort, setSort] = useState<SortKey>(() => parseSort(searchParams.get("sort")));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(filters);
  const [results, setResults] = useState<Awaited<ReturnType<typeof getProducts>>>([]);

  const options: FilterOptionSets = useMemo(() => buildFilterOptions(), []);

  // Sync URL params → initial filters on mount (and on NavLink clicks that change params)
  useEffect(() => {
    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const q = searchParams.get("q") ?? undefined;
    setAppliedFilters((prev) => ({
      ...prev,
      categories: category ? [category] : [],
      collections: collection ? [collection] : [],
      searchTerm: q,
    }));
    setFilters((prev) => ({
      ...prev,
      categories: category ? [category] : [],
      collections: collection ? [collection] : [],
      searchTerm: q,
    }));
  }, [searchParams]);

  const runQuery = async (f: FilterState, s: SortKey) => {
    setLoading(true);
    const productFilters: ProductFilters = {
      categories: f.categories,
      collections: f.collections,
      materials: f.materials,
      gemstones: f.gemstones,
      occasions: f.occasions,
      priceRange: f.priceRange,
      sort: s,
      searchTerm: f.searchTerm,
    };
    try {
      const res = await getProducts(productFilters);
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  // Apply with debounce when filters change on desktop
  useEffect(() => {
    const t = window.setTimeout(() => {
      setAppliedFilters(filters);
      runQuery(filters, sort);
    }, 250);
    return () => window.clearTimeout(t);
  }, [filters, sort]);

  const resetFilters = () => {
    setFilters({ ...EMPTY_FILTERS, categories: [], collections: [], searchTerm: "" });
    setAppliedFilters({ ...EMPTY_FILTERS, searchTerm: "" });
    if (searchParams.get("category") || searchParams.get("collection") || searchParams.get("q")) {
      setSearchParams({});
    }
  };

  const title = useMemo(() => {
    const category = appliedFilters.categories[0] ?? null;
    const collection = appliedFilters.collections[0] ?? null;
    const q = appliedFilters.searchTerm;
    if (category) return category;
    if (collection) return `${collection}`;
    if (q) return `Results for “${q}”`;
    return "The Collection";
  }, [appliedFilters]);

  const count = activeFilterCount(filters);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Header */}
      <section className="container-jwel pb-8 pt-10 sm:pt-14">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gold-deep">
            {appliedFilters.collections[0] ? `The ${appliedFilters.collections[0]} Story` : "The Maison"}
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-[1.05] text-charcoal sm:text-5xl lg:text-6xl">
            {titleCase(title)}
          </h1>
          <p className="mt-4 max-w-xl font-body text-[0.9rem] font-light leading-relaxed text-stone">
            Considered pieces, crafted by hand and made to last. Discover the full
            collection — each piece told through its own details.
          </p>
        </motion.div>
      </section>

      {/* Desktop filter bar */}
      <section className="sticky top-14 z-30 hidden border-y border-charcoal/[0.07] bg-ivory/90 backdrop-blur-xl lg:top-16 lg:block">
        <div className="container-jwel flex flex-wrap items-center gap-2.5 py-3">
          <FilterControls
            filters={filters}
            onFiltersChange={setFilters}
            sort={sort}
            onSortChange={setSort}
            options={options}
            priceBounds={priceBounds}
            onReset={resetFilters}
          />
        </div>
      </section>

      {/* Result count + mobile actions */}
      <section className="container-jwel flex items-center justify-between pb-6 pt-6 lg:pt-8">
        <p className="font-body text-xs font-light text-stone" role="status" aria-live="polite">
          {loading ? "Loading…" : `${results.length} piece${results.length === 1 ? "" : "s"}`}
        </p>

        {/* Mobile filter/sort buttons */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-charcoal/15 px-4 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] text-charcoal/80 transition-colors duration-300 hover:border-charcoal/40"
          >
            <Icon name="filter" size={14} />
            Filter
            {count > 0 && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold-deep px-1 text-[0.6rem] font-semibold text-ivory">
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-charcoal/15 px-4 font-body text-[0.7rem] font-medium uppercase tracking-[0.14em] text-charcoal/80 transition-colors duration-300 hover:border-charcoal/40"
          >
            Sort
            <Icon name="chevron-down" size={12} />
          </button>
        </div>
      </section>

      {/* Grid */}
      <section className="container-jwel pb-24">
        {loading ? (
          <LoadingState label="Curating the collection" />
        ) : results.length === 0 ? (
          <EmptyState
            title="No pieces found"
            message="Try adjusting your filters — or rediscover the full collection."
            action={
              <Button variant="outline" onClick={resetFilters} size="sm">
                Reset all filters
              </Button>
            }
          />
        ) : (
          <ProductGrid products={results} />
        )}
      </section>

      {/* Mobile bottom-sheet */}
      <FilterDrawer
        open={drawerOpen}
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        onApply={() => setDrawerOpen(false)}
        onReset={resetFilters}
        onClose={() => setDrawerOpen(false)}
        options={options}
        priceBounds={priceBounds}
      />
    </div>
  );
}