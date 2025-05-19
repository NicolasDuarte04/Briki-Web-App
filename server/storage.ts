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
      // Query the database for the user with this email
      const [user] = await db
        .select()
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
      const [user] = await db
        .insert(users)
        .values({
          id: userId,
          email: userData.email,
          username: userData.username || username,
          password: userData.password,
          role: userData.role || 'user',
          name: userData.name || username, // Use provided name or default
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          profileImageUrl: userData.profileImageUrl || null,
          company_profile: userData.company_profile || {} // Use provided company_profile or empty object
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

// Export a singleton instance of the storage
export const storage = new DatabaseStorage();