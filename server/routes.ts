import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth, requireAuth } from "./auth";
import { storage } from "./storage";
import Stripe from "stripe";
import { users, trips, insurancePlans, orders } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY) 
  : null;

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Trip validation schema
const tripSchema = z.object({
  destination: z.string(),
  countryOfOrigin: z.string(),
  departureDate: z.string(),
  returnDate: z.string(),
  travelers: z.number().int().positive(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Trip Endpoints
  app.post("/api/trips", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // Validate the request body
      const validationResult = tripSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        console.log("POST /api/trips - Invalid data:", validationResult.error.errors);
        return res.status(400).json({ 
          message: "Invalid trip data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Get validated data
      const tripData = validationResult.data;
      
      // Create the trip record
      const trip = await storage.createTrip({
        ...tripData,
        userId: req.user.id,
      });
      
      console.log("POST /api/trips - Created trip for user:", req.user.id);
      res.status(201).json(trip);
    } catch (error: any) {
      console.error("POST /api/trips - Error creating trip:", error);
      res.status(500).json({ message: "Failed to create trip", error: error.message });
    }
  });

  app.get("/api/trips", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      // Get trips for the authenticated user
      const trips = await storage.getTripsByUserId(req.user.id);
      res.json(trips);
    } catch (error: any) {
      console.error("GET /api/trips - Error fetching trips:", error);
      res.status(500).json({ message: "Failed to fetch trips", error: error.message });
    }
  });

  // Insurance Plan Endpoints
  app.get("/api/plans", async (_req, res) => {
    try {
      const plans = await storage.getAllInsurancePlans();
      res.json(plans);
    } catch (error: any) {
      console.error("GET /api/plans - Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });

  // Set up the Stripe payment intent route
  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}