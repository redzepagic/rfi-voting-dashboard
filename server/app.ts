import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./vite";

export async function createApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register API routes
  await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  // Serve static files
  serveStatic(app);

  return app;
}
