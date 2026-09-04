import { api } from "@/lib/api";
import type { PaginatedProducts, Product } from "@/types/product";

export interface AdminProductPayload {
  name: string;
  slug?: string;
  category: string;
  price: number;
  material?: string;
  gemstone?: string;
  description?: string;
  shortDescription?: string;
  dimensions?: Record<string, string>;
  badge?: string | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  featured?: boolean;
  images?: string[];
}

export interface AdminListQuery {
  search?: string;
  category?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

export async function adminListProducts(query: AdminListQuery = {}): Promise<PaginatedProducts> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.page) params.set("page", String(query.page));
  if (query.perPage) params.set("perPage", String(query.perPage));
  const qs = params.toString();
  return api<Product>(`/api/admin/products${qs ? `?${qs}` : ""}`) as unknown as Promise<PaginatedProducts>;
}

export async function adminGetProduct(id: string): Promise<Product> {
  return api<Product>(`/api/admin/products/${encodeURIComponent(id)}`);
}

export async function adminCreateProduct(payload: AdminProductPayload): Promise<Product> {
  return api<Product>("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminUpdateProduct(id: string, payload: AdminProductPayload): Promise<Product> {
  return api<Product>(`/api/admin/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteProduct(id: string): Promise<void> {
  return api<void>(`/api/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function adminUploadImage(
  dataUrl: string,
  filename?: string,
  contentType?: string,
): Promise<{ url: string }> {
  return api<{ url: string }>("/api/admin/upload", {
    method: "POST",
    body: JSON.stringify({ dataUrl, filename, contentType }),
  });
}

export async function adminDeleteImage(url: string): Promise<void> {
  return api<void>("/api/admin/images", {
    method: "DELETE",
    body: JSON.stringify({ url }),
  });
}
