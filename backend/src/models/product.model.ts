import type { Product } from "../types/index.js";

/**
 * Product model â€” maps a DB row to the domain Product type.
 * When Supabase is wired up, this translates snake_case storage
 * columns into the camelCase shape the API exposes.
 */
export function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: row.category as Product["category"],
    collection: String(row.collection_name ?? row.collection ?? ""),
    price: Number(row.price),
    material: String(row.material),
    gemstone: String(row.gemstone),
    description: String(row.description ?? ""),
    shortDescription: String(row.short_description ?? ""),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    badge: row.badge as Product["badge"],
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    dimensions: (row.dimensions as Product["dimensions"]) ?? {},
    variants: Array.isArray(row.variants) ? (row.variants as Product["variants"]) : [],
    occasion: String(row.occasion ?? "Everyday"),
  };
}