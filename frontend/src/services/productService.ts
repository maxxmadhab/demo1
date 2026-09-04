import type {
  Product,
  ProductFilters,
  PaginatedProducts,
  SortKey,
} from "@/types/product";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/config/catalog";

export type { Product, SortKey, ProductFilters } from "@/types/product";

/**
 * Customer-facing product service.
 *
 * Reads the catalog straight from Supabase using the public (anon) client.
 * RLS grants public SELECT on `products`/`product_images`, so no backend is
 * required for the storefront. Admin writes go through the backend API
 * (see `adminProductService`).
 */

interface ImageRow {
  image_url: string;
  sort_order: number;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | string;
  material: string;
  gemstone: string;
  description: string;
  short_description: string;
  dimensions: Record<string, string> | null;
  badge: string | null;
  is_new: boolean;
  is_best_seller: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ImageRow[];
}

function mapRow(row: ProductRow): Product {
  const images = (row.product_images ?? [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((i) => i.image_url);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    price: Number(row.price),
    material: row.material ?? "",
    gemstone: row.gemstone ?? "",
    description: row.description ?? "",
    shortDescription: row.short_description ?? "",
    images,
    badge: (row.badge as Product["badge"]) ?? undefined,
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    dimensions: row.dimensions ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const PRODUCT_SELECT = "*, product_images(image_url, sort_order)";

async function fetchAll(limit = 2000) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapRow);
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let query = supabase.from("products").select(PRODUCT_SELECT);

  if (filters.categories && filters.categories.length) {
    query = query.in("category", filters.categories);
  }
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const term = `%${filters.searchTerm.trim()}%`;
    query = query.or(`name.ilike.${term},description.ilike.${term},short_description.ilike.${term}`);
  }

  const { data, error } = await query.limit(2000);
  if (error) throw error;

  let result = ((data ?? []) as unknown as ProductRow[]).map(mapRow);

  if (filters.priceRange) {
    result = result.filter(
      (p) => p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1],
    );
  }

  return sortProducts(result, filters.sort ?? "featured");
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as unknown as ProductRow) : undefined;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as unknown as ProductRow) : undefined;
}

/** No collections exist anymore — always empty (kept for API compatibility). */
export async function getProductsByCollection(_collection: string): Promise<Product[]> {
  return [];
}

export async function getCollections(): Promise<string[]> {
  return [];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const all = await fetchAll();
  return all.filter((p) => p.featured).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const all = await fetchAll();
  return sortProducts(all.filter((p) => p.isNew), "newest").slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const all = await fetchAll();
  return sortProducts(all.filter((p) => p.isBestSeller), "popular").slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await fetchAll();
  const sameCategory = all.filter((p) => p.category === product.category && p.id !== product.id);
  const rest = all.filter((p) => p.category !== product.category && p.id !== product.id);
  return [...sameCategory, ...rest].slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  return getProducts({ searchTerm: query, sort: "popular" });
}

export const priceBounds: { min: number; max: number } = { min: 0, max: 1000000 };

export function getUniqueValues(): {
  categories: string[];
  collections: string[];
  materials: string[];
  gemstones: string[];
  occasions: string[];
} {
  return {
    categories: [...CATEGORIES],
    collections: [],
    materials: [],
    gemstones: [],
    occasions: [],
  };
}

export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const all = await fetchAll();
  if (!all.length) return { min: 0, max: 0 };
  const prices = all.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      sorted.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      );
      break;
    case "popular":
      sorted.sort((a, b) => Number(b.isBestSeller ?? false) - Number(a.isBestSeller ?? false));
      break;
    case "featured":
    default:
      sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
      break;
  }
  return sorted;
}

/** Paginated raw query — used by pages that need paging metadata. */
export async function getProductsPage(
  filters: ProductFilters = {},
  page = 1,
  perPage = 48,
): Promise<PaginatedProducts> {
  const data = await getProducts(filters);
  const total = data.length;
  const start = (page - 1) * perPage;
  return {
    data: data.slice(start, start + perPage),
    page,
    perPage,
    total,
  };
}
