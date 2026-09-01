import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";

const SORT_VALUES = new Set(["featured", "newest", "popular", "price-asc", "price-desc"]);

export function validateProductQuery(req: Request, _res: Response, next: NextFunction) {
  const { sort, page, perPage, minPrice, maxPrice } = req.query;

  if (sort !== undefined && !SORT_VALUES.has(String(sort))) {
    next(ApiError.badRequest(`Invalid sort value: ${String(sort)}`));
    return;
  }
  for (const [name, value] of [
    ["page", page],
    ["perPage", perPage],
    ["minPrice", minPrice],
    ["maxPrice", maxPrice],
  ] as const) {
    if (value !== undefined && (isNaN(Number(value)) || Number(value) < 0)) {
      next(ApiError.badRequest(`Invalid ${name} value`));
      return;
    }
  }
  next();
}