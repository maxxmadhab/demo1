import type { Request, Response } from "express";

export async function healthHandler(_req: Request, res: Response) {
  res.status(200).json({
    status: "ok",
    service: "budhram-api",
    timestamp: new Date().toISOString(),
  });
}
