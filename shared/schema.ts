import { pgTable, serial, varchar, timestamp, text, integer, boolean, jsonb, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company profiles for business users
export const companyProfiles = pgTable("company_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  country: varchar("country"),
  website: varchar("website"),
  logo: varchar("logo"),
  marketplaceEnabled: boolean("marketplace_enabled").default(false),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CompanyProfile = typeof companyProfiles.$inferSelect;
export const insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompanyProfile = z.infer<typeof insertCompanyProfileSchema>;

// Session storage table for authentication
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Insurance categories
export const INSURANCE_CATEGORIES = {
  TRAVEL: "travel",
  AUTO: "auto",
  PET: "pet",
  HEALTH: "health"
} as const;

export type InsuranceCategory = typeof INSURANCE_CATEGORIES[keyof typeof INSURANCE_CATEGORIES];

// Quote schemas
export const travelQuoteSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  destination: z.string().min(2, "Destination is required"),
  departureDate: z.date({ required_error: "Departure date is required" }),
  returnDate: z.date({ required_error: "Return date is required" }),
  travelers: z.number().min(1, "At least one traveler is required").max(10, "Maximum 10 travelers allowed"),
  activities: z.array(z.string()).optional(),
  coverageLevel: z.enum(["basic", "standard", "premium"]).optional(),
  includesMedical: z.boolean().optional(),
  includesCancellation: z.boolean().optional(),
  includesValuables: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  category: z.literal(INSURANCE_CATEGORIES.TRAVEL)
});

// Type definitions
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;

export type TravelQuote = z.infer<typeof travelQuoteSchema>;

// Quote tables
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  category: varchar("category").notNull(),
  details: jsonb("details").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  status: varchar("status").default("draft"),
});

export type Quote = typeof quotes.$inferSelect;
export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

// Insurance plans
export interface BasePlanFields {
  id?: string;
  planId: string;
  name: string;
  basePrice: number;
  coverageAmount: number;
  provider?: string;
  category?: InsuranceCategory;
  rating?: string;
  reviews?: number;
  badge?: string;
  features?: string[];
  description?: string;
}

export interface TravelPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.TRAVEL;
  destinations: string[];
  coversMedical: boolean;
  coversCancellation: boolean;
  coversValuables: boolean;
  maxTripDuration: number;
  provider: string;
  description?: string;
  features: string[];
  rating?: string;
}

export interface AutoPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.AUTO;
  vehicleTypes: string[];
  comprehensive: boolean;
  roadside: boolean;
  provider: string;
  description?: string;
  features: string[];
  rating?: string;
}

export interface PetPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.PET;
  petTypes: string[];
  coversIllness: boolean;
  coversAccident: boolean;
  provider: string;
  description?: string;
  features: string[];
  rating?: string;
}

export interface HealthPlan extends BasePlanFields {
  category: typeof INSURANCE_CATEGORIES.HEALTH;
  coversPreventive: boolean;
  coversEmergency: boolean;
  coversSpecialist: boolean;
  provider: string;
  description?: string;
  features: string[];
  rating?: string;
}

// Field type definitions for category-specific fields
export type TravelPlanFields = Pick<TravelPlan, 'destinations' | 'coversMedical' | 'coversCancellation' | 'coversValuables' | 'maxTripDuration'>;
export type AutoPlanFields = Pick<AutoPlan, 'vehicleTypes' | 'comprehensive' | 'roadside'>;
export type PetPlanFields = Pick<PetPlan, 'petTypes' | 'coversIllness' | 'coversAccident'>;
export type HealthPlanFields = Pick<HealthPlan, 'coversPreventive' | 'coversEmergency' | 'coversSpecialist'>;

export type InsurancePlan = TravelPlan | AutoPlan | PetPlan | HealthPlan;

// Database table for company insurance plans
export const planStatusEnum = pgEnum('plan_status', ['draft', 'active', 'archived']);
export const planVisibilityEnum = pgEnum('plan_visibility', ['private', 'public']);

export const companyPlans = pgTable("company_plans", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companyProfiles.id).notNull(),
  planId: varchar("plan_id").notNull(),
  name: varchar("name").notNull(),
  category: varchar("category").notNull(),
  basePrice: integer("base_price").notNull(),
  coverageAmount: integer("coverage_amount").notNull(),
  provider: varchar("provider"),
  description: text("description"),
  features: jsonb("features"),
  rating: varchar("rating"),
  badge: varchar("badge"),
  categoryFields: jsonb("category_fields").notNull(),
  status: planStatusEnum("status").default('draft'),
  visibility: planVisibilityEnum("visibility").default('private'),
  marketplaceEnabled: boolean("marketplace_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    companyIdIdx: index("company_plans_company_id_idx").on(table.companyId),
    categoryIdx: index("company_plans_category_idx").on(table.category),
  }
});

export type CompanyPlan = typeof companyPlans.$inferSelect;
export const insertCompanyPlanSchema = createInsertSchema(companyPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompanyPlan = z.infer<typeof insertCompanyPlanSchema>;

// Plan analytics table to store performance metrics
export const planAnalytics = pgTable("plan_analytics", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").references(() => companyPlans.id).notNull(),
  views: integer("views").default(0),
  comparisons: integer("comparisons").default(0),
  conversions: integer("conversions").default(0),
  date: timestamp("date").defaultNow(),
}, (table) => {
  return {
    planIdIdx: index("plan_analytics_plan_id_idx").on(table.planId),
    dateIdx: index("plan_analytics_date_idx").on(table.date),
  }
});

export type PlanAnalytic = typeof planAnalytics.$inferSelect;
export const insertPlanAnalyticSchema = createInsertSchema(planAnalytics).omit({
  id: true,
});
export type InsertPlanAnalytic = z.infer<typeof insertPlanAnalyticSchema>;

// Field labels for different plan categories
export const planFieldLabels: Record<InsuranceCategory, Record<string, string>> = {
  travel: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    destinations: "Covered Destinations",
    coversMedical: "Medical Coverage",
    coversCancellation: "Cancellation Coverage",
    coversValuables: "Valuables Coverage",
    maxTripDuration: "Maximum Trip Duration"
  },
  auto: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    vehicleTypes: "Covered Vehicle Types",
    comprehensive: "Comprehensive Coverage",
    roadside: "Roadside Assistance"
  },
  pet: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    petTypes: "Covered Pet Types",
    coversIllness: "Illness Coverage",
    coversAccident: "Accident Coverage"
  },
  health: {
    basePrice: "Premium",
    coverageAmount: "Coverage Amount",
    coversPreventive: "Preventive Care",
    coversEmergency: "Emergency Care",
    coversSpecialist: "Specialist Coverage"
  }
};