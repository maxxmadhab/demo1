import type { Request, Response } from "express";
import { productService } from "../services/product.service.js";
import { ApiError } from "../utils/ApiError.js";

export const productController = {
  /** GET /api/products - list with filters, sorting and pagination. */
  async list(req: Request, res: Response) {
    const result = await productService.list({
      category: firstString(req.query.category),
      search: firstString(req.query.search),
      minPrice: req.query.minPrice !== undefined ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice !== undefined ? Number(req.query.maxPrice) : undefined,
      sort: firstString(req.query.sort) as never,
      page: req.query.page !== undefined ? Number(req.query.page) : undefined,
      perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : undefined,
    });
    res.status(200).json(result);
  },

  /** GET /api/products/:slug - single product. */
  async getBySlug(req: Request, res: Response) {
    const slug = firstString(req.params.slug);
    const product = slug ? await productService.getBySlug(slug) : null;
    if (!product) {
      throw ApiError.notFound("Product not found");
    }
    res.status(200).json(product);
  },
};

/** Express query/params values can be strings, arrays or nested objects. */
function firstString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : undefined;
  }
  return undefined;
}
