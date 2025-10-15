import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Glasačka mjesta routes
  app.get("/api/glasacka-mjesta", async (_req, res) => {
    try {
      const mjesta = await storage.getAllGlasackaMjesta();
      res.json(mjesta);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch glasacka mjesta" });
    }
  });

  app.get("/api/glasacka-mjesta/:id", async (req, res) => {
    try {
      const mjesto = await storage.getGlasackoMjesto(req.params.id);
      if (!mjesto) {
        return res.status(404).json({ error: "Glasacko mjesto not found" });
      }
      res.json(mjesto);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch glasacko mjesto" });
    }
  });

  app.patch("/api/glasacka-mjesta/:id", async (req, res) => {
    try {
      const updated = await storage.updateGlasackoMjesto(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Glasacko mjesto not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update glasacko mjesto" });
    }
  });

  // Anomalije routes
  app.get("/api/anomalije", async (_req, res) => {
    try {
      const anomalije = await storage.getAllAnomalije();
      res.json(anomalije);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anomalije" });
    }
  });

  app.get("/api/anomalije/:id", async (req, res) => {
    try {
      const anomalija = await storage.getAnomalija(req.params.id);
      if (!anomalija) {
        return res.status(404).json({ error: "Anomalija not found" });
      }
      res.json(anomalija);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch anomalija" });
    }
  });

  app.post("/api/anomalije", async (req, res) => {
    try {
      const anomalija = await storage.createAnomalija(req.body);
      res.status(201).json(anomalija);
    } catch (error) {
      res.status(500).json({ error: "Failed to create anomalija" });
    }
  });

  app.patch("/api/anomalije/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateAnomalijaStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: "Anomalija not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update anomalija status" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
