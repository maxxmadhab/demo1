import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { corsOptions } from "./config/cors.js";
import routes from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware.js";

export const createServer = () => {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.json({ service: "budhram-api", status: "running" });
  });

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

if (process.env.NODE_ENV !== "test") {
  const app = createServer();
  app.listen(env.port, () => {
    console.log(`[budhram-api] listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });
}
