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
  insurancePlans,
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
} from "../shared/schema";
// DEPRECATED: Mock data loader is no longer used
// import { 
//   loadMockInsurancePlans, 
//   MockInsurancePlan, 
//   filterPlansByCategory, 
//   filterPlansByTags, 
//   filterPlansByUserNeed,
//   filterPlansByAttributes,
//   PlanFilters
// } from "./data-loader";

// Updated user input schema to match our enhanced DB schema
export const userAuthSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z.string().nullable(),
  name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  role: z.string().nullable().optional().default("user"),
  profileImageUrl: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  company_profile: z.any().optional()
});

export type User = SchemaUser;
export type UserAuth = z.infer<typeof userAuthSchema>;
export type UserUpdate = Partial<Omit<UserAuth, "id">>;

export interface Trip {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
}

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: UserAuth): Promise<User>;
  updateUser(id: string, updates: UserUpdate): Promise<User>;
  resetUsers(): Promise<void>;
  
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

  // Trip operations (placeholders)
  createTrip(tripData: any): Promise<any>;
  getTripsByUserId(userId: string): Promise<any[]>;

  // DEPRECATED: Mock plan operations are no longer supported
  // All insurance plans must be loaded from the database
}

export class DatabaseStorage implements IStorage {
    async getUser(id: string): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0];
    }
    async getUserByUsername(username: string): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.username, username));
        return result[0];
    }
    async getUserByEmail(email: string): Promise<User | undefined> {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0];
    }
    async getUserByGoogleId(googleId: string): Promise<User | undefined> {
        return undefined; // Placeholder
    }
    async createUser(userData: UserAuth): Promise<User> {
        const [user] = await db.insert(users).values(userData as any).returning();
        return user;
    }
    async updateUser(id: string, updates: UserUpdate): Promise<User> {
        const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
        return user;
    }
    async resetUsers(): Promise<void> {
        await db.delete(users);
    }
    async createQuote(quoteData: InsertQuote): Promise<Quote> {
        const [quote] = await db.insert(quotes).values(quoteData).returning();
        return quote;
    }
    async getQuoteById(id: number): Promise<Quote | undefined> {
        const result = await db.select().from(quotes).where(eq(quotes.id, id));
        return result[0];
    }
    async getQuoteByReference(reference: string): Promise<Quote | undefined> {
        const result = await db.select().from(quotes).where(eq(quotes.quoteReference, reference));
        return result[0];
    }
    async getUserQuotes(userId: string): Promise<Quote[]> {
        return await db.select().from(quotes).where(eq(quotes.userId, userId));
    }
    async updateQuoteStatus(id: number, status: string): Promise<Quote> {
        const [quote] = await db.update(quotes).set({ status }).where(eq(quotes.id, id)).returning();
        return quote;
    }
    async markQuoteNotificationSent(id: number): Promise<Quote> {
        const [quote] = await db.update(quotes).set({ notificationSent: true }).where(eq(quotes.id, id)).returning();
        return quote;
    }
    async getCompanyProfile(userId: string): Promise<CompanyProfile | undefined> {
        const result = await db.select().from(companyProfiles).where(eq(companyProfiles.userId, userId));
        return result[0];
    }
    async createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile> {
        const [newProfile] = await db.insert(companyProfiles).values(profile).returning();
        return newProfile;
    }
    async updateCompanyProfile(id: number, updates: Partial<InsertCompanyProfile>): Promise<CompanyProfile> {
        const [profile] = await db.update(companyProfiles).set(updates).where(eq(companyProfiles.id, id)).returning();
        return profile;
    }
    async createCompanyPlan(plan: InsertCompanyPlan): Promise<CompanyPlan> {
        const [newPlan] = await db.insert(companyPlans).values(plan).returning();
        return newPlan;
    }
    async getCompanyPlan(id: number): Promise<CompanyPlan | undefined> {
        const result = await db.select().from(companyPlans).where(eq(companyPlans.id, id));
        return result[0];
    }
    async getCompanyPlans(companyId: number): Promise<CompanyPlan[]> {
        return await db.select().from(companyPlans).where(eq(companyPlans.companyId, companyId));
    }
    async getCompanyPlansByCategory(companyId: number, category: InsuranceCategory): Promise<CompanyPlan[]> {
        return await db.select().from(companyPlans).where(and(eq(companyPlans.companyId, companyId), eq(companyPlans.category, category)));
    }
    async updateCompanyPlan(id: number, updates: Partial<InsertCompanyPlan>): Promise<CompanyPlan> {
        const [plan] = await db.update(companyPlans).set(updates).where(eq(companyPlans.id, id)).returning();
        return plan;
    }
    async deleteCompanyPlan(id: number): Promise<boolean> {
        const result = await db.delete(companyPlans).where(eq(companyPlans.id, id));
        return (result.rowCount ?? 0) > 0;
    }
    async updatePlanVisibility(id: number, marketplaceEnabled: boolean): Promise<CompanyPlan> {
        const [plan] = await db.update(companyPlans).set({ marketplaceEnabled }).where(eq(companyPlans.id, id)).returning();
        return plan;
    }
    async getPlanAnalytics(planId: number): Promise<PlanAnalytic[]> {
        return await db.select().from(planAnalytics).where(eq(planAnalytics.planId, planId)).orderBy(desc(planAnalytics.date));
    }
    async recordPlanView(planId: number): Promise<PlanAnalytic> {
        const [analytic] = await db.insert(planAnalytics).values({ 
            planId, 
            views: 1, 
            comparisons: 0, 
            conversions: 0,
            date: new Date()
        }).returning();
        return analytic;
    }
    async recordPlanComparison(planId: number): Promise<PlanAnalytic> {
        const [analytic] = await db.insert(planAnalytics).values({ 
            planId, 
            views: 0, 
            comparisons: 1, 
            conversions: 0,
            date: new Date()
        }).returning();
        return analytic;
    }
    async recordPlanConversion(planId: number): Promise<PlanAnalytic> {
        const [analytic] = await db.insert(planAnalytics).values({ 
            planId, 
            views: 0, 
            comparisons: 0, 
            conversions: 1,
            date: new Date()
        }).returning();
        return analytic;
    }
    async getDashboardAnalytics(companyId: number): Promise<any> {
        // Get all plans for this company
        const plans = await db.select().from(companyPlans).where(eq(companyPlans.companyId, companyId));
        
        // Get analytics for all plans in a single query with joins
        const analyticsWithPlans = await db
            .select({
                planId: planAnalytics.planId,
                planName: companyPlans.name,
                planCategory: companyPlans.category,
                views: planAnalytics.views,
                comparisons: planAnalytics.comparisons,
                conversions: planAnalytics.conversions,
                date: planAnalytics.date,
            })
            .from(planAnalytics)
            .innerJoin(companyPlans, eq(planAnalytics.planId, companyPlans.id))
            .where(eq(companyPlans.companyId, companyId))
            .orderBy(desc(planAnalytics.date));
        
        return {
            plans,
            analytics: analyticsWithPlans
        };
    }
    async createTrip(tripData: any): Promise<any> {
        return { id: 'trip123', ...tripData };
    }
    async getTripsByUserId(userId: string): Promise<any[]> {
        return [];
    }
}

export class MockDataStorage implements IStorage {
    private users: Map<string, User> = new Map();
    private emails: Map<string, string> = new Map();
    private usernames: Map<string, string> = new Map();
    private googleIds: Map<string, string> = new Map();
    private quotes: Map<string, Quote> = new Map();
    private companyProfiles: Map<string, CompanyProfile> = new Map();
    private companyPlans: Map<number, CompanyPlan> = new Map();
    private planAnalytics: Map<string, PlanAnalytic[]> = new Map();

    constructor() {
        // REMOVED: Loading of mock plans
    }

    async getUser(id: string): Promise<User | undefined> { return this.users.get(id); }
    async getUserByUsername(username: string): Promise<User | undefined> { const id = this.usernames.get(username); return id ? this.users.get(id) : undefined; }
    async getUserByEmail(email: string): Promise<User | undefined> { const id = this.emails.get(email); return id ? this.users.get(id) : undefined; }
    async getUserByGoogleId(googleId: string): Promise<User | undefined> { const id = this.googleIds.get(googleId); return id ? this.users.get(id) : undefined; }
    async createUser(userData: UserAuth): Promise<User> {
        const newUser: User = { ...userData, id: nanoid(), createdAt: new Date(), updatedAt: new Date() } as User;
        this.users.set(newUser.id, newUser);
        if(newUser.email) this.emails.set(newUser.email, newUser.id);
        if(newUser.username) this.usernames.set(newUser.username, newUser.id);
        return newUser;
    }
    async updateUser(id: string, updates: UserUpdate): Promise<User> {
        const user = this.users.get(id);
        if (!user) throw new Error("User not found");
        const updatedUser = { ...user, ...updates, updatedAt: new Date() };
        this.users.set(id, updatedUser);
        return updatedUser;
    }
    async resetUsers(): Promise<void> { this.users.clear(); this.emails.clear(); this.usernames.clear(); this.googleIds.clear(); }
    async createQuote(quoteData: InsertQuote): Promise<Quote> {
        const newQuote = { ...quoteData, id: Date.now(), createdAt: new Date(), updatedAt: new Date() } as Quote;
        this.quotes.set(newQuote.id.toString(), newQuote);
        return newQuote;
    }
    async getQuoteById(id: number): Promise<Quote | undefined> { return this.quotes.get(id.toString()); }
    async getQuoteByReference(reference: string): Promise<Quote | undefined> { return [...this.quotes.values()].find(q => q.quoteReference === reference); }
    async getUserQuotes(userId: string): Promise<Quote[]> { return [...this.quotes.values()].filter(q => q.userId === userId); }
    async updateQuoteStatus(id: number, status: string): Promise<Quote> { const q = this.quotes.get(id.toString()); if(!q) throw new Error("not found"); q.status = status; return q; }
    async markQuoteNotificationSent(id: number): Promise<Quote> { const q = this.quotes.get(id.toString()); if(!q) throw new Error("not found"); q.notificationSent = true; return q; }
    async getCompanyProfile(userId: string): Promise<CompanyProfile | undefined> { return this.companyProfiles.get(userId); }
    async createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile> {
        const newProfile = { ...profile, id: Date.now(), createdAt: new Date(), updatedAt: new Date() } as CompanyProfile;
        this.companyProfiles.set(profile.userId, newProfile);
        return newProfile;
    }
    async updateCompanyProfile(id: number, updates: Partial<InsertCompanyProfile>): Promise<CompanyProfile> {
        const profile = [...this.companyProfiles.values()].find(p => p.id === id);
        if (!profile) throw new Error("Profile not found");
        const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
        this.companyProfiles.set(profile.userId, updatedProfile);
        return updatedProfile;
    }
    async createCompanyPlan(plan: InsertCompanyPlan): Promise<CompanyPlan> {
        const newPlan = { ...plan, id: Date.now(), createdAt: new Date(), updatedAt: new Date() } as CompanyPlan;
        this.companyPlans.set(newPlan.id, newPlan);
        return newPlan;
    }
    async getCompanyPlan(id: number): Promise<CompanyPlan | undefined> { return this.companyPlans.get(id); }
    async getCompanyPlans(companyId: number): Promise<CompanyPlan[]> { return [...this.companyPlans.values()].filter(p => p.companyId === companyId); }
    async getCompanyPlansByCategory(companyId: number, category: InsuranceCategory): Promise<CompanyPlan[]> { return [...this.companyPlans.values()].filter(p => p.companyId === companyId && p.category === category); }
    async updateCompanyPlan(id: number, updates: Partial<InsertCompanyPlan>): Promise<CompanyPlan> {
        const plan = this.companyPlans.get(id);
        if (!plan) throw new Error("Plan not found");
        const updatedPlan = { ...plan, ...updates, updatedAt: new Date() };
        this.companyPlans.set(id, updatedPlan);
        return updatedPlan;
    }
    async deleteCompanyPlan(id: number): Promise<boolean> { return this.companyPlans.delete(id); }
    async updatePlanVisibility(id: number, marketplaceEnabled: boolean): Promise<CompanyPlan> {
        const plan = this.companyPlans.get(id);
        if (!plan) throw new Error("Plan not found");
        plan.marketplaceEnabled = marketplaceEnabled;
        return plan;
    }
    async getPlanAnalytics(planId: number): Promise<PlanAnalytic[]> { return this.planAnalytics.get(planId.toString()) || []; }
    async recordPlanView(planId: number): Promise<PlanAnalytic> {
        const newAnalytic = { id: Date.now(), planId, views: 1, comparisons: 0, conversions: 0, date: new Date() };
        this.planAnalytics.set(planId.toString(), [newAnalytic]);
        return newAnalytic;
    }
    async recordPlanComparison(planId: number): Promise<PlanAnalytic> {
        const newAnalytic = { id: Date.now(), planId, views: 0, comparisons: 1, conversions: 0, date: new Date() };
        this.planAnalytics.set(planId.toString(), [newAnalytic]);
        return newAnalytic;
    }
    async recordPlanConversion(planId: number): Promise<PlanAnalytic> {
        const newAnalytic = { id: Date.now(), planId, views: 0, comparisons: 0, conversions: 1, date: new Date() };
        this.planAnalytics.set(planId.toString(), [newAnalytic]);
        return newAnalytic;
    }
    async getDashboardAnalytics(companyId: number): Promise<any> { return {}; }
    async createTrip(tripData: any): Promise<any> { return { id: 'trip123', ...tripData }; }
    async getTripsByUserId(userId: string): Promise<any[]> { return []; }
}

export const storage: IStorage = new DatabaseStorage();
export const mockStorage: IStorage = new MockDataStorage();