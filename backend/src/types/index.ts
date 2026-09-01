/**
 * Shared domain types.
 * These mirror the frontend Product shape and align with the planned
 * PostgreSQL schema (products / collections / categories tables).
 */

export type Category =
  | "Rings"
  | "Earrings"
  | "Necklaces"
  | "Bracelets"
  | "Pendants"
  | "Bridal Jewelry";

export type ProductBadge = "New" | "Best Seller" | "Limited" | "Iconic" | "Bridal";

export interface ProductDimensions {
  width?: string;
  length?: string;
  height?: string;
  weight?: string;
  stoneWeight?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  material?: string;
  price?: number;
  available: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  collection: string;
  price: number;
  material: string;
  gemstone: string;
  description: string;
  shortDescription: string;
  /** Supabase Storage paths or signed URLs. */
  images: string[];
  badge?: ProductBadge;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  dimensions: ProductDimensions;
  variants: ProductVariant[];
  occasion: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface ProductQuery {
  category?: string;
  collection?: string;
  material?: string;
  gemstone?: string;
  occasion?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "popular" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
}