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

      // Calculate expected price with tax (matching client calculation)
      const taxesFees = Math.round(plan.basePrice * 0.0825); // 8.25% tax (same as client)
      const expectedTotal = plan.basePrice + taxesFees;
      
      // Strict verification for production environment
      if (Math.abs(expectedTotal - amount) > 0.01) {
        console.error(`Price mismatch: Expected ${expectedTotal}, got ${amount}`);
        return res.status(400).json({ 
          error: "Amount validation failed", 
          message: "The payment amount does not match the plan price." 
        });
      }

      const user = req.user!;
      
      // Create the payment intent with enhanced metadata for tracking
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          planId: planId.toString(),
          userId: user.id.toString(),
          planName: plan.name,
          userEmail: user.email || "Not provided",
          purchaseTimestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || "production"
        },
        receipt_email: user.email, // Send receipt if email is available
        description: `Travel insurance: ${plan.name} by ${plan.provider}`,
        statement_descriptor_suffix: "BRIKI INS",
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

  // Webhook to handle successful payments - enhanced for production
  app.post("/api/webhook", async (req, res) => {
    // In production, you'd use the Stripe CLI to forward webhooks to your local environment
    // Or configure a webhook endpoint in the Stripe dashboard when deployed
    
    // In this implementation, we'll use a simple approach to handle the webhook
    let event = req.body;

    // Enhanced event handling for various payment events
    try {
      // Log all events for monitoring
      console.log(`⚡ Processing Stripe event: ${event.type}`);
      
      switch (event.type) {
        case 'payment_intent.succeeded': {
          const paymentIntent = event.data.object;
          console.log(`✅ Payment succeeded: ${paymentIntent.id}`);
          
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
            
            console.log(`📋 Order created successfully for payment ${paymentIntent.id}`);
          }
          break;
        }
        
        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object;
          const error = paymentIntent.last_payment_error;
          console.log(`❌ Payment failed: ${paymentIntent.id}, reason: ${error ? error.message : 'unknown'}`);
          
          // Here you could notify the user about the failed payment
          // Or create a record of failed payment attempts
          break;
        }
        
        case 'charge.refunded': {
          const charge = event.data.object;
          console.log(`💸 Charge refunded: ${charge.id}`);
          
          // Here you could update the order status to refunded
          // Or create a refund record in your database
          break;
        }
        
        // Handle other event types if needed
        default:
          // Unexpected event type
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error: any) {
      console.error(`❌ Error processing webhook (${event.type}):`, error.message);
    }

    res.status(200).json({ received: true });
  });

  const httpServer = createServer(app);

  return httpServer;
}
