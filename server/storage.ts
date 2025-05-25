import { db } from "./db";
import { eq, and, asc, desc, sql, ilike } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from 'nanoid';
import { 
  users,
  quotes, 
  companyProfiles,
  companyPlans,
  planAnalytics,
  InsertQuote, 
  Quote, 
  InsuranceCategory,
  User as SchemaUser,
  CompanyProfile,
  InsertCompanyProfile,
  CompanyPlan,
  InsertCompanyPlan,
  PlanAnalytic,
  InsertPlanAnalytic,
  INSURANCE_CATEGORIES
} from "@shared/schema";
import { 
  loadMockInsurancePlans, 
  MockInsurancePlan, 
  filterPlansByCategory, 
  filterPlansByTags, 
  filterPlansByUserNeed,
  filterPlansByAttributes,
  PlanFilters
} from "./data-loader";
import { semanticSearch } from "./services/semantic-search";

// Updated user input schema to match our enhanced DB schema
export const userAuthSchema = z.object({
  id: z.string().optional(), // String ID to support both DB and OAuth IDs
  email: z.string().email(),
  password: z.string().nullable(), // Nullable for social auth
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  role: z.string().nullable().optional().default("user"),
  profileImageUrl: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  company_profile: z.any().optional()
});

// Use the User type from our database schema
export type User = SchemaUser;

export type UserAuth = z.infer<typeof userAuthSchema>;
export type UserUpdate = Partial<Omit<UserAuth, "id">>;

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: UserAuth): Promise<User>;
  updateUser(id: string, updates: UserUpdate): Promise<User>;
  
  // Quote operations
  createQuote(quoteData: InsertQuote): Promise<Quote>;
  getQuoteById(id: number): Promise<Quote | undefined>;
  getQuoteByReference(reference: string): Promise<Quote | undefined>;
  getUserQuotes(userId: string): Promise<Quote[]>;
  updateQuoteStatus(id: number, status: string): Promise<Quote>;
  markQuoteNotificationSent(id: number): Promise<Quote>;
  
  // Company operations
  getCompanyProfile(userId: string): Promise<CompanyProfile | undefined>;
  createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile>;
  updateCompanyProfile(id: number, updates: Partial<InsertCompanyProfile>): Promise<CompanyProfile>;
  
  // Plan operations
  createCompanyPlan(plan: InsertCompanyPlan): Promise<CompanyPlan>;
  getCompanyPlan(id: number): Promise<CompanyPlan | undefined>;
  getCompanyPlans(companyId: number): Promise<CompanyPlan[]>;
  getCompanyPlansByCategory(companyId: number, category: InsuranceCategory): Promise<CompanyPlan[]>;
  updateCompanyPlan(id: number, updates: Partial<InsertCompanyPlan>): Promise<CompanyPlan>;
  deleteCompanyPlan(id: number): Promise<boolean>;
  updatePlanVisibility(id: number, marketplaceEnabled: boolean): Promise<CompanyPlan>;
  
  // Analytics operations
  getPlanAnalytics(planId: number): Promise<PlanAnalytic[]>;
  recordPlanView(planId: number): Promise<PlanAnalytic>;
  recordPlanComparison(planId: number): Promise<PlanAnalytic>;
  recordPlanConversion(planId: number): Promise<PlanAnalytic>;
  getDashboardAnalytics(companyId: number): Promise<any>;
}

// Implementation for PostgreSQL database
export class DatabaseStorage implements IStorage {
  // TODO: Fix LSP issues with quotes table (quoteReference and notificationSent)
  // Helper function to generate unique quote reference
  private generateQuoteReference(): string {
    // Format: BRK-{random 8 char alphanumeric}-{timestamp}
    const randomPart = nanoid(8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `BRK-${randomPart}-${timestamp}`;
  }
  
  // Helper function to generate a unique plan ID
  private generatePlanId(category: string, companyId: number): string {
    // Format: {category}-{companyId}-{random 6 char alphanumeric}-{timestamp}
    const randomPart = nanoid(6).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    const categoryPrefix = category.substring(0, 3).toUpperCase();
    return `${categoryPrefix}-${companyId}-${randomPart}-${timestamp}`;
  }
  
  // Utility function to generate a username from email
  private generateUsernameFromEmail(email: string): string {
    if (!email) return 'user';
    
    // Take part before the @ symbol
    const localPart = email.split('@')[0];
    // Remove special characters and spaces
    const sanitized = localPart.replace(/[^a-zA-Z0-9]/g, '');
    // Ensure it's not empty
    return sanitized || 'user';
  }
  async getUser(id: string): Promise<User | undefined> {
    try {
      // Convert string id to number since database uses integer ids
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        console.error("Invalid user ID format:", id);
        return undefined;
      }
      
      // Use SQL template for explicit type conversion
      const result = await db.execute(sql`
        SELECT * FROM users WHERE id = ${numericId} LIMIT 1
      `);
      
      if (!result || !result.rows || result.rows.length === 0) {
        return undefined;
      }
      
      return result.rows[0] as User;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1);
      
      if (user) {
        // Ensure the ID is handled as a string for consistency
        user.id = String(user.id);
      }
      
      return user;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    
    try {
      // Query the database for the user with this email, select specific fields to avoid issues
      // with missing columns
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          role: users.role,
          createdAt: users.createdAt
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      
      if (user) {
        // Ensure the ID is handled as a string for consistency
        user.id = String(user.id);
      }
      
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  // Since we don't have a dedicated googleId column in the database,
  // we need to search in the company_profile JSON field where we store it
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      // Using a simple query with the Pool directly for JSON field querying
      const result = await db.execute(sql`
        SELECT * FROM users 
        WHERE company_profile->>'googleProfileId' = ${googleId}
        LIMIT 1
      `);
      
      // Check if we got any rows back
      if (result && result.rows && result.rows.length > 0) {
        return result.rows[0] as User;
      }
      
      console.log(`No user found with Google ID: ${googleId}`);
      return undefined;
    } catch (error) {
      console.error("Error getting user by Google ID:", error);
      return undefined;
    }
  }

  async createUser(userData: UserAuth): Promise<User> {
    try {
      // Generate a username from email if not provided
      let username = userData.username;
      if (!username && userData.email) {
        // Take part before the @ symbol
        const localPart = userData.email.split('@')[0];
        // Remove special characters and spaces
        username = localPart.replace(/[^a-zA-Z0-9]/g, '');
        // Ensure it's not empty
        if (!username) username = 'user';
      } else if (!username) {
        username = 'user';
      }
      
      console.log("Attempting to create user with email:", userData.email);
      
      // Generate a user ID if not provided (string-based for compatibility with OAuth)
      const userId = userData.id || `user_${Date.now().toString()}`;
      
      // Use proper Drizzle ORM insert syntax matching our updated schema
      // Only include fields that exist in the database schema
      const [user] = await db
        .insert(users)
        .values({
          id: userId,
          email: userData.email,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          role: userData.role || 'user'
          // No updatedAt field - it's handled by the database default
        })
        .returning();
      
      console.log("User created successfully:", { id: user.id, email: user.email });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      // Log more detailed error information for debugging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      throw error;
    }
  }

  // Updated to match interface with two parameters and handle string IDs properly
  async updateUser(idParam: any, updates?: UserUpdate): Promise<User> {
    try {
      // Support both update patterns: updateUser(id, updates) and updateUser({id, ...updates})
      let id: string;
      let updateData: any = {};
      
      // Check if first parameter is an object containing id and updates
      if (typeof idParam === 'object' && idParam !== null) {
        // Extract id from the object and ensure it's a string
        id = String(idParam.id);
        
        // Copy all other properties as updates
        updateData = {...idParam};
        delete updateData.id; // Remove id from updates object
      } else {
        // Traditional approach: separate id and updates parameters
        id = String(idParam);
        updateData = updates || {};
      }
      
      if (!id) {
        throw new Error(`Invalid user ID: ${idParam}`);
      }
      
      // Using Drizzle ORM for the update - only include fields that exist in the actual DB
      const updateValues: any = {};
      
      // Build the update object with only fields that exist in our actual database
      if (updateData.username !== undefined) updateValues.username = updateData.username;
      if (updateData.email !== undefined) updateValues.email = updateData.email;
      if (updateData.password !== undefined) updateValues.password = updateData.password;
      if (updateData.name !== undefined) updateValues.name = updateData.name;
      if (updateData.role !== undefined) updateValues.role = updateData.role;
      // Handle profile fields
      if (updateData.firstName !== undefined) updateValues.firstName = updateData.firstName;
      if (updateData.lastName !== undefined) updateValues.lastName = updateData.lastName;
      if (updateData.profileImageUrl !== undefined) updateValues.profileImageUrl = updateData.profileImageUrl;
      
      // Special handling for company_profile to merge with existing data
      if (updateData.company_profile !== undefined) {
        console.log("Updating company_profile with:", updateData.company_profile);
        
        // First get the current user to properly merge profiles
        const result = await db.execute(sql`
          SELECT company_profile FROM users WHERE id = ${id} LIMIT 1
        `);
        
        let existingProfile = {};
        if (result?.rows?.[0]?.company_profile) {
          existingProfile = result.rows[0].company_profile;
          console.log("Retrieved existing company_profile:", existingProfile);
        }
        
        // Merge the existing profile with new updates
        updateValues.company_profile = {
          ...existingProfile,
          ...updateData.company_profile
        };
        
        console.log("Merged company_profile:", updateValues.company_profile);
      }
      
      if (Object.keys(updateValues).length === 0) {
        console.log("No updates provided for user", id);
        const user = await this.getUser(id.toString());
        return user as User;
      }
      
      console.log(`Updating user ${id} with:`, updateValues);
      
      // Add updatedAt timestamp
      updateValues.updatedAt = new Date();
      
      // Update the user in the database
      const [user] = await db
        .update(users)
        .set(updateValues)
        .where(eq(users.id, id))
        .returning();
      
      // Ensure ID is consistently treated as a string
      if (user) {
        user.id = String(user.id);
      }
      
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  // Quote operations
  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    try {
      // Generate a unique reference number for this quote
      const quoteReference = this.generateQuoteReference();
      
      // Set expiration date (30 days from now by default)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Insert the quote with the generated reference
      const [quote] = await db
        .insert(quotes)
        .values({
          ...quoteData,
          quoteReference,
          status: "pending",
          notificationSent: false,
          expiresAt
        })
        .returning();
      
      return quote;
    } catch (error) {
      console.error("Error creating quote:", error);
      throw error;
    }
  }

  async getQuoteById(id: number): Promise<Quote | undefined> {
    try {
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.id, id));
      
      return quote;
    } catch (error) {
      console.error("Error getting quote by ID:", error);
      return undefined;
    }
  }

  async getQuoteByReference(reference: string): Promise<Quote | undefined> {
    try {
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.quoteReference, reference));
      
      return quote;
    } catch (error) {
      console.error("Error getting quote by reference:", error);
      return undefined;
    }
  }

  async getUserQuotes(userId: string): Promise<Quote[]> {
    try {
      const userQuotes = await db
        .select()
        .from(quotes)
        .where(eq(quotes.userId, userId))
        .orderBy(quotes.createdAt);
      
      return userQuotes;
    } catch (error) {
      console.error("Error getting user quotes:", error);
      return [];
    }
  }

  async updateQuoteStatus(id: number, status: string): Promise<Quote> {
    try {
      const [updatedQuote] = await db
        .update(quotes)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(quotes.id, id))
        .returning();
      
      return updatedQuote;
    } catch (error) {
      console.error("Error updating quote status:", error);
      throw error;
    }
  }

  async markQuoteNotificationSent(id: number): Promise<Quote> {
    try {
      const [updatedQuote] = await db
        .update(quotes)
        .set({ 
          notificationSent: true,
          updatedAt: new Date()
        })
        .where(eq(quotes.id, id))
        .returning();
      
      return updatedQuote;
    } catch (error) {
      console.error("Error marking quote notification sent:", error);
      throw error;
    }
  }

  // Company operations
  async getCompanyProfile(userId: string): Promise<CompanyProfile | undefined> {
    try {
      const [profile] = await db
        .select()
        .from(companyProfiles)
        .where(eq(companyProfiles.userId, userId));
      
      return profile;
    } catch (error) {
      console.error("Error getting company profile:", error);
      return undefined;
    }
  }

  async createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile> {
    try {
      const [newProfile] = await db
        .insert(companyProfiles)
        .values(profile)
        .returning();
      
      return newProfile;
    } catch (error) {
      console.error("Error creating company profile:", error);
      throw error;
    }
  }

  async updateCompanyProfile(id: number, updates: Partial<InsertCompanyProfile>): Promise<CompanyProfile> {
    try {
      const [updatedProfile] = await db
        .update(companyProfiles)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(companyProfiles.id, id))
        .returning();
      
      return updatedProfile;
    } catch (error) {
      console.error("Error updating company profile:", error);
      throw error;
    }
  }

  // Plan operations
  async createCompanyPlan(plan: InsertCompanyPlan): Promise<CompanyPlan> {
    try {
      // Generate a unique plan ID if not provided
      if (!plan.planId) {
        plan.planId = this.generatePlanId(plan.category, plan.companyId);
      }
      
      // Ensure features is an array
      if (plan.features && typeof plan.features === 'string') {
        plan.features = JSON.parse(plan.features as any);
      }
      
      const [newPlan] = await db
        .insert(companyPlans)
        .values(plan)
        .returning();
      
      // Create an initial analytics entry for the plan
      await this.recordPlanView(newPlan.id);
      
      return newPlan;
    } catch (error) {
      console.error("Error creating company plan:", error);
      throw error;
    }
  }

  async getCompanyPlan(id: number): Promise<CompanyPlan | undefined> {
    try {
      const [plan] = await db
        .select()
        .from(companyPlans)
        .where(eq(companyPlans.id, id));
      
      return plan;
    } catch (error) {
      console.error("Error getting company plan:", error);
      return undefined;
    }
  }

  async getCompanyPlans(companyId: number): Promise<CompanyPlan[]> {
    try {
      const plans = await db
        .select()
        .from(companyPlans)
        .where(eq(companyPlans.companyId, companyId))
        .orderBy(companyPlans.updatedAt);
      
      return plans;
    } catch (error) {
      console.error("Error getting company plans:", error);
      return [];
    }
  }

  async getCompanyPlansByCategory(companyId: number, category: InsuranceCategory): Promise<CompanyPlan[]> {
    try {
      const plans = await db
        .select()
        .from(companyPlans)
        .where(
          and(
            eq(companyPlans.companyId, companyId),
            eq(companyPlans.category, category)
          )
        )
        .orderBy(companyPlans.updatedAt);
      
      return plans;
    } catch (error) {
      console.error("Error getting company plans by category:", error);
      return [];
    }
  }

  async updateCompanyPlan(id: number, updates: Partial<InsertCompanyPlan>): Promise<CompanyPlan> {
    try {
      // Ensure features is an array if provided
      if (updates.features && typeof updates.features === 'string') {
        updates.features = JSON.parse(updates.features as any);
      }
      
      const [updatedPlan] = await db
        .update(companyPlans)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(eq(companyPlans.id, id))
        .returning();
      
      return updatedPlan;
    } catch (error) {
      console.error("Error updating company plan:", error);
      throw error;
    }
  }

  async deleteCompanyPlan(id: number): Promise<boolean> {
    try {
      // Instead of actually deleting, mark as archived
      const [archivedPlan] = await db
        .update(companyPlans)
        .set({
          status: 'archived',
          updatedAt: new Date()
        })
        .where(eq(companyPlans.id, id))
        .returning();
      
      return !!archivedPlan;
    } catch (error) {
      console.error("Error deleting company plan:", error);
      return false;
    }
  }
  
  async updatePlanVisibility(id: number, marketplaceEnabled: boolean): Promise<CompanyPlan> {
    try {
      // Update both the marketplace enabled flag and set visibility to public/private accordingly
      const [updatedPlan] = await db
        .update(companyPlans)
        .set({
          marketplaceEnabled,
          visibility: marketplaceEnabled ? 'public' : 'private',
          updatedAt: new Date()
        })
        .where(eq(companyPlans.id, id))
        .returning();
      
      if (!updatedPlan) {
        throw new Error(`Plan with ID ${id} not found`);
      }
      
      return updatedPlan;
    } catch (error) {
      console.error("Error updating plan visibility:", error);
      throw error;
    }
  }

  // Analytics operations
  async getPlanAnalytics(planId: number): Promise<PlanAnalytic[]> {
    try {
      const analytics = await db
        .select()
        .from(planAnalytics)
        .where(eq(planAnalytics.planId, planId))
        .orderBy(asc(planAnalytics.date));
      
      return analytics;
    } catch (error) {
      console.error("Error getting plan analytics:", error);
      return [];
    }
  }

  async recordPlanView(planId: number): Promise<PlanAnalytic> {
    try {
      // Check if we have an analytics record for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [existingRecord] = await db
        .select()
        .from(planAnalytics)
        .where(
          and(
            eq(planAnalytics.planId, planId),
            eq(planAnalytics.date, today)
          )
        );
      
      if (existingRecord) {
        // Update existing record
        const [updated] = await db
          .update(planAnalytics)
          .set({
            views: existingRecord.views + 1
          })
          .where(eq(planAnalytics.id, existingRecord.id))
          .returning();
        
        return updated;
      } else {
        // Create new record
        const [newRecord] = await db
          .insert(planAnalytics)
          .values({
            planId,
            views: 1,
            comparisons: 0,
            conversions: 0,
            date: today
          })
          .returning();
        
        return newRecord;
      }
    } catch (error) {
      console.error("Error recording plan view:", error);
      throw error;
    }
  }

  async recordPlanComparison(planId: number): Promise<PlanAnalytic> {
    try {
      // Check if we have an analytics record for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [existingRecord] = await db
        .select()
        .from(planAnalytics)
        .where(
          and(
            eq(planAnalytics.planId, planId),
            eq(planAnalytics.date, today)
          )
        );
      
      if (existingRecord) {
        // Update existing record
        const [updated] = await db
          .update(planAnalytics)
          .set({
            comparisons: existingRecord.comparisons + 1
          })
          .where(eq(planAnalytics.id, existingRecord.id))
          .returning();
        
        return updated;
      } else {
        // Create new record
        const [newRecord] = await db
          .insert(planAnalytics)
          .values({
            planId,
            views: 0,
            comparisons: 1,
            conversions: 0,
            date: today
          })
          .returning();
        
        return newRecord;
      }
    } catch (error) {
      console.error("Error recording plan comparison:", error);
      throw error;
    }
  }

  async recordPlanConversion(planId: number): Promise<PlanAnalytic> {
    try {
      // Check if we have an analytics record for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const [existingRecord] = await db
        .select()
        .from(planAnalytics)
        .where(
          and(
            eq(planAnalytics.planId, planId),
            eq(planAnalytics.date, today)
          )
        );
      
      if (existingRecord) {
        // Update existing record
        const [updated] = await db
          .update(planAnalytics)
          .set({
            conversions: existingRecord.conversions + 1
          })
          .where(eq(planAnalytics.id, existingRecord.id))
          .returning();
        
        return updated;
      } else {
        // Create new record
        const [newRecord] = await db
          .insert(planAnalytics)
          .values({
            planId,
            views: 0,
            comparisons: 0,
            conversions: 1,
            date: today
          })
          .returning();
        
        return newRecord;
      }
    } catch (error) {
      console.error("Error recording plan conversion:", error);
      throw error;
    }
  }

  async getDashboardAnalytics(companyId: number): Promise<any> {
    try {
      // Get all plans for this company
      const plans = await this.getCompanyPlans(companyId);
      
      if (!plans.length) {
        return {
          totalViews: 0,
          totalComparisons: 0,
          totalConversions: 0,
          planCount: 0,
          categoryBreakdown: {},
          topPlans: [],
          recentActivity: []
        };
      }
      
      // Get all analytics for these plans
      const planIds = plans.map(plan => plan.id);
      
      // Get analytics for the past 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const analytics = await db
        .select()
        .from(planAnalytics)
        .where(
          and(
            sql`${planAnalytics.planId} IN (${planIds.join(', ')})`,
            sql`${planAnalytics.date} >= ${thirtyDaysAgo.toISOString()}`
          )
        );
      
      // Calculate totals
      const totalViews = analytics.reduce((sum, record) => sum + record.views, 0);
      const totalComparisons = analytics.reduce((sum, record) => sum + record.comparisons, 0);
      const totalConversions = analytics.reduce((sum, record) => sum + record.conversions, 0);
      
      // Calculate category breakdown
      const categoryBreakdown: Record<string, number> = {};
      plans.forEach(plan => {
        const category = plan.category;
        categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
      });
      
      // Get top performing plans
      const planAnalyticsSummary = planIds.map(planId => {
        const planAnalytics = analytics.filter(a => a.planId === planId);
        const plan = plans.find(p => p.id === planId);
        
        return {
          planId,
          planName: plan?.name || 'Unknown Plan',
          category: plan?.category || 'unknown',
          views: planAnalytics.reduce((sum, record) => sum + record.views, 0),
          comparisons: planAnalytics.reduce((sum, record) => sum + record.comparisons, 0),
          conversions: planAnalytics.reduce((sum, record) => sum + record.conversions, 0)
        };
      });
      
      // Sort by views
      const topPlans = planAnalyticsSummary
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
      
      // Get recent activity
      const recentActivities = analytics
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)
        .map(activity => {
          const plan = plans.find(p => p.id === activity.planId);
          return {
            date: activity.date,
            planName: plan?.name || 'Unknown Plan',
            planId: activity.planId,
            views: activity.views,
            comparisons: activity.comparisons,
            conversions: activity.conversions
          };
        });
      
      return {
        totalViews,
        totalComparisons,
        totalConversions,
        planCount: plans.length,
        categoryBreakdown,
        topPlans,
        recentActivity: recentActivities
      };
    } catch (error) {
      console.error("Error getting dashboard analytics:", error);
      return {
        totalViews: 0,
        totalComparisons: 0,
        totalConversions: 0,
        planCount: 0,
        categoryBreakdown: {},
        topPlans: [],
        recentActivity: []
      };
    }
  }
}

// Clase que implementa IStorage con datos cargados desde archivos JSON
export class MockDataStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private emails: Map<string, string> = new Map(); // email -> userId
  private usernames: Map<string, string> = new Map(); // username -> userId
  private googleIds: Map<string, string> = new Map(); // googleId -> userId
  private quotes: Map<string, Quote> = new Map();
  private companyProfiles: Map<string, CompanyProfile> = new Map(); // userId -> CompanyProfile
  private companyPlans: Map<number, CompanyPlan> = new Map(); // planId -> CompanyPlan
  private planAnalytics: Map<string, PlanAnalytic[]> = new Map(); // planId -> PlanAnalytic[]
  private mockInsurancePlans: MockInsurancePlan[] = [];
  
  constructor() {
    console.log("Initializing mock data storage...");
    
    // Cargar los planes de seguro mock
    try {
      this.mockInsurancePlans = loadMockInsurancePlans();
      console.log(`Loaded ${this.mockInsurancePlans.length} mock insurance plans`);
    } catch (error) {
      console.error("Error loading mock insurance plans:", error);
    }
  }

  // Métodos de usuario (implementaciones mínimas requeridas)
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const userId = this.usernames.get(username);
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const userId = this.emails.get(email);
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const userId = this.googleIds.get(googleId);
    if (!userId) return undefined;
    return this.users.get(userId);
  }

  async createUser(user: UserAuth): Promise<User> {
    const userId = user.id || nanoid();
    const newUser: User = {
      id: userId,
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      role: user.role || "user",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(userId, newUser);
    this.emails.set(user.email, userId);
    
    if (user.username) {
      this.usernames.set(user.username, userId);
    }
    
    return newUser;
  }

  async updateUser(id: string, updates: UserUpdate): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    
    return updatedUser;
  }

  // Métodos específicos para planes de seguro mock
  getAllInsurancePlans(): Promise<MockInsurancePlan[]> {
    return Promise.resolve(this.mockInsurancePlans);
  }

  getInsurancePlansByCategory(category: InsuranceCategory): Promise<MockInsurancePlan[]> {
    return Promise.resolve(filterPlansByCategory(this.mockInsurancePlans, category));
  }

  getInsurancePlansByTags(tags: string[]): Promise<MockInsurancePlan[]> {
    return Promise.resolve(filterPlansByTags(this.mockInsurancePlans, tags));
  }

  getInsurancePlansByUserNeed(need: string): Promise<MockInsurancePlan[]> {
    return Promise.resolve(filterPlansByUserNeed(this.mockInsurancePlans, need));
  }
  
  getInsurancePlansByAttributes(filters: PlanFilters): Promise<MockInsurancePlan[]> {
    return Promise.resolve(filterPlansByAttributes(this.mockInsurancePlans, filters));
  }
  
  semanticSearchPlans(query: string, limit: number = 5): Promise<MockInsurancePlan[]> {
    return Promise.resolve(semanticSearch(query, this.mockInsurancePlans, limit));
  }

  // Implementaciones vacías o mínimas para otros métodos requeridos
  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const id = Date.now();
    const quote = {
      id,
      ...quoteData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.quotes.set(id.toString(), quote);
    return quote;
  }

  async getQuoteById(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id.toString());
  }

  async getQuoteByReference(reference: string): Promise<Quote | undefined> {
    return Array.from(this.quotes.values()).find(q => q.quoteReference === reference);
  }

  async getUserQuotes(userId: string): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(q => q.userId === userId);
  }

  // Métodos restantes con implementaciones vacías o placeholder
  // ...

  // Implementaciones para las demás funciones requeridas
  // Para mantener la interface compatible, implementa todos los métodos de IStorage
  
  async resetUsers(): Promise<boolean> { return true; }
  async deleteUser(id: string): Promise<boolean> { return true; }
  async getAllUsers(): Promise<User[]> { return []; }
  async getUsersByEmail(email: string): Promise<User[]> { return []; }
  async getUsersByRole(role: string): Promise<User[]> { return []; }
  async setUserResetToken(userId: string, token: string): Promise<boolean> { return true; }
  async getUserByResetToken(token: string): Promise<User | undefined> { return undefined; }
  async clearUserResetToken(userId: string): Promise<boolean> { return true; }
  async updateQuote(id: number, updates: Partial<InsertQuote>): Promise<Quote | undefined> { return undefined; }
  async deleteQuote(id: number): Promise<boolean> { return true; }
  async getCompanyProfile(userId: string): Promise<CompanyProfile | undefined> { return undefined; }
  async createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile> { return {} as CompanyProfile; }
  async updateCompanyProfile(id: number, updates: Partial<InsertCompanyProfile>): Promise<CompanyProfile | undefined> { return undefined; }
  async deleteCompanyProfile(id: number): Promise<boolean> { return true; }
  async getAllCompanyProfiles(): Promise<CompanyProfile[]> { return []; }
  async getCompanyPlans(companyId: number): Promise<CompanyPlan[]> { return []; }
  async getCompanyPlansByCategory(companyId: number, category: InsuranceCategory): Promise<CompanyPlan[]> { return []; }
  async getCompanyPlan(planId: number): Promise<CompanyPlan | undefined> { return undefined; }
  async createCompanyPlan(plan: InsertCompanyPlan): Promise<CompanyPlan> { return {} as CompanyPlan; }
  async updateCompanyPlan(planId: number, updates: Partial<InsertCompanyPlan>): Promise<CompanyPlan | undefined> { return undefined; }
  async deleteCompanyPlan(planId: number): Promise<boolean> { return true; }
  async updatePlanAnalytics(planId: number, analyticsType: 'view' | 'comparison' | 'conversion'): Promise<boolean> { return true; }
  async getPlanAnalytics(planId: number): Promise<PlanAnalytic[]> { return []; }
  async getPlanRankingByViews(limit: number = 5): Promise<{planId: number, views: number}[]> { return []; }
  async getPlanRankingByConversions(limit: number = 5): Promise<{planId: number, conversions: number}[]> { return []; }
  async getTotalUsers(): Promise<number> { return 0; }
  async getRecentPlanActivity(limit: number = 5): Promise<PlanAnalytic[]> { return []; }
  async getDashboardAnalytics(companyId: number): Promise<any> { return {}; }
}

// Export a singleton instance of the storage
// Puedes cambiar entre DatabaseStorage y MockDataStorage según necesites
export const storage = new DatabaseStorage();

// También exportamos la versión de datos mock para poder usarla en rutas específicas
export const mockStorage = new MockDataStorage();