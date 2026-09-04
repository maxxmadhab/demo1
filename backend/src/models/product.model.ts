import type { Product, ProductImageRow, ProductRow } from "../types/index.js";

/** Maps a products row (+ its images) into the API Product shape. */
export function mapProductRow(
  row: ProductRow,
  images: string[] = [],
): Product {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    category: row.category,
    price: Number(row.price),
    material: String(row.material ?? ""),
    gemstone: String(row.gemstone ?? ""),
    description: String(row.description ?? ""),
    shortDescription: String(row.short_description ?? ""),
    images,
    badge: (row.badge as Product["badge"]) ?? undefined,
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    dimensions: (row.dimensions as Product["dimensions"]) ?? {},
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

/** Sorts image rows by sort_order into a plain string array. */
export function imageRowsToUrls(rows: ProductImageRow[]): string[] {
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => row.image_url);
}
