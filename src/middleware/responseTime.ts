import { Request, Response, NextFunction } from "express";

export function responseTimeLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    console.log(
      `[${req.method}] ${req.originalUrl} — ${durationMs.toFixed(2)}ms (${res.statusCode})`,
    );
  });

  next();
}
