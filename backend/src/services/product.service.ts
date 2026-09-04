import { getSupabase } from "./supabase.js";
import type {
  PaginatedResult,
  Product,
  ProductImageRow,
  ProductInput,
  ProductQuery,
  ProductRow,
} from "../types/index.js";
import { imageRowsToUrls, mapProductRow } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.js";
import { slugify } from "./slug.util.js";

const PUBLIC_BUCKET = "product-images";

function client() {
  const supabase = getSupabase();
  if (!supabase) {
    throw ApiError.internal("Database is not configured.");
  }
  return supabase;
}

function publicUrl(path: string): string {
  return `${env.supabase.url.replace(/\/$/, "")}/storage/v1/object/public/${PUBLIC_BUCKET}/${path}`;
}

async function loadImages(productIds: string[]): Promise<Map<string, string[]>> {
  if (!productIds.length) return new Map();
  const { data, error } = await client()
    .from("product_images")
    .select("id, product_id, image_url, sort_order")
    .in("product_id", productIds);
  if (error) throw ApiError.internal("Failed to load product images.", error.message);
  const byProduct = new Map<string, ProductImageRow[]>();
  for (const row of (data ?? []) as unknown as ProductImageRow[]) {
    const list = byProduct.get(row.product_id) ?? [];
    list.push(row);
    byProduct.set(row.product_id, list);
  }
  const result = new Map<string, string[]>();
  for (const [id, rows] of byProduct) result.set(id, imageRowsToUrls(rows));
  return result;
}

const IMAGE_SELECT = "id, product_id, image_url, sort_order";

export const productService = {
  /** Public catalog listing with filters, search, sorting and pagination. */
  async list(query: ProductQuery): Promise<PaginatedResult<Product>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const perPage = query.perPage && query.perPage > 0 ? query.perPage : 48;
    const offset = (page - 1) * perPage;

    let builder = client()
      .from("products")
      .select("*, product_images(product_id, image_url, sort_order)", { count: "exact" });

    if (query.category) builder = builder.eq("category", query.category);
    if (query.search) {
      const term = query.search.trim();
      builder = builder.or(
        `name.ilike.%${term}%,description.ilike.%${term}%,short_description.ilike.%${term}%`,
      );
    }
    if (query.minPrice !== undefined) builder = builder.gte("price", query.minPrice);
    if (query.maxPrice !== undefined) builder = builder.lte("price", query.maxPrice);

    const order = ordering(query.sort);
    if (order) builder = builder.order(order.column, { ascending: order.ascending });

    builder = builder.range(offset, offset + perPage - 1);

    const { data, error, count } = await builder;
    if (error) throw ApiError.internal("Failed to list products.", error.message);

    const rows = (data ?? []) as unknown as (ProductRow & {
      product_images?: ProductImageRow[];
    })[];
    const products = rows.map((row) =>
      mapProductRow(row, (row.product_images ?? []).map((i) => i.image_url)),
    );

    return { data: products, page, perPage, total: count ?? products.length };
  },

  /** Single product by slug (public). */
  async getBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await client()
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw ApiError.internal("Failed to load product.", error.message);
    if (!data) return null;
    const images = await loadImages([data.id]);
    return mapProductRow(data as ProductRow, images.get(data.id) ?? []);
  },

  /** Full product list for the admin panel (no visibility restrictions). */
  async listAdmin(query: ProductQuery): Promise<PaginatedResult<Product>> {
    const page = query.page && query.page > 0 ? query.page : 1;
    const perPage = query.perPage && query.perPage > 0 ? query.perPage : 48;
    const offset = (page - 1) * perPage;

    let builder = client()
      .from("products")
      .select("*, product_images(product_id, image_url, sort_order)", { count: "exact" });

    if (query.category) builder = builder.eq("category", query.category);
    if (query.search) {
      const term = query.search.trim();
      builder = builder.or(
        `name.ilike.%${term}%,description.ilike.%${term}%,short_description.ilike.%${term}%`,
      );
    }

    const order = ordering(query.sort);
    if (order) builder = builder.order(order.column, { ascending: order.ascending });
    builder = builder.order("created_at", { ascending: false });
    builder = builder.range(offset, offset + perPage - 1);

    const { data, error, count } = await builder;
    if (error) throw ApiError.internal("Failed to list products.", error.message);

    const rows = (data ?? []) as unknown as (ProductRow & {
      product_images?: ProductImageRow[];
    })[];
    const products = rows.map((row) =>
      mapProductRow(row, (row.product_images ?? []).map((i) => i.image_url)),
    );

    return { data: products, page, perPage, total: count ?? products.length };
  },

  /** Single product by id (admin editing). */
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await client()
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw ApiError.internal("Failed to load product.", error.message);
    if (!data) return null;
    const images = await loadImages([data.id]);
    return mapProductRow(data as ProductRow, images.get(data.id) ?? []);
  },

  /** Create a product (and its ordered images). */
  async create(input: ProductInput, images: string[] = []): Promise<Product> {
    const slug = input.slug?.trim() || slugify(input.name);
    const { data, error } = await client()
      .from("products")
      .insert({
        name: input.name,
        slug,
        category: input.category,
        price: input.price,
        material: input.material ?? "",
        gemstone: input.gemstone ?? "",
        description: input.description ?? "",
        short_description: input.shortDescription ?? "",
        dimensions: input.dimensions ?? {},
        badge: input.badge ?? null,
        is_new: input.isNew ?? false,
        is_best_seller: input.isBestSeller ?? false,
        featured: input.featured ?? false,
      })
      .select()
      .single();
    if (error) {
      if (error.code === "23505") throw ApiError.conflict("A product with this slug already exists.");
      throw ApiError.internal("Failed to create product.", error.message);
    }
    const row = data as ProductRow;
    if (images.length) {
      await this.setImages(row.id, images);
    }
    return mapProductRow(row, images);
  },

  /** Update a product and replace its ordered image list. */
  async update(id: string, input: ProductInput, images?: string[]): Promise<Product> {
    const { data: existing, error: existingError } = await client()
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (existingError) throw ApiError.internal("Failed to update product.", existingError.message);
    if (!existing) throw ApiError.notFound("Product not found.");

    const updates: Record<string, unknown> = {
      name: input.name,
      category: input.category,
      price: input.price,
      material: input.material ?? "",
      gemstone: input.gemstone ?? "",
      description: input.description ?? "",
      short_description: input.shortDescription ?? "",
      dimensions: input.dimensions ?? {},
      badge: input.badge ?? null,
      is_new: input.isNew ?? false,
      is_best_seller: input.isBestSeller ?? false,
      featured: input.featured ?? false,
    };
    if (input.slug?.trim()) updates.slug = input.slug.trim();

    const { data, error } = await client()
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      if (error.code === "23505") throw ApiError.conflict("A product with this slug already exists.");
      throw ApiError.internal("Failed to update product.", error.message);
    }
    const row = data as ProductRow;
    if (images) await this.setImages(id, images);
    return mapProductRow(row, images ?? (await loadImages([id])).get(id) ?? []);
  },

  /** Delete a product (cascades product_images rows). */
  async remove(id: string): Promise<void> {
    const { error } = await client().from("products").delete().eq("id", id);
    if (error) throw ApiError.internal("Failed to delete product.", error.message);
  },

  /** Replace the full ordered image list for a product. */
  async setImages(productId: string, imageUrls: string[]): Promise<void> {
    const { error: delErr } = await client().from("product_images").delete().eq("product_id", productId);
    if (delErr) throw ApiError.internal("Failed to update product images.", delErr.message);

    if (!imageUrls.length) return;
    const rows = imageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      sort_order: index,
    }));
    const { error: insErr } = await client().from("product_images").insert(rows);
    if (insErr) throw ApiError.internal("Failed to save product images.", insErr.message);
  },

  /** Upload an image (base64) to Supabase Storage and return its public URL. */
  async uploadImage(byteString: string, contentType: string, originalName?: string): Promise<string> {
    const buf = Buffer.from(byteString, "base64");
    const ext =
      ({
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp",
        "image/gif": "gif",
        "image/avif": "avif",
      } as Record<string, string>)[contentType] ?? "jpg";

    const clean = (originalName ?? "image")
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
    const path = `${Date.now()}-${clean || "image"}.${ext}`;

    const { error } = await client().storage.from(PUBLIC_BUCKET).upload(path, buf, {
      contentType,
      upsert: false,
    });
    if (error) throw ApiError.internal("Failed to upload image.", error.message);
    return publicUrl(path);
  },

  /** Delete an object from storage by public URL. */
  async deleteImageByUrl(imageUrl: string): Promise<void> {
    const marker = `/${PUBLIC_BUCKET}/`;
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return;
    const path = imageUrl.slice(idx + marker.length);
    await client().storage.from(PUBLIC_BUCKET).remove([path]);
  },
};

/** Translates the API sort key into a Supabase order clause. */
function ordering(sort?: ProductQuery["sort"]): { column: string; ascending: boolean } | null {
  switch (sort) {
    case "price-asc":
      return { column: "price", ascending: true };
    case "price-desc":
      return { column: "price", ascending: false };
    case "newest":
      return { column: "created_at", ascending: false };
    case "popular":
      return { column: "is_best_seller", ascending: false };
    case "featured":
    default:
      return { column: "featured", ascending: false };
  }
}
