import { FilterDropdown, type MultiValue } from "@/components/catalog/FilterDropdown";
import { PriceFilter } from "@/components/catalog/PriceFilter";
import { SortMenu } from "@/components/catalog/SortMenu";
import {
  type FilterState,
  activeFilterCount,
} from "@/components/catalog/catalogFilters";
import type { SortKey } from "@/services/productService";

export interface FilterOptionSets {
  categoryOptions: MultiValue[];
  collectionOptions: MultiValue[];
  materialOptions: MultiValue[];
  gemstoneOptions: MultiValue[];
  occasionOptions: MultiValue[];
}

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  options: FilterOptionSets;
  priceBounds: { min: number; max: number };
  onReset: () => void;
  compact?: boolean;
}

export function FilterControls({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  options,
  priceBounds,
  onReset,
  compact,
}: FilterControlsProps) {
  const update = (patch: Partial<FilterState>) => onFiltersChange({ ...filters, ...patch });
  const count = activeFilterCount(filters);

  return (
    <div className={compact ? "space-y-4" : "flex flex-wrap items-center gap-2.5"}>
      {!compact && <span className="sr-only">Filter controls</span>}
      <FilterDropdown
        label="Category"
        options={options.categoryOptions}
        selected={filters.categories}
        onChange={(categories) => update({ categories })}
        count={filters.categories.length}
      />
      <FilterDropdown
        label="Material"
        options={options.materialOptions}
        selected={filters.materials}
        onChange={(materials) => update({ materials })}
        count={filters.materials.length}
      />
      <FilterDropdown
        label="Occasion"
        options={options.occasionOptions}
        selected={filters.occasions}
        onChange={(occasions) => update({ occasions })}
        count={filters.occasions.length}
      />
      <FilterDropdown
        label="Gemstone"
        options={options.gemstoneOptions}
        selected={filters.gemstones}
        onChange={(gemstones) => update({ gemstones })}
        count={filters.gemstones.length}
        searchable
      />

      <PriceFilter
        min={priceBounds.min}
        max={priceBounds.max}
        value={filters.priceRange}
        onChange={(priceRange) => update({ priceRange })}
      />

      {count > 0 && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 font-body text-[0.68rem] font-medium uppercase tracking-[0.16em] text-stone underline underline-offset-4 transition-colors hover:text-charcoal"
        >
          Reset ({count})
        </button>
      )}

      <div className={compact ? "pt-1" : "ml-auto"}>
        <SortMenu value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}