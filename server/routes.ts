import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertTripSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed data if needed - before setting up auth and other routes
  await storage.seedDataIfNeeded();
  
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Insurance plans API
  app.get("/api/insurance-plans", async (req, res) => {
    try {
      const plans = await storage.getAllInsurancePlans();
      res.json(plans);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch insurance plans" });
    }
  });

  app.get("/api/insurance-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      if (isNaN(planId)) {
        return res.status(400).json({ error: "Invalid plan ID" });
      }
      
      const plan = await storage.getInsurancePlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      res.json(plan);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch insurance plan" });
    }
  });

  // Trip API
  app.post("/api/trips", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const tripData = insertTripSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const trip = await storage.createTrip(tripData);
      res.status(201).json(trip);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      res.status(500).json({ error: "Failed to create trip" });
    }
  });

  app.get("/api/trips", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const trips = await storage.getTripsByUserId(req.user.id);
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const tripId = parseInt(req.params.id);
      if (isNaN(tripId)) {
        return res.status(400).json({ error: "Invalid trip ID" });
      }
      
      const trip = await storage.getTrip(tripId);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      
      // Ensure the trip belongs to the authenticated user
      if (trip.userId !== req.user.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch trip" });
    }
  });

  // Orders API
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user.id,
        status: "completed"
      });
      
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const orders = await storage.getOrdersByUserId(req.user.id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
