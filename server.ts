import http from "http";
import config from "./src/config";
import { App, IAppSetup } from "./app";
import express, { Application } from "express";

class Server {
  private app: IAppSetup;
  private initialized = false;
  private shuttingDown = false;
  private static instance: Server;
  private readonly PORT = config.port;
  public readonly expApp: Application;
  private httpServer: http.Server | null = null;

  private constructor() {
    this.expApp = express();
    this.app = new App(this.expApp);
    this.app.initConfig();

    if (require.main === module) {
      this.setupProcessErrorHandlers();
    }
  }

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  start(): void {
    if (this.initialized) return;

    this.httpServer = http.createServer(this.expApp);
    this.httpServer.on("error", (error: Error) => {
      console.error("HTTP Server Error:", error);
    });
    this.httpServer.listen(this.PORT, () => {
      console.info(`Order Splitter API running on port ${this.PORT}`);
    });
    this.initialized = true;
  }

  async shutdown(exitCode = 0): Promise<void> {
    if (this.shuttingDown) return;

    this.shuttingDown = true;
    console.info("Server shutting down...");

    const shutdownTimeout = setTimeout(() => {
      console.warn("Shutdown timeout reached, forcing exit...");
      process.exit(exitCode);
    }, 5000);

    try {
      if (this.httpServer) {
        await new Promise<void>((resolve) => {
          this.httpServer!.close(() => resolve());
        });
      }

      clearTimeout(shutdownTimeout);
      console.info("Graceful shutdown completed");
      process.exit(exitCode);
    } catch (error) {
      clearTimeout(shutdownTimeout);
      console.error("Error during shutdown:", error);
      process.exit(1);
    }
  }

  private setupProcessErrorHandlers(): void {
    process.on("unhandledRejection", (reason: unknown) => {
      console.error("Unhandled Rejection:", reason);
      this.shutdown(1);
    });

    process.on("uncaughtException", (err: Error) => {
      console.error(`Uncaught Exception: ${err.message}`);
      this.shutdown(1);
    });

    process.on("SIGTERM", () => this.shutdown(0));
    process.on("SIGINT", () => this.shutdown(0));
  }
}

export const getServerInstance = () => Server.getInstance().expApp;
if (require.main === module) {
  Server.getInstance().start();
}
export { Server };
