/**
 * Shared domain types.
 * These mirror the frontend Product shape and align with the planned
 * PostgreSQL schema (products / collections / categories tables).
 */

export type Category =
  | "New Arrivals"
  | "Rings"
  | "Necklaces"
  | "Earrings"
  | "Bracelets";

export type ProductBadge = "New" | "Best Seller" | "Limited" | "Iconic" | "Bridal";

export interface ProductDimensions {
  width?: string;
  length?: string;
  height?: string;
  weight?: string;
  stoneWeight?: string;
}

export type ProductVariant = Record<string, never>;

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
  /** Order list of public image URLs. */
  images: string[];
  badge?: ProductBadge;
  featured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  dimensions: ProductDimensions;
  createdAt: string;
  updatedAt: string;
}

/** Row shape as stored in Supabase ('products'). */
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  material: string;
  gemstone: string;
  description: string;
  short_description: string;
  dimensions: ProductDimensions;
  badge: ProductBadge | null;
  is_new: boolean;
  is_best_seller: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
}

/** Payload used to create/update a product (admin). */
export interface ProductInput {
  name: string;
  slug?: string;
  category: Category;
  price: number;
  material?: string;
  gemstone?: string;
  description?: string;
  shortDescription?: string;
  dimensions?: ProductDimensions;
  badge?: ProductBadge | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
}

export interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "popular" | "price-asc" | "price-desc";
  page?: number;
  perPage?: number;
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