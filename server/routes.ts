import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { isAuthenticated } from "./auth/local-auth";
import { storage } from "./storage";
import { pool } from "./db";
import Stripe from "stripe";
import path from "path";
import fs from "fs";
import os from "os";
import formidable from "formidable";
import { 
  users, 
  companyProfiles,
  companyPlans,
  planAnalytics,
  InsertCompanyPlan,
  INSURANCE_CATEGORIES,
  InsuranceCategory
} from "@shared/schema";
import { z } from "zod";
import { 
  getChatCompletionFromOpenAI, 
  generateInsuranceRecommendation, 
  explainInsuranceTerm, 
  comparePlans 
} from "./services/openai";
import { parseCSVFile, parseXLSXFile } from "./services/plan-upload";

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

// Import routes
import googleAuthRoutes from './routes/google-auth';
import quotesRoutes from './routes/quotes';
import aiRouter from './routes/ai';

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit authentication
  await setupAuth(app);
  
  // Mount API routes
  app.use('/api/auth', googleAuthRoutes);
  app.use('/api/quotes', quotesRoutes);
  app.use('/api/ai', aiRouter);

  // Initialize database - using a more resilient approach
  try {
    // Use a simple query to test database connection with timeout
    const dbCheckPromise = pool.query('SELECT 1');
    
    // Set a timeout to avoid hanging if the connection is problematic
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 3000);
    });
    
    // Race the database query against the timeout
    await Promise.race([dbCheckPromise, timeoutPromise]);
    console.log("Database connection verified successfully");
  } catch (error) {
    console.error("Database connection check failed:", error);
    // Continue app startup even if database check fails - the app will attempt
    // to reconnect on actual database operations
  }

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
  // Database reset endpoint - ONLY FOR PRE-LAUNCH
  app.get("/api/admin/reset-users", async (req, res) => {
    const { confirm } = req.query;
    
    if (confirm !== 'yes-reset-all-users') {
      return res.status(400).json({ 
        error: "Missing confirmation parameter. Add '?confirm=yes-reset-all-users' to confirm this action." 
      });
    }
    
    try {
      await storage.resetUsers();
      res.json({ success: true, message: "All user data has been reset successfully" });
    } catch (error) {
      console.error('Error resetting user database:', error);
      res.status(500).json({ 
        error: "Failed to reset user database", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Trip Endpoints
  app.post("/api/trips", isAuthenticated, async (req: AuthenticatedRequest, res) => {
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
      
      // Get user ID from Replit Auth session
      const userId = req.user.claims.sub;
      
      // Create the trip record
      const trip = await storage.createTrip({
        ...tripData,
        userId,
      });
      
      console.log("POST /api/trips - Created trip for user:", userId);
      res.status(201).json(trip);
    } catch (error: any) {
      console.error("POST /api/trips - Error creating trip:", error);
      res.status(500).json({ message: "Failed to create trip", error: error.message });
    }
  });

  app.get("/api/trips", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      // Get user ID from Replit Auth session
      const userId = req.user.claims.sub;
      
      // Get trips for the authenticated user
      const trips = await storage.getTripsByUserId(userId);
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
  
  // Category-specific plan endpoints
  app.get("/api/plans/:category", async (req, res) => {
    try {
      const { category } = req.params;
      if (!category || !['travel', 'auto', 'pet', 'health'].includes(category)) {
        return res.status(400).json({ 
          message: "Invalid insurance category. Must be one of: travel, auto, pet, health" 
        });
      }
      
      const plans = await storage.getInsurancePlansByCategory(category);
      res.json(plans);
    } catch (error: any) {
      console.error(`GET /api/plans/${req.params.category} - Error:`, error);
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  // Insurance API endpoints for frontend
  app.get("/api/insurance/plans", async (_req, res) => {
    try {
      const plans = await storage.getAllInsurancePlans();
      res.json(plans);
    } catch (error: any) {
      console.error("GET /api/insurance/plans - Error:", error);
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  app.get("/api/insurance/plans/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const plans = await storage.getInsurancePlansByCategory(category);
      res.json(plans);
    } catch (error: any) {
      console.error(`GET /api/insurance/plans/${req.params.category} - Error:`, error);
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  // Specialized search endpoint
  app.post("/api/insurance/:category/search", async (req, res) => {
    try {
      const { category } = req.params;
      const { criteria } = req.body;
      
      // For now, just return all plans for that category
      // In a real implementation, we'd filter based on criteria
      const plans = await storage.getInsurancePlansByCategory(category);
      res.json(plans);
    } catch (error: any) {
      console.error(`POST /api/insurance/${req.params.category}/search - Error:`, error);
      res.status(500).json({ message: "Failed to search insurance plans", error: error.message });
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
  
  // Company routes
  // Get company profile
  app.get("/api/company/profile", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      res.json(profile);
    } catch (error: any) {
      console.error("Error retrieving company profile:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Plan management endpoints
  
  // Get all company plans
  app.get("/api/company/plans", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get company profile to get company ID
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      const plans = await storage.getCompanyPlans(profile.id);
      
      res.json(plans);
    } catch (error: any) {
      console.error("Error retrieving company plans:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Get company plans by category
  app.get("/api/company/plans/:category", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const { category } = req.params;
      
      // Validate category
      const validCategories = Object.values(INSURANCE_CATEGORIES);
      if (!validCategories.includes(category as InsuranceCategory)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      // Get company profile to get company ID
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      const plans = await storage.getCompanyPlansByCategory(profile.id, category as InsuranceCategory);
      
      res.json(plans);
    } catch (error: any) {
      console.error("Error retrieving company plans by category:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Create new plan
  app.post("/api/company/plans", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get company profile to get company ID
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Validate plan data
      const planData = req.body;
      
      // Add company ID to plan data
      planData.companyId = profile.id;
      
      // Create the plan
      const plan = await storage.createCompanyPlan(planData);
      
      res.status(201).json(plan);
    } catch (error: any) {
      console.error("Error creating company plan:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Plan upload (CSV/Excel)
  app.post("/api/company/plans/upload", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get company profile to get company ID
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Process uploaded file data
      const { 
        plans, 
        category,
        isPublic = false 
      } = req.body;
      
      if (!plans || !Array.isArray(plans) || !category) {
        return res.status(400).json({ message: "Invalid request data" });
      }
      
      // Validate category
      const validCategories = Object.values(INSURANCE_CATEGORIES);
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      // Process and validate each plan
      const createdPlans = [];
      const errors = [];
      
      for (const [index, planData] of plans.entries()) {
        try {
          // Add company ID and category to plan data
          const planToCreate = {
            ...planData,
            companyId: profile.id,
            category,
            visibility: isPublic ? 'public' : 'private'
          };
          
          // Create the plan
          const plan = await storage.createCompanyPlan(planToCreate);
          createdPlans.push(plan);
        } catch (error: any) {
          errors.push({
            row: index + 1,
            message: error.message || "Unknown error",
            data: planData
          });
        }
      }
      
      // Return created plans and any errors
      res.status(201).json({
        success: true,
        plans: createdPlans,
        errors,
        totalCreated: createdPlans.length,
        totalErrors: errors.length
      });
    } catch (error: any) {
      console.error("Error uploading company plans:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Get dashboard analytics
  app.get("/api/company/analytics", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Get company profile to get company ID
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Get analytics
      const analytics = await storage.getDashboardAnalytics(profile.id);
      
      res.json(analytics);
    } catch (error: any) {
      console.error("Error retrieving company analytics:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // AI Assistant endpoints
  
  // Chat message endpoint
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request format. 'messages' array is required." });
      }
      
      const response = await getChatCompletionFromOpenAI(messages);
      res.json({ response });
    } catch (error: any) {
      console.error("Error in chatbot API:", error);
      res.status(500).json({ error: "Failed to process chat request", message: error.message });
    }
  });

  // Insurance term explanation endpoint
  app.post("/api/ai/explain-term", async (req, res) => {
    try {
      const { term } = req.body;
      
      if (!term || typeof term !== 'string') {
        return res.status(400).json({ error: "Invalid request. 'term' is required." });
      }
      
      const explanation = await explainInsuranceTerm(term);
      res.json({ explanation });
    } catch (error: any) {
      console.error("Error explaining term:", error);
      res.status(500).json({ error: "Failed to explain insurance term", message: error.message });
    }
  });

  // Insurance recommendation endpoint
  app.post("/api/ai/recommend", async (req, res) => {
    try {
      const { category, criteria } = req.body;
      
      if (!category || !criteria) {
        return res.status(400).json({ error: "Invalid request. 'category' and 'criteria' are required." });
      }
      
      const recommendation = await generateInsuranceRecommendation(category, criteria);
      res.json({ recommendation });
    } catch (error: any) {
      console.error("Error generating recommendation:", error);
      res.status(500).json({ error: "Failed to generate recommendation", message: error.message });
    }
  });

  // Plan comparison endpoint
  app.post("/api/ai/compare-plans", async (req, res) => {
    try {
      const { plans } = req.body;
      
      if (!plans || !Array.isArray(plans) || plans.length < 2) {
        return res.status(400).json({ error: "Invalid request. At least 2 plans are required for comparison." });
      }
      
      const comparison = await comparePlans(plans);
      res.json({ comparison });
    } catch (error: any) {
      console.error("Error comparing plans:", error);
      res.status(500).json({ error: "Failed to compare plans", message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}