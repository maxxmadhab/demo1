import type { PaginatedResult, Product, ProductQuery } from "../types/index.js";

/**
 * Placeholder product service.
 *
 * The real implementation will query Supabase (products table) and return
 * `PaginatedResult<Product>`. The controller and routes already match this
 * contract, so swapping the implementation requires no route changes.
 */
export const productService = {
  async list(_query: ProductQuery): Promise<PaginatedResult<Product>> {
    // TODO: wire to Supabase when backend milestone begins.
    return {
      data: [],
      page: _query.page ?? 1,
      perPage: _query.perPage ?? 48,
      total: 0,
    };
  },

  async getBySlug(_slug: string): Promise<Product | null> {
    // TODO: wire to Supabase.
    return null;
  },

  async getByCollection(_collection: string): Promise<Product[]> {
    // TODO: wire to Supabase.
    return [];
  },
};