import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { requireAuth } from "./auth/session";
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
  InsuranceCategory,
  blogPosts,
  blogCategories,
  blogTags,
  blogPostTags,
  BlogPostWithRelations,
  InsertBlogPost
} from "@shared/schema";
import { z } from "zod";
import { 
  getChatCompletionFromOpenAI, 
  generateInsuranceRecommendation, 
  explainInsuranceTerm, 
  comparePlans 
} from "./services/openai-service";
import { parseCSVFile, parseXLSXFile } from "./services/plan-upload";
import { insuranceDataService } from "./services/insurance-data-service";
import diagnosticRouter from './routes/diagnostic';
import googleAuthRoutes from './routes/google-auth';
import quotesRoutes from './routes/quotes';
import aiRouter from './routes/ai';
import insurancePlansRouter from './routes/insurance-plans';
import vehicleLookupRouter from './routes/vehicle-lookup';

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
  await setupAuth(app);
  
  app.use('/api/auth', googleAuthRoutes);
  app.use('/api/quotes', quotesRoutes);
  app.use('/api/ai', aiRouter);
  app.use('/api/insurance-plans', insurancePlansRouter);
  app.use('/api/diagnostic', diagnosticRouter);
  app.use('/api/lookup-plate', vehicleLookupRouter);

  try {
    const dbCheckPromise = pool.query('SELECT 1');
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 3000);
    });
    await Promise.race([dbCheckPromise, timeoutPromise]);
    console.log("Database connection verified successfully");
  } catch (error) {
    console.error("Database connection check failed:", error);
  }

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  
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

  app.post("/api/trips", requireAuth, async (req: AuthenticatedRequest, res) => {
    const validationResult = tripSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: "Invalid trip data", errors: validationResult.error.errors });
    }
    const tripData = validationResult.data;
    const userId = req.user.claims.sub;
    try {
        const trip = await storage.createTrip({ ...tripData, userId });
        res.status(201).json(trip);
    } catch(error: any) {
        res.status(500).json({ message: "Failed to create trip", error: error.message });
    }
  });

  app.get("/api/trips", requireAuth, async (req: AuthenticatedRequest, res) => {
    const userId = req.user.claims.sub;
    try {
        const trips = await storage.getTripsByUserId(userId);
        res.json(trips);
    } catch(error: any) {
        res.status(500).json({ message: "Failed to fetch trips", error: error.message });
    }
  });

  app.get("/api/plans", async (_req, res) => {
    try {
      const plans = await insuranceDataService.getAllPlans();
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });

  app.get("/api/insurance/plans", async (_req, res) => {
    try {
      const plans = await insuranceDataService.getAllPlans();
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  app.get("/api/plans/:category", async (req, res) => {
    try {
      const { category } = req.params;
      if (!category || !Object.values(INSURANCE_CATEGORIES).includes(category as any)) {
        return res.status(400).json({ message: "Invalid insurance category." });
      }
      const plans = await insuranceDataService.getPlansByCategory(category as InsuranceCategory);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });

  app.get("/api/insurance/plans/:category", async (req, res) => {
    try {
      const { category } = req.params;
      if (!category || !Object.values(INSURANCE_CATEGORIES).includes(category as any)) {
        return res.status(400).json({ message: "Invalid insurance category." });
      }
      const plans = await insuranceDataService.getPlansByCategory(category as InsuranceCategory);
      const providers = Array.from(new Set(plans.map(p => p.provider)));
      const features = Array.from(new Set(plans.flatMap(p => p.features || [])));
      const priceRange = plans.length > 0 ? [Math.min(...plans.map(p => p.basePrice)), Math.max(...plans.map(p => p.basePrice))] : [0, 1000];
      const coverageRange = plans.length > 0 ? [Math.min(...plans.map(p => p.coverageAmount)), Math.max(...plans.map(p => p.coverageAmount))] : [0, 100000];
      const metadata = { providers, features, priceRange, coverageRange, tags: [] };
      res.json({ plans, metadata, total: plans.length });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  app.get("/api/insurance/plan/:id", async (req, res) => {
    try {
        const plans = await storage.getAllInsurancePlans();
        res.json(plans);
    } catch (error: any) {
        res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  app.get("/api/insurance/plans/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const plans = await storage.getInsurancePlansByCategory(category as InsuranceCategory);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch insurance plans", error: error.message });
    }
  });
  
  app.post("/api/insurance/:category/search", async (req, res) => {
    try {
      const { category } = req.params;
      const plans = await storage.getInsurancePlansByCategory(category as InsuranceCategory);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to search insurance plans", error: error.message });
    }
  });

  if (stripe) {
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100),
          currency: "usd",
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  }
  
  app.get("/api/company/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
      const profile = await storage.getCompanyProfile(req.user.id);
      if (!profile) return res.status(404).json({ message: "Company profile not found" });
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  app.get("/api/company/plans", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
      const profile = await storage.getCompanyProfile(req.user.id);
      if (!profile) return res.status(404).json({ message: "Company profile not found" });
      const plans = await storage.getCompanyPlans(profile.id);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  app.get("/api/company/plans/category/:category", requireAuth, async (req: AuthenticatedRequest, res) => {
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
  
  app.get("/api/company/plans/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  app.put("/api/company/plans/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
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
      const updateData = validationResult.data as Partial<InsertCompanyPlan>;
      if ('companyId' in updateData) {
        delete (updateData as { companyId?: number }).companyId;
      }
      
      // Update the plan
      const updatedPlan = await storage.updateCompanyPlan(planId, updateData);
      
      res.json(updatedPlan);
    } catch (error: any) {
      console.error("Error updating company plan:", error);
      res.status(500).json({ message: error.message || "Server error" });
    }
  });
  
  app.delete("/api/company/plans/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
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
  
  app.patch("/api/company/plans/:id/visibility", requireAuth, async (req: AuthenticatedRequest, res) => {
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
  
  app.post("/api/company/plans", requireAuth, async (req: AuthenticatedRequest, res) => {
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
  
  app.post("/api/company/plans/upload", requireAuth, async (req: AuthenticatedRequest, res) => {
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
  
  app.get("/api/company/analytics", requireAuth, async (req: AuthenticatedRequest, res) => {
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

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      const { generateAssistantResponse } = await import("./services/openai-service.js");
      
      const response = await generateAssistantResponse(
        message,
        conversationHistory || [],
        [],
        "Colombia"
      );
      
      res.json(response);
    } catch (error: any) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/insurance/plans", async (req, res) => {
    try {
      const { insuranceDataService } = await import('./services/insurance-data-service.js');
      const plans = await insuranceDataService.getAllPlans();
      console.log(`[API] GET /api/insurance/plans - Returning ${plans.length} plans`);
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ error: "Failed to fetch insurance plans" });
    }
  });

  app.get("/api/insurance/plans/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const { search, minPrice, maxPrice, features } = req.query;
      
      let plans = await insuranceDataService.getPlansByCategory(category as InsuranceCategory);
      
      // Apply search filter
      if (search) {
        const searchResults = await insuranceDataService.searchPlans(search as string);
        plans = plans.filter((plan) => searchResults.some((result) => result.id === plan.id));
      }
      
      // Apply price filter
      if (minPrice || maxPrice) {
        const min = minPrice ? parseFloat(minPrice as string) : 0;
        const max = maxPrice ? parseFloat(maxPrice as string) : Infinity;
        plans = plans.filter(plan => plan.basePrice >= min && plan.basePrice <= max);
      }
      
      // Apply features filter
      if (features) {
        const featureList = (features as string).split(',');
        plans = plans.filter((plan) => 
          featureList.some((feature) => 
            (plan.features || []).some((planFeature) => 
              planFeature.toLowerCase().includes(feature.toLowerCase())
            )
          )
        );
      }
      
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching plans by category:", error);
      res.status(500).json({ error: "Failed to fetch insurance plans" });
    }
  });

  app.get("/api/insurance/plan/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await insuranceDataService.getPlanById(id);
      
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
      
      res.json(plan);
    } catch (error: any) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ error: "Failed to fetch insurance plan" });
    }
  });

  app.get("/api/insurance/search", async (req, res) => {
    try {
      const { q: query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const plans = await insuranceDataService.searchPlans(query as string);
      res.json(plans);
    } catch (error: any) {
      console.error("Error searching plans:", error);
      res.status(500).json({ error: "Failed to search insurance plans" });
    }
  });

  app.get("/api/insurance/provider/:provider", async (req, res) => {
    try {
      const { provider } = req.params;
      const plans = await insuranceDataService.getPlansByProvider(provider);
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching plans by provider:", error);
      res.status(500).json({ error: "Failed to fetch plans by provider" });
    }
  });

  app.get("/api/insurance/top-rated", async (req, res) => {
    try {
      const { limit = "10" } = req.query;
      const plans = await insuranceDataService.getTopRatedPlans(parseInt(limit as string));
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching top-rated plans:", error);
      res.status(500).json({ error: "Failed to fetch top-rated plans" });
    }
  });

  app.get("/api/insurance/economical", async (req, res) => {
    try {
      const { category } = req.query;
      const plans = await insuranceDataService.getMostEconomicalPlans(category as string | undefined);
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching economical plans:", error);
      res.status(500).json({ error: "Failed to fetch economical plans" });
    }
  });

  app.get("/api/insurance/premium", async (req, res) => {
    try {
      const { category } = req.query;
      const plans = await insuranceDataService.getPremiumPlans(category as string | undefined);
      res.json(plans);
    } catch (error: any) {
      console.error("Error fetching premium plans:", error);
      res.status(500).json({ error: "Failed to fetch premium plans" });
    }
  });

  app.get("/api/insurance/stats", async (req, res) => {
    try {
      const stats = await insuranceDataService.getStatistics();
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching insurance statistics:", error);
      res.status(500).json({ error: "Failed to fetch insurance statistics" });
    }
  });

  function isAdmin(user: any): boolean {
    return user && (user.role === 'admin' || (user.email && user.email.endsWith('@brikiapp.com')));
  }

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { category, tag, featured, limit = "20", offset = "0" } = req.query;
      
      let query = `
        SELECT 
          bp.*,
          u.name as author_name,
          u.email as author_email,
          bc.name as category_name,
          bc.slug as category_slug,
          bc.color as category_color,
          COALESCE(
            json_agg(
              CASE WHEN bt.name IS NOT NULL 
              THEN json_build_object('id', bt.id, 'name', bt.name, 'slug', bt.slug)
              ELSE NULL END
            ) FILTER (WHERE bt.name IS NOT NULL), 
            '[]'
          ) as tags
        FROM blog_posts bp
        JOIN users u ON bp.author_id = u.id
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bp.status = 'published'
      `;
      
      const queryParams: any[] = [];
      let paramCount = 0;
      
      if (category) {
        paramCount++;
        query += ` AND bc.slug = $${paramCount}`;
        queryParams.push(category);
      }
      
      if (featured === 'true') {
        query += ` AND bp.featured = true`;
      }
      
      query += `
        GROUP BY bp.id, u.name, u.email, bc.name, bc.slug, bc.color
        ORDER BY bp.published_at DESC, bp.created_at DESC
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;
      
      queryParams.push(parseInt(limit as string), parseInt(offset as string));
      
      const result = await pool.query(query, queryParams);
      
      let posts = result.rows.map(row => ({
        ...row,
        tags: row.tags || []
      }));
      
      // Filter by tag if specified
      if (tag) {
        posts = posts.filter(post => 
          post.tags.some((t: any) => t.slug === tag)
        );
      }
      
      res.json(posts);
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      const query = `
        SELECT 
          bp.*,
          u.name as author_name,
          u.email as author_email,
          bc.name as category_name,
          bc.slug as category_slug,
          bc.color as category_color,
          COALESCE(
            json_agg(
              CASE WHEN bt.name IS NOT NULL 
              THEN json_build_object('id', bt.id, 'name', bt.name, 'slug', bt.slug)
              ELSE NULL END
            ) FILTER (WHERE bt.name IS NOT NULL), 
            '[]'
          ) as tags
        FROM blog_posts bp
        JOIN users u ON bp.author_id = u.id
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bp.slug = $1 AND bp.status = 'published'
        GROUP BY bp.id, u.name, u.email, bc.name, bc.slug, bc.color
      `;
      
      const result = await pool.query(query, [slug]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      const post = {
        ...result.rows[0],
        tags: result.rows[0].tags || []
      };
      
      // Increment view count
      await pool.query(
        'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
        [post.id]
      );
      
      res.json(post);
    } catch (error: any) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.get("/api/blog/categories", async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM blog_categories ORDER BY name');
      res.json(result.rows);
    } catch (error: any) {
      console.error("Error fetching blog categories:", error);
      res.status(500).json({ error: "Failed to fetch blog categories" });
    }
  });

  app.get("/api/blog/tags", async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM blog_tags ORDER BY name');
      res.json(result.rows);
    } catch (error: any) {
      console.error("Error fetching blog tags:", error);
      res.status(500).json({ error: "Failed to fetch blog tags" });
    }
  });

  app.get("/api/blog/rss", async (req, res) => {
    console.log("RSS feed endpoint called");
    try {
      // Fetch published blog posts
      const result = await pool.query(`
        SELECT 
          bp.id,
          bp.title,
          bp.slug,
          bp.excerpt,
          bp.content,
          bp.published_at,
          COALESCE(u.name, u.email, 'Briki Team') as author,
          bc.name as category_name,
          ARRAY_AGG(bt.name) FILTER (WHERE bt.name IS NOT NULL) as tags
        FROM blog_posts bp
        LEFT JOIN users u ON bp.author_id = u.id
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        LEFT JOIN blog_post_tags bpt ON bp.id = bpt.post_id
        LEFT JOIN blog_tags bt ON bpt.tag_id = bt.id
        WHERE bp.status = 'published'
        GROUP BY bp.id, bp.title, bp.slug, bp.excerpt, bp.content, bp.published_at, u.name, u.email, bc.name
        ORDER BY bp.published_at DESC
        LIMIT 50
      `);

      const posts = result.rows;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const currentDate = new Date().toUTCString();

      // Generate RSS 2.0 XML
      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Briki Insurance Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Stay informed with the latest insights on travel, auto, pet, and health insurance from Briki.</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <generator>Briki Insurance Platform</generator>
    <webMaster>info@briki.com</webMaster>
    <managingEditor>info@briki.com</managingEditor>
    <image>
      <url>${baseUrl}/favicon.ico</url>
      <title>Briki Insurance Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
${posts.map(post => {
  const publishedDate = new Date(post.published_at).toUTCString();
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  
  // Clean content for RSS (remove HTML tags for description, keep for content:encoded)
  const cleanExcerpt = post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : '';
  const cleanContent = post.content ? post.content : '';
  
  return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description><![CDATA[${cleanExcerpt}]]></description>
      <content:encoded><![CDATA[${cleanContent}]]></content:encoded>
      <pubDate>${publishedDate}</pubDate>
      <dc:creator><![CDATA[${post.author || 'Briki Team'}]]></dc:creator>
      ${post.category_name ? `<category><![CDATA[${post.category_name}]]></category>` : ''}
      ${post.tags && post.tags.length > 0 ? post.tags.map((tag: any) => `<category><![CDATA[${tag}]]></category>`).join('\n      ') : ''}
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

      res.set({
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      });
      
      res.send(rssXml);
    } catch (error: any) {
      console.error("Error generating RSS feed:", error);
      res.status(500).json({ error: "Failed to generate RSS feed" });
    }
  });

  const requireBlogAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!isAdmin(req.user)) {
      return res.status(403).json({ error: "Admin access required for blog management" });
    }
    next();
  };

  app.get("/api/admin/blog/posts", requireAuth, requireBlogAdmin, async (req, res) => {
    try {
      const { status, limit = "50", offset = "0" } = req.query;
      
      let query = `
        SELECT 
          bp.*,
          u.name as author_name,
          u.email as author_email,
          bc.name as category_name,
          bc.slug as category_slug
        FROM blog_posts bp
        JOIN users u ON bp.author_id = u.id
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      `;
      
      const queryParams: any[] = [];
      let paramCount = 0;
      
      if (status) {
        paramCount++;
        query += ` WHERE bp.status = $${paramCount}`;
        queryParams.push(status);
      }
      
      query += `
        ORDER BY bp.updated_at DESC
        LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
      `;
      
      queryParams.push(parseInt(limit as string), parseInt(offset as string));
      
      const result = await pool.query(query, queryParams);
      res.json(result.rows);
    } catch (error: any) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", requireAuth, requireBlogAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { title, slug, excerpt, content, categoryId, status, featured, seoTitle, seoDescription, tags } = req.body;
      
      if (!title || !slug || !excerpt || !content) {
        return res.status(400).json({ error: "Title, slug, excerpt, and content are required" });
      }
      
      // Check if slug already exists
      const existingPost = await pool.query('SELECT id FROM blog_posts WHERE slug = $1', [slug]);
      if (existingPost.rows.length > 0) {
        return res.status(400).json({ error: "A post with this slug already exists" });
      }
      
      // Calculate read time (average reading speed: 200 words per minute)
      const wordCount = content.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(wordCount / 200));
      
      const publishedAt = status === 'published' ? new Date() : null;
      
      // Insert blog post
      const postResult = await pool.query(`
        INSERT INTO blog_posts (
          title, slug, excerpt, content, author_id, category_id, 
          status, featured, read_time, seo_title, seo_description, published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        title, slug, excerpt, content, req.user.id, categoryId || null,
        status || 'draft', featured || false, readTime, seoTitle, seoDescription, publishedAt
      ]);
      
      const newPost = postResult.rows[0];
      
      // Handle tags
      if (tags && tags.length > 0) {
        for (const tagName of tags) {
          // Get or create tag
          let tagResult = await pool.query('SELECT id FROM blog_tags WHERE name = $1', [tagName]);
          
          if (tagResult.rows.length === 0) {
            const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            tagResult = await pool.query(
              'INSERT INTO blog_tags (name, slug) VALUES ($1, $2) RETURNING id',
              [tagName, tagSlug]
            );
          }
          
          const tagId = tagResult.rows[0].id;
          
          // Link post to tag
          await pool.query(
            'INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1, $2)',
            [newPost.id, tagId]
          );
        }
      }
      
      res.status(201).json(newPost);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ error: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", requireAuth, requireBlogAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { title, slug, excerpt, content, categoryId, status, featured, seoTitle, seoDescription, tags } = req.body;
      
      // Check if post exists
      const existingPost = await pool.query('SELECT * FROM blog_posts WHERE id = $1', [id]);
      if (existingPost.rows.length === 0) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      // Check if slug conflicts with another post
      if (slug) {
        const conflictingPost = await pool.query('SELECT id FROM blog_posts WHERE slug = $1 AND id != $2', [slug, id]);
        if (conflictingPost.rows.length > 0) {
          return res.status(400).json({ error: "A post with this slug already exists" });
        }
      }
      
      // Calculate read time if content changed
      let readTime = existingPost.rows[0].read_time;
      if (content) {
        const wordCount = content.split(/\s+/).length;
        readTime = Math.max(1, Math.ceil(wordCount / 200));
      }
      
      const publishedAt = status === 'published' && !existingPost.rows[0].published_at ? new Date() : existingPost.rows[0].published_at;
      
      // Update blog post
      const updateResult = await pool.query(`
        UPDATE blog_posts SET
          title = COALESCE($1, title),
          slug = COALESCE($2, slug),
          excerpt = COALESCE($3, excerpt),
          content = COALESCE($4, content),
          category_id = COALESCE($5, category_id),
          status = COALESCE($6, status),
          featured = COALESCE($7, featured),
          read_time = $8,
          seo_title = COALESCE($9, seo_title),
          seo_description = COALESCE($10, seo_description),
          published_at = COALESCE($11, published_at),
          updated_at = NOW()
        WHERE id = $12
        RETURNING *
      `, [
        title, slug, excerpt, content, categoryId, status, featured, 
        readTime, seoTitle, seoDescription, publishedAt, id
      ]);
      
      // Update tags
      if (tags !== undefined) {
        // Remove existing tag associations
        await pool.query('DELETE FROM blog_post_tags WHERE post_id = $1', [id]);
        
        // Add new tag associations
        if (tags.length > 0) {
          for (const tagName of tags) {
            // Get or create tag
            let tagResult = await pool.query('SELECT id FROM blog_tags WHERE name = $1', [tagName]);
            
            if (tagResult.rows.length === 0) {
              const tagSlug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              tagResult = await pool.query(
                'INSERT INTO blog_tags (name, slug) VALUES ($1, $2) RETURNING id',
                [tagName, tagSlug]
              );
            }
            
            const tagId = tagResult.rows[0].id;
            
            // Link post to tag
            await pool.query(
              'INSERT INTO blog_post_tags (post_id, tag_id) VALUES ($1, $2)',
              [id, tagId]
            );
          }
        }
      }
      
      res.json(updateResult.rows[0]);
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ error: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", requireAuth, requireBlogAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      const result = await pool.query('DELETE FROM blog_posts WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      
      res.json({ message: "Blog post deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Failed to delete blog post" });
    }
  });

  app.post("/api/search", async (req, res) => {
    try {
      const { q, category } = req.query;
      const allPlans = await storage.getAllInsurancePlans();
      
      let filteredPlans = allPlans;
      if (category) {
        filteredPlans = filteredPlans.filter(plan => plan.category === category);
      }
      
      if (q) {
        const { semanticSearch } = await import("./services/semantic-search.js");
        const results = semanticSearch(q as string, filteredPlans, 10);
        return res.json(results);
      }
      
      res.json(filteredPlans);
    } catch (error: any) {
      console.error("GET /api/search - Error:", error);
      res.status(500).json({ message: "Failed to search insurance plans", error: error.message });
    }
  });

  const server = createServer(app);
  return server;
}