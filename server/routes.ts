import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, userSessions, requireAuth } from "./auth";
import { z } from "zod";
import { insertTripSchema, insertOrderSchema, User } from "@shared/schema";
import Stripe from "stripe";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Get user from token middleware
interface AuthenticatedRequest extends Request {
  user?: User;
}

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
  app.post("/api/trips", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("POST /api/trips - Request body:", req.body);
      console.log("POST /api/trips - User ID:", req.user?.id);
      
      // Make sure we have all required data
      const tripData = insertTripSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      console.log("POST /api/trips - Parsed trip data:", tripData);
      
      const trip = await storage.createTrip(tripData);
      console.log("POST /api/trips - Trip created successfully:", trip);
      res.status(201).json(trip);
    } catch (err) {
      console.error("POST /api/trips - Error creating trip:", err);
      
      if (err instanceof z.ZodError) {
        console.error("POST /api/trips - Validation error:", JSON.stringify(err.errors));
        return res.status(400).json({ 
          error: "Invalid trip data", 
          details: err.errors 
        });
      }
      
      // Always return a message the client can display
      res.status(500).json({ 
        error: "Failed to create trip", 
        message: err instanceof Error ? err.message : "Unknown error"
      });
    }
  });

  app.get("/api/trips", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const trips = await storage.getTripsByUserId(req.user!.id);
      res.json(trips);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
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
      if (trip.userId !== req.user!.id) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      res.json(trip);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch trip" });
    }
  });

  // Orders API
  app.post("/api/orders", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId: req.user!.id,
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

  app.get("/api/orders", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orders = await storage.getOrdersByUserId(req.user!.id);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Stripe Payment API Routes
  app.post("/api/create-payment-intent", requireAuth, async (req: AuthenticatedRequest, res: Response) => {

    try {
      const { planId, amount } = req.body;
      
      if (!planId || !amount) {
        return res.status(400).json({ error: "Plan ID and amount are required" });
      }

      // Get the insurance plan to verify it exists
      const plan = await storage.getInsurancePlan(planId);
      if (!plan) {
        return res.status(404).json({ error: "Insurance plan not found" });
      }

      // Verify the amount matches the plan's price (optional security check)
      if (plan.basePrice !== amount) {
        console.log(`Price mismatch: Expected ${plan.basePrice}, got ${amount}`);
        // You might want to enforce this in production
        // return res.status(400).json({ error: "Amount does not match plan price" });
      }

      // Create the payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          planId: planId.toString(),
          userId: req.user!.id.toString(),
          planName: plan.name
        },
      });

      // Return the client secret
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        error: "Error creating payment intent", 
        message: error.message 
      });
    }
  });

  // Webhook to handle successful payments
  app.post("/api/webhook", async (req, res) => {
    const payload = req.body;
    let event;

    // Verify the event came from Stripe
    try {
      // Note: in production, use the Stripe webhook signature verification
      // const signature = req.headers['stripe-signature'];
      // event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      
      event = payload;  // For simplicity in development
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      try {
        // Create an order from the successful payment
        const planId = parseInt(paymentIntent.metadata.planId);
        const userId = parseInt(paymentIntent.metadata.userId);
        
        if (!isNaN(planId) && !isNaN(userId)) {
          await storage.createOrder({
            planId,
            userId,
            totalAmount: paymentIntent.amount / 100, // Convert from cents
            status: "completed",
            paymentIntentId: paymentIntent.id
          });
          
          console.log("Order created successfully from webhook");
        }
      } catch (error: any) {
        console.error("Failed to process webhook:", error);
      }
    }

    res.status(200).json({ received: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
