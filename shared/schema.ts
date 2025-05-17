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

export const insurancePlans = pgTable("insurance_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  category: text("category").notNull().$type<InsuranceCategory>().default("travel"),
  basePrice: integer("base_price").notNull(),
  medicalCoverage: integer("medical_coverage").notNull(),
  tripCancellation: text("trip_cancellation").notNull(),
  baggageProtection: integer("baggage_protection").notNull(),
  emergencyEvacuation: integer("emergency_evacuation"),
  adventureActivities: boolean("adventure_activities").default(false),
  rentalCarCoverage: integer("rental_car_coverage"),
  rating: text("rating"),
  reviews: integer("reviews").default(0),
  country: text("country").default("all"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Insurance category types are defined above
