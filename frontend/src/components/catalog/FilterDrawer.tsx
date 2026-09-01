import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useEscapeKey, useBodyScrollLock } from "@/hooks/useOverlayBehavior";
import { Icon } from "@/components/ui/Icon";
import { FilterControls, type FilterOptionSets } from "@/components/catalog/FilterControls";
import type { FilterState } from "@/components/catalog/catalogFilters";
import { activeFilterCount } from "@/components/catalog/catalogFilters";
import type { SortKey } from "@/services/productService";

interface FilterDrawerProps {
  open: boolean;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  options: FilterOptionSets;
  priceBounds: { min: number; max: number };
}

export function FilterDrawer({
  open,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  onApply,
  onReset,
  onClose,
  options,
  priceBounds,
}: FilterDrawerProps) {
  const reducedMotion = useReducedMotion();
  useEscapeKey(open, onClose);
  useBodyScrollLock(open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Close filters"
            className="fixed inset-0 z-[65] bg-charcoal/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filter and sort products"
            initial={reducedMotion ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reducedMotion ? undefined : { y: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[66] flex max-h-[86vh] flex-col rounded-t-2xl bg-ivory shadow-lift sm:hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-charcoal/15" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-3 pt-3">
              <div>
                <p className="font-body text-[0.62rem] font-medium uppercase tracking-[0.24em] text-gold-deep">
                  Refine
                </p>
                <h2 className="font-display text-2xl font-medium leading-tight text-charcoal">
                  Filter & sort
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal hover:bg-sand"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <FilterControls
                filters={filters}
                onFiltersChange={onFiltersChange}
                sort={sort}
                onSortChange={onSortChange}
                options={options}
                priceBounds={priceBounds}
                onReset={onReset}
                compact
              />
              <p className="mt-4 font-body text-xs font-light text-stone">
                {activeFilterCount(filters)} active filter{activeFilterCount(filters) === 1 ? "" : "s"}
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-charcoal/10 px-6 py-4">
              <button
                type="button"
                onClick={onReset}
                className="flex-1 border border-charcoal/25 px-6 py-3.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.16em] text-charcoal transition-colors duration-300 hover:border-charcoal"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={onApply}
                className="flex-[2] bg-charcoal px-6 py-3.5 font-body text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ivory transition-colors duration-300 hover:bg-charcoal-light"
              >
                Apply filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}