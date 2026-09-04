import type { Response } from "express";
import type { AuthedRequest } from "../middleware/auth.middleware.js";
import { productService } from "../services/product.service.js";
import { ApiError } from "../utils/ApiError.js";
import type { ProductInput } from "../types/index.js";

const CATEGORIES = new Set(["New Arrivals", "Rings", "Necklaces", "Earrings", "Bracelets"]);
const BADGES = new Set(["New", "Best Seller", "Limited", "Iconic", "Bridal"]);

function parseProductBody(body: Record<string, unknown>): ProductInput {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const category = body.category as string;
  const rawPrice = Number(body.price);

  if (!name) throw ApiError.badRequest("Product name is required.");
  if (!category || !CATEGORIES.has(category)) {
    throw ApiError.badRequest("Invalid product category.");
  }
  if (Number.isNaN(rawPrice) || rawPrice < 0) {
    throw ApiError.badRequest("Invalid product price.");
  }

  const badge = body.badge === null || body.badge === undefined || body.badge === "" ? null : String(body.badge);
  if (badge !== null && !BADGES.has(badge)) {
    throw ApiError.badRequest("Invalid badge value.");
  }

  return {
    name,
    slug: typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : undefined,
    category: category as ProductInput["category"],
    price: rawPrice,
    material: typeof body.material === "string" ? body.material : "",
    gemstone: typeof body.gemstone === "string" ? body.gemstone : "",
    description: typeof body.description === "string" ? body.description : "",
    shortDescription: typeof body.shortDescription === "string" ? body.shortDescription : "",
    dimensions: body.dimensions && typeof body.dimensions === "object" ? (body.dimensions as ProductInput["dimensions"]) : {},
    badge: badge as ProductInput["badge"],
    isNew: Boolean(body.isNew),
    isBestSeller: Boolean(body.isBestSeller),
    featured: Boolean(body.featured),
  };
}

function parseImageArray(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) return [];
  return value.filter((url): url is string => typeof url === "string" && url.length > 0);
}

export const adminProductController = {
  /** GET /api/admin/products - admin list. */
  async list(req: AuthedRequest, res: Response) {
    const result = await productService.listAdmin({
      category: firstString(req.query.category),
      search: firstString(req.query.search),
      sort: firstString(req.query.sort) as never,
      page: req.query.page !== undefined ? Number(req.query.page) : undefined,
      perPage: req.query.perPage !== undefined ? Number(req.query.perPage) : undefined,
    });
    res.status(200).json(result);
  },

  /** POST /api/admin/products - create. */
  async create(req: AuthedRequest, res: Response) {
    const input = parseProductBody((req.body ?? {}) as Record<string, unknown>);
    const images = parseImageArray((req.body ?? {}).images);
    const product = await productService.create(input, images);
    res.status(201).json(product);
  },

  /** GET /api/admin/products/:id - single for editing. */
  async getById(req: AuthedRequest, res: Response) {
    const id = String(req.params.id ?? "");
    const product = await productService.getById(id);
    if (!product) throw ApiError.notFound("Product not found.");
    res.status(200).json(product);
  },

  /** PUT /api/admin/products/:id - update. */
  async update(req: AuthedRequest, res: Response) {
    const id = String(req.params.id ?? "");
    const input = parseProductBody((req.body ?? {}) as Record<string, unknown>);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const hasImages = body.images !== undefined;
    const images = hasImages ? parseImageArray(body.images) : undefined;
    const product = await productService.update(id, input, images);
    res.status(200).json(product);
  },

  /** DELETE /api/admin/products/:id - delete. */
  async remove(req: AuthedRequest, res: Response) {
    const id = String(req.params.id ?? "");
    await productService.remove(id);
    res.status(204).send();
  },

  /** POST /api/admin/upload - upload an image and return a public URL. */
  async upload(req: AuthedRequest, res: Response) {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const dataUrl = typeof body.dataUrl === "string" ? body.dataUrl : "";
    const mime = typeof body.contentType === "string" ? body.contentType : "image/jpeg";
    const name = typeof body.filename === "string" ? body.filename : "image";

    const match = /^data:([^;,]+);base64,(.+)$/s.exec(dataUrl);
    const byteString = match ? match[2] : dataUrl;
    const contentType = match ? match[1] : mime;

    if (!byteString) throw ApiError.badRequest("No image data provided.");
    if (byteString.length > 10_000_000) {
      throw ApiError.badRequest("Image is too large (max ~10MB).");
    }

    const url = await productService.uploadImage(byteString, contentType, name);
    res.status(201).json({ url });
  },

  /** DELETE /api/admin/images - delete an uploaded image by URL. */
  async deleteImage(req: AuthedRequest, res: Response) {
    const url = String((req.body ?? {}).url ?? "");
    if (!url) throw ApiError.badRequest("Missing image URL.");
    await productService.deleteImageByUrl(url);
    res.status(204).send();
  },
};

function firstString(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : undefined;
  }
  return undefined;
}
