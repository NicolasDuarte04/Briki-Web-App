import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { isAuthenticated } from "./auth/local-auth";
import { storage, mockStorage } from "./storage";
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
import insurancePlansRouter from './routes/insurance-plans';

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Replit authentication
  await setupAuth(app);
  
  // Mount API routes
  app.use('/api/auth', googleAuthRoutes);
  app.use('/api/quotes', quotesRoutes);
  app.use('/api/ai', aiRouter);
  app.use('/api/insurance-plans', insurancePlansRouter);

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
  app.get("/api/company/plans/category/:category", isAuthenticated, async (req: AuthenticatedRequest, res) => {
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
  
  // Get a specific plan by ID
  app.get("/api/company/plans/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const planId = parseInt(req.params.id, 10);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid plan ID format" });
      }
      
      // Get company profile to get company ID (for authorization)
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Get the requested plan
      const plan = await storage.getCompanyPlan(planId);
      
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      // Ensure the requesting user belongs to the company that owns this plan
      if (plan.companyId !== profile.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(plan);
    } catch (error: any) {
      console.error("Error retrieving company plan:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });

  // Update a specific plan by ID
  app.put("/api/company/plans/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const planId = parseInt(req.params.id, 10);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid plan ID format" });
      }
      
      // Get company profile to get company ID (for authorization)
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Get the existing plan to verify ownership
      const existingPlan = await storage.getCompanyPlan(planId);
      
      if (!existingPlan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      // Ensure the requesting user belongs to the company that owns this plan
      if (existingPlan.companyId !== profile.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Validate the update data with a schema
      const updateSchema = z.object({
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        basePrice: z.number().min(0).optional(),
        coverageAmount: z.number().min(0).optional(),
        status: z.enum(['draft', 'active', 'archived']).optional(),
        features: z.array(z.string()).optional(),
        provider: z.string().optional(),
        category: z.enum(Object.values(INSURANCE_CATEGORIES) as [string, ...string[]]).optional(),
        categoryFields: z.record(z.any()).optional()
      });
      
      const validationResult = updateSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid plan data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Prevent changing the company ID
      const updateData = validationResult.data;
      delete updateData.companyId;
      
      // Update the plan
      const updatedPlan = await storage.updateCompanyPlan(planId, updateData);
      
      res.json(updatedPlan);
    } catch (error: any) {
      console.error("Error updating company plan:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Delete a plan (mark as archived)
  app.delete("/api/company/plans/:id", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const planId = parseInt(req.params.id, 10);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid plan ID format" });
      }
      
      // Get company profile to get company ID (for authorization)
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Get the existing plan to verify ownership
      const existingPlan = await storage.getCompanyPlan(planId);
      
      if (!existingPlan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      // Ensure the requesting user belongs to the company that owns this plan
      if (existingPlan.companyId !== profile.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Delete/archive the plan
      const success = await storage.deleteCompanyPlan(planId);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to delete plan" });
      }
      
      res.json({ success: true, message: "Plan successfully archived" });
    } catch (error: any) {
      console.error("Error deleting company plan:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // Update plan marketplace visibility
  app.patch("/api/company/plans/:id/visibility", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const planId = parseInt(req.params.id, 10);
      
      if (isNaN(planId)) {
        return res.status(400).json({ message: "Invalid plan ID format" });
      }
      
      // Validate the request body
      const visibilitySchema = z.object({
        marketplaceEnabled: z.boolean()
      });
      
      const validationResult = visibilitySchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid visibility data", 
          errors: validationResult.error.errors 
        });
      }
      
      // Get company profile to get company ID (for authorization)
      const profile = await storage.getCompanyProfile(req.user.id);
      
      if (!profile) {
        return res.status(404).json({ message: "Company profile not found" });
      }
      
      // Get the existing plan to verify ownership
      const existingPlan = await storage.getCompanyPlan(planId);
      
      if (!existingPlan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      
      // Ensure the requesting user belongs to the company that owns this plan
      if (existingPlan.companyId !== profile.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Update plan visibility
      const { marketplaceEnabled } = validationResult.data;
      const updatedPlan = await storage.updatePlanVisibility(planId, marketplaceEnabled);
      
      res.json({
        success: true,
        message: `Plan ${marketplaceEnabled ? 'added to' : 'removed from'} marketplace`,
        plan: updatedPlan
      });
    } catch (error: any) {
      console.error("Error updating plan visibility:", error);
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

      // Create upload directory if it doesn't exist
      const uploadDir = path.join(os.tmpdir(), 'briki-uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Configure formidable
      const form = formidable({
        multiples: false,
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB limit
        filter: (part: any) => {
          // Accept only CSV and Excel files
          if (part.mimetype?.includes('csv') || 
              part.mimetype?.includes('spreadsheet') ||
              part.mimetype?.includes('excel') || 
              part.originalFilename?.endsWith('.csv') || 
              part.originalFilename?.endsWith('.xlsx')) {
            return true;
          }
          return false;
        }
      });

      // Parse the form data
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
          console.error('Error parsing form data:', err);
          return res.status(400).json({ message: 'Error uploading file: ' + err.message });
        }

        // Get the uploaded file
        const uploadedFile = files.file?.[0];
        if (!uploadedFile) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = uploadedFile.filepath;
        const fileType = path.extname(uploadedFile.originalFilename || '').toLowerCase();

        let validationResult;
        // Parse the file based on its type
        if (fileType === '.csv') {
          validationResult = await parseCSVFile(filePath, profile.id);
        } else if (fileType === '.xlsx') {
          validationResult = await parseXLSXFile(filePath, profile.id);
        } else {
          // Clean up the uploaded file
          fs.unlinkSync(filePath);
          return res.status(400).json({ message: 'Unsupported file type. Please upload CSV or XLSX file.' });
        }

        // Clean up the uploaded file regardless of result
        fs.unlinkSync(filePath);

        // If validation failed completely
        if (!validationResult.success) {
          return res.status(400).json({
            message: 'File validation failed',
            errors: validationResult.errors,
            stats: {
              totalRecords: validationResult.totalRecords,
              validRecords: validationResult.validRecords,
              invalidRecords: validationResult.invalidRecords
            }
          });
        }

        // If there are valid plans, insert them into the database
        if (validationResult.validPlans.length > 0) {
          try {
            // Insert each validated plan
            for (const planData of validationResult.validPlans) {
              await storage.createCompanyPlan(planData);
            }

            return res.status(200).json({
              message: 'Plans uploaded successfully',
              stats: {
                totalRecords: validationResult.totalRecords,
                validRecords: validationResult.validRecords,
                invalidRecords: validationResult.invalidRecords
              },
              warnings: validationResult.invalidRecords > 0 ? validationResult.errors : undefined
            });
          } catch (dbError: any) {
            console.error('Error saving plans to database:', dbError);
            return res.status(500).json({ 
              message: 'Failed to save plans to database: ' + dbError.message,
              errors: validationResult.errors,
              stats: {
                totalRecords: validationResult.totalRecords,
                validRecords: validationResult.validRecords,
                invalidRecords: validationResult.invalidRecords
              }
            });
          }
        } else {
          return res.status(400).json({ 
            message: 'No valid plans found in the uploaded file',
            errors: validationResult.errors,
            stats: {
              totalRecords: validationResult.totalRecords,
              validRecords: validationResult.validRecords,
              invalidRecords: validationResult.invalidRecords
            }
          });
        }
      });
    } catch (error: any) {
      console.error("Error handling plan upload:", error);
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
      
      // Mock analytics data for now
      // In a real implementation, this would come from aggregations of user interactions and conversions
      const analyticsData = {
        totalPlans: 12,
        planCategoryCounts: {
          travel: 5,
          auto: 3,
          pet: 2,
          health: 2
        },
        marketplaceVisits: 324,
        planComparisons: 187,
        quoteRequests: 65,
        conversionRate: 0.13,
        topPerformingPlans: [
          { id: 1, name: "Premium Travel Insurance", category: "travel", views: 124, conversions: 14 },
          { id: 2, name: "Comprehensive Auto Coverage", category: "auto", views: 95, conversions: 9 },
          { id: 3, name: "Pet Insurance Plus", category: "pet", views: 67, conversions: 5 }
        ]
      };
      
      res.json(analyticsData);
    } catch (error: any) {
      console.error("Error retrieving analytics:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  // ChatGPT integration endpoints
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Invalid request. 'message' is required." });
      }
      
      const response = await getChatCompletionFromOpenAI(message);
      
      res.json({ response });
    } catch (error: any) {
      console.error("Error in chat completion:", error);
      res.status(500).json({ error: "Failed to process chat request", message: error.message });
    }
  });
  
  app.get("/api/insurance/explain/:term", async (req, res) => {
    try {
      const { term } = req.params;
      
      if (!term) {
        return res.status(400).json({ error: "Invalid request. 'term' is required." });
      }
      
      const explanation = await explainInsuranceTerm(term);
      
      res.json({ explanation });
    } catch (error: any) {
      console.error("Error explaining insurance term:", error);
      res.status(500).json({ error: "Failed to explain insurance term", message: error.message });
    }
  });
  
  app.post("/api/insurance/recommend", async (req, res) => {
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
  
  app.post("/api/insurance/compare", async (req, res) => {
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