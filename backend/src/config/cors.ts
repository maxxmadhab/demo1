import type { CorsOptions } from "cors";
import { env } from "./env.js";

/**
 * CORS configuration â€” locked to the frontend origin(s).
 * Extend with an array of allowed origins for staging/production.
 */
export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowed = new Set([
      env.clientOrigin,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ]);

    // Allow same-origin / server-to-server requests without an Origin header.
    if (!origin || allowed.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};