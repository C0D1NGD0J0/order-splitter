import express, { Application } from "express";
// import orderRoutes from "./src/routes/orderRoutes";
// import { responseTimeLogger } from "./src/middleware/responseTime";

export interface IAppSetup {
  initConfig(): void;
}

export class App implements IAppSetup {
  constructor(private readonly expApp: Application) {}

  initConfig(): void {
    this.initMiddleware();
    this.initRoutes();
  }

  private initMiddleware(): void {
    this.expApp.use(express.json());
    // this.expApp.use(responseTimeLogger);
  }

  private initRoutes(): void {
    // this.expApp.use("/api/orders", orderRoutes);
    this.expApp.get("/health", (_req, res) => {
      res.json({ status: "ok" });
    });
  }
}
