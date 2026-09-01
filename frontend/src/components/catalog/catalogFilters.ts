import { getUniqueValues } from "@/services/productService";
import type { MultiValue } from "@/components/catalog/FilterDropdown";

export interface FilterState {
  categories: string[];
  collections: string[];
  materials: string[];
  gemstones: string[];
  occasions: string[];
  priceRange: [number, number] | null;
  searchTerm?: string;
}

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  collections: [],
  materials: [],
  gemstones: [],
  occasions: [],
  priceRange: null,
  searchTerm: undefined,
};

export function activeFilterCount(f: FilterState): number {
  return (
    f.categories.length +
    f.collections.length +
    f.materials.length +
    f.gemstones.length +
    f.occasions.length +
    (f.priceRange ? 1 : 0)
  );
}

const toOptions = (values: string[]): MultiValue[] =>
  values.map((v) => ({ label: v, value: v }));

export function buildFilterOptions() {
  const uniq = getUniqueValues();
  return {
    categoryOptions: toOptions(uniq.categories),
    collectionOptions: toOptions(
      [...uniq.collections].sort((a, b) => a.localeCompare(b))
    ),
    materialOptions: toOptions(uniq.materials),
    gemstoneOptions: toOptions([...uniq.gemstones].sort((a, b) => a.localeCompare(b))),
    occasionOptions: toOptions(uniq.occasions),
  };
}