import type { Product } from "@/types/product";
import { products } from "@/data/products";

/**
 * Product service abstraction.
 *
 * UI components should NEVER import the mock array directly.
 * These functions will later hit the Express API → Supabase without
 * requiring changes anywhere else in the application.
 */

export type SortKey = "featured" | "newest" | "popular" | "price-asc" | "price-desc";

export interface ProductFilters {
  categories?: string[];
  collections?: string[];
  materials?: string[];
  occasions?: string[];
  gemstones?: string[];
  priceRange?: [number, number] | null;
  searchTerm?: string;
  sort?: SortKey;
}

const PRICE_RANGE: [number, number] = [
  Math.min(...products.map((p) => p.price)),
  Math.max(...products.map((p) => p.price)),
];

export const priceBounds: { min: number; max: number } = {
  min: PRICE_RANGE[0],
  max: PRICE_RANGE[1],
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  let result = [...products];

  const { categories: cats, collections, materials, occasions, gemstones, priceRange, searchTerm } = filters;

  if (cats && cats.length) {
    result = result.filter((p) => cats.includes(p.category));
  }
  if (collections && collections.length) {
    result = result.filter((p) => collections.includes(p.collection));
  }
  if (materials && materials.length) {
    result = result.filter((p) => materials.includes(p.material));
  }
  if (occasions && occasions.length) {
    result = result.filter((p) => occasions.includes(p.occasion));
  }
  if (gemstones && gemstones.length) {
    result = result.filter((p) => gemstones.includes(p.gemstone));
  }
  if (priceRange) {
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
  }
  if (searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    result = result.filter((p) =>
      [p.name, p.category, p.collection, p.material, p.gemstone, p.shortDescription]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }

  result = sortProducts(result, filters.sort ?? "featured");
  return result;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return products.find((p) => p.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return products.find((p) => p.id === id);
}

export async function getProductsByCollection(collection: string): Promise<Product[]> {
  return products.filter(
    (p) => p.collection.toLowerCase() === collection.toLowerCase()
  );
}

export async function getCollections(): Promise<string[]> {
  return Array.from(new Set(products.map((p) => p.collection)));
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return products
    .filter((p) => p.featured)
    .slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return sortProducts(products.filter((p) => p.isNew), "newest").slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  return sortProducts(products.filter((p) => p.isBestSeller), "popular").slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCollection = products.filter(
    (p) => p.collection === product.collection && p.id !== product.id
  );
  const sameCategory = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  const related = Array.from(
    new Map(
      [...sameCollection, ...sameCategory, ...products]
        .filter((p) => p.id !== product.id)
        .map((p) => [p.id, p])
    ).values()
  );
  return related.slice(0, limit);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query.trim()) return [];
  return getProducts({ searchTerm: query, sort: "popular" });
}

export function getUniqueValues(): {
  categories: string[];
  collections: string[];
  materials: string[];
  gemstones: string[];
  occasions: string[];
} {
  return {
    categories: Array.from(new Set(products.map((p) => p.category))),
    collections: Array.from(new Set(products.map((p) => p.collection))),
    materials: Array.from(new Set(products.map((p) => p.material))),
    gemstones: Array.from(new Set(products.map((p) => p.gemstone))),
    occasions: Array.from(new Set(products.map((p) => p.occasion))),
  };
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
      sorted.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
      break;
    case "popular":
      sorted.sort((a, b) => Number(b.isBestSeller ?? false) - Number(a.isBestSeller ?? false));
      break;
    case "featured":
      sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
      break;
  }
  return sorted;
}