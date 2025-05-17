import { pgTable, text, varchar, serial, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password"), // Added for email/username authentication
  firstName: varchar("firstName"), // Changed column name to camelCase to match JS conventions
  lastName: varchar("lastName"), // Changed column name to camelCase to match JS conventions
  profileImageUrl: text("profile_image_url"),
  googleId: text("google_id").unique(), // Added for Google authentication
  role: text("role").default("user"), // "user" or "company"
  companyProfile: jsonb("company_profile"), // JSON data for company accounts
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  destination: text("destination").notNull(),
  countryOfOrigin: text("country_of_origin").notNull(), // This will be used instead of tripType
  departureDate: text("departure_date").notNull(),
  returnDate: text("return_date").notNull(),
  travelers: integer("travelers").notNull(),
  estimatedCost: integer("estimated_cost").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsuranceCategory = "travel" | "auto" | "pet" | "health";

// Define category-specific field interfaces
export interface BasePlanFields {
  id: string;
  planId: string; 
  name: string;
  provider: string;
  category: InsuranceCategory;
  basePrice: number;
  coverageAmount: number;
  description?: string;
  benefits?: Record<string, any>;
  exclusions?: Record<string, any>;
  rating?: string;
  reviews?: number;
  country?: string;
  badge?: string;
}

export interface TravelPlanFields {
  tripCancellation?: number | string;
  tripInterruption?: number | string;
  emergencyMedical?: number;
  medicalEvacuation?: number;
  baggageCoverage?: number;
  baggageDelay?: number;
  travelDelay?: number;
  adventureActivities?: boolean;
  preExistingConditions?: boolean;
  rentalCarCoverage?: number;
  coverage24h?: boolean;
}

export interface AutoPlanFields {
  liabilityCoverage?: number;
  collisionCoverage?: number;
  comprehensiveCoverage?: number;
  personalInjuryProtection?: number;
  uninsuredMotoristCoverage?: boolean;
  roadSideAssistance?: boolean;
  rentalReimbursement?: number;
  deductible?: number;
  multiVehicleDiscount?: boolean;
  antiTheftDiscount?: boolean;
  safeDriverDiscount?: boolean;
}

export interface PetPlanFields {
  annualLimit?: number;
  deductible?: number;
  reimbursement?: number;
  illnessCoverage?: boolean;
  accidentCoverage?: boolean;
  wellnessCoverage?: boolean;
  dentalCoverage?: boolean;
  prescriptionCoverage?: boolean;
  behavioralTherapy?: boolean;
  waitingPeriod?: string;
  maximumAge?: number;
}

export interface HealthPlanFields {
  annualDeductible?: number;
  outOfPocketMax?: number;
  coInsurance?: string;
  primaryCareVisit?: string;
  specialistVisit?: string;
  emergencyRoomCare?: string;
  hospitalStay?: string;
  prescriptionDrugCoverage?: string;
  preventiveCare?: string;
  maternityCare?: boolean;
  mentalHealthCoverage?: boolean;
  networkType?: string;
}

// Define the insurance plan field labels for UI rendering
export const planFieldLabels: Record<InsuranceCategory, Record<string, string>> = {
  travel: {
    basePrice: "Premium",
    coverageAmount: "Total Coverage",
    tripCancellation: "Trip Cancellation",
    tripInterruption: "Trip Interruption",
    emergencyMedical: "Emergency Medical",
    medicalEvacuation: "Medical Evacuation",
    baggageCoverage: "Baggage Coverage",
    baggageDelay: "Baggage Delay",
    travelDelay: "Travel Delay",
    adventureActivities: "Adventure Activities",
    preExistingConditions: "Pre-existing Conditions",
    rentalCarCoverage: "Rental Car Coverage",
    coverage24h: "24/7 Coverage"
  },
  auto: {
    basePrice: "Annual Premium",
    coverageAmount: "Total Coverage",
    liabilityCoverage: "Liability Coverage",
    collisionCoverage: "Collision Coverage",
    comprehensiveCoverage: "Comprehensive Coverage",
    personalInjuryProtection: "Personal Injury Protection",
    uninsuredMotoristCoverage: "Uninsured Motorist Coverage",
    roadSideAssistance: "Roadside Assistance",
    rentalReimbursement: "Rental Reimbursement",
    deductible: "Deductible",
    multiVehicleDiscount: "Multi-vehicle Discount",
    antiTheftDiscount: "Anti-theft Discount",
    safeDriverDiscount: "Safe Driver Discount"
  },
  pet: {
    basePrice: "Annual Premium",
    coverageAmount: "Coverage Limit",
    annualLimit: "Annual Limit",
    deductible: "Deductible",
    reimbursement: "Reimbursement Percentage",
    illnessCoverage: "Illness Coverage",
    accidentCoverage: "Accident Coverage",
    wellnessCoverage: "Wellness Coverage",
    dentalCoverage: "Dental Coverage",
    prescriptionCoverage: "Prescription Coverage",
    behavioralTherapy: "Behavioral Therapy",
    waitingPeriod: "Waiting Period",
    maximumAge: "Maximum Age"
  },
  health: {
    basePrice: "Monthly Premium",
    coverageAmount: "Coverage Amount",
    annualDeductible: "Annual Deductible",
    outOfPocketMax: "Out-of-Pocket Maximum",
    coInsurance: "Co-insurance",
    primaryCareVisit: "Primary Care Visit",
    specialistVisit: "Specialist Visit",
    emergencyRoomCare: "Emergency Room Care",
    hospitalStay: "Hospital Stay",
    prescriptionDrugCoverage: "Prescription Drug Coverage",
    preventiveCare: "Preventive Care",
    maternityCare: "Maternity Care",
    mentalHealthCoverage: "Mental Health Coverage",
    networkType: "Network Type"
  }
};

// Helper function to format field values for display
export const formatFieldValue = (value: any, field: string): string => {
  if (value === undefined || value === null) return "Not covered";
  
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  
  if (typeof value === "number") {
    // Format currency values
    if (field.includes("Price") || 
        field.includes("Coverage") || 
        field.includes("Deductible") || 
        field.includes("Limit") || 
        field.includes("Max") ||
        field.includes("Reimbursement")) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }).format(value);
    }
    
    // Format percentage fields
    if (field === "reimbursement") {
      return `${value}%`;
    }
    
    return value.toString();
  }
  
  return value.toString();
};

// Define the insurance plans table with base fields common to all categories
export const insurancePlans = pgTable("insurance_plans", {
  id: serial("id").primaryKey(),
  planId: text("plan_id").notNull().unique(), // Unique plan identifier (can be external ID)
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  category: text("category").notNull().$type<InsuranceCategory>().default("travel"),
  basePrice: integer("base_price").notNull(),
  coverageAmount: integer("coverage_amount").notNull(), // Base coverage amount
  description: text("description"), // Plan description
  benefits: jsonb("benefits"), // Flexible benefits object for all plan types
  exclusions: jsonb("exclusions"), // Common exclusions
  rating: text("rating"),
  reviews: integer("reviews").default(0),
  country: text("country").default("all"),
  badge: text("badge"), // Featured, Best Value, etc.
  createdAt: timestamp("created_at").defaultNow(),
  
  // Category-specific fields stored as JSON
  categoryDetails: jsonb("category_details"), // Stores all category-specific fields
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  tripId: integer("trip_id").references(() => trips.id),
  planId: integer("plan_id").references(() => insurancePlans.id),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull(),
  paymentIntentId: text("payment_intent_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quote requests table for tracking insurance quote submissions
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  planId: text("plan_id").notNull(), // String ID to accommodate external plan IDs
  category: text("category").notNull().$type<InsuranceCategory>(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").notNull(),
  additionalInfo: jsonb("additional_info"), // Category-specific fields as JSON
  quoteReference: text("quote_reference").notNull().unique(), // Unique reference number
  status: text("status").notNull().default("pending"), // pending, processed, completed
  notificationSent: boolean("notification_sent").default(false),
  expiresAt: timestamp("expires_at"), // Quote validity period
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  googleId: true,
  role: true,
  companyProfile: true,
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  googleId: true,
  role: true,
});

// Additional schemas for authentication
export const registerUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
    firstName: true,
    lastName: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

export const loginUserSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertTripSchema = createInsertSchema(trips).pick({
  userId: true,
  destination: true,
  countryOfOrigin: true,
  departureDate: true,
  returnDate: true,
  travelers: true,
  estimatedCost: true,
});

export const insertInsurancePlanSchema = createInsertSchema(insurancePlans).omit({
  id: true,
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  tripId: true,
  planId: true,
  totalAmount: true,
  status: true,
  paymentIntentId: true,
});

// Quote submission schema for validation
export const insertQuoteSchema = createInsertSchema(quotes)
  .omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true, 
    quoteReference: true,
    status: true,
    notificationSent: true
  })
  .extend({
    // Add validations for core fields
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    additionalInfo: z.record(z.any()).optional()
  });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

// Include countryOfOrigin instead of tripType in the schema
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof trips.$inferSelect;

export type InsertInsurancePlan = z.infer<typeof insertInsurancePlanSchema>;
export type InsurancePlan = typeof insurancePlans.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// Insurance category types are defined above
