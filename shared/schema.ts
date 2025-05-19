import { pgTable, serial, varchar, timestamp, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base tables
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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
  planId: string;
  name: string;
  basePrice: number;
  coverageAmount: number;
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

export type InsurancePlan = TravelPlan | AutoPlan | PetPlan | HealthPlan;