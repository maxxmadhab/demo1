export type Category =
  | "New Arrivals"
  | "Rings"
  | "Necklaces"
  | "Earrings"
  | "Bracelets";

export type Material =
  | "18K Gold"
  | "14K Gold"
  | "Platinum"
  | "Rose Gold"
  | "White Gold"
  | "Yellow Gold"
  | string;

export type Gemstone =
  | "Diamond"
  | "Sapphire"
  | "Emerald"
  | "Ruby"
  | "Pearl"
  | "Opal"
  | "Amethyst"
  | "Topaz"
  | "Aquamarine"
  | "Garnet"
  | "No Gemstone"
  | string;

export type Occasion = string;

export type Badge = "New" | "Best Seller" | "Limited" | "Iconic" | "Bridal";

export type ProductVariant = Record<string, never>;

export interface ProductDimensions {
  width?: string;
  length?: string;
  height?: string;
  weight?: string;
  stoneWeight?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  material: string;
  gemstone: string;
  description: string;
  shortDescription: string;
  images: string[];
  badge?: Badge;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  dimensions: ProductDimensions;
  createdAt?: string;
  updatedAt?: string;

  /** Deprecated — retained for the legacy customer UI; always empty for DB products. */
  collection?: string;
  variants?: ProductVariant[];
  occasion?: Occasion;
}

export interface ProductFilters {
  categories?: string[];
  searchTerm?: string;
  priceRange?: [number, number] | null;
  sort?: SortKey;

  /** Deprecated filter dimensions — kept for compatibility, always empty for DB products. */
  collections?: string[];
  materials?: string[];
  gemstones?: string[];
  occasions?: string[];
}

export type SortKey = "featured" | "newest" | "popular" | "price-asc" | "price-desc";

export interface PaginatedProducts {
  data: Product[];
  page: number;
  perPage: number;
  total: number;
}

