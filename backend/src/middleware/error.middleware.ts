import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { isProduction } from "../config/env.js";

/** 404 handler â€” mounted after all routes. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/** Central error handler â€” Express 5 forwards async errors here automatically. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: { code: "BAD_REQUEST", message: "Malformed JSON body" },
    });
    return;
  }

  console.error("[error]", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: isProduction ? "An unexpected error occurred." : String(err),
    },
  });
}