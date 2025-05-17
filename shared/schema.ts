import { pgTable, serial, text, varchar, timestamp, pgEnum, boolean, integer, date, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database tables for user management
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").notNull(),
  email: varchar("email").unique(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(),
  role: varchar("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Database table for session management
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Insurance category enum
export const insuranceCategoryEnum = pgEnum("insurance_category", [
  "travel",
  "auto",
  "pet",
  "health",
]);

export type InsuranceCategory = "travel" | "auto" | "pet" | "health";

// Base fields for all insurance plans
export interface BasePlanFields {
  id: string;
  planId: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  basePrice: number;
  coverageAmount: number;
  description?: string;
  rating?: string;
  reviews?: number;
  country?: string;
  badge?: string;
}

// Category-specific fields for Travel Insurance
export interface TravelPlanFields {
  tripCancellation: number;
  tripInterruption: number;
  emergencyMedical: number;
  medicalEvacuation: number;
  baggageCoverage: number;
  baggageDelay: number;
  travelDelay: number;
  adventureActivities: boolean;
  preExistingConditions: boolean;
  rentalCarCoverage: number;
  coverage24h: boolean;
}

// Category-specific fields for Auto Insurance
export interface AutoPlanFields {
  liabilityCoverage: number;
  collisionCoverage: number;
  comprehensiveCoverage: number;
  personalInjuryProtection: number;
  uninsuredMotoristCoverage: boolean;
  roadSideAssistance: boolean;
  rentalReimbursement: number;
  deductible: number;
  multiVehicleDiscount: boolean;
  antiTheftDiscount: boolean;
  safeDriverDiscount: boolean;
}

// Category-specific fields for Pet Insurance
export interface PetPlanFields {
  annualLimit: number;
  deductible: number;
  reimbursement: number;
  illnessCoverage: boolean;
  accidentCoverage: boolean;
  wellnessCoverage: boolean;
  dentalCoverage: boolean;
  prescriptionCoverage: boolean;
  behavioralTherapy: boolean;
  waitingPeriod: string;
  maximumAge: number;
}

// Category-specific fields for Health Insurance
export interface HealthPlanFields {
  annualDeductible: number;
  outOfPocketMax: number;
  coInsurance: string;
  primaryCareVisit: string;
  specialistVisit: string;
  emergencyRoomCare: string;
  hospitalStay: string;
  prescriptionDrugCoverage: string;
  preventiveCare: string;
  maternityCare: boolean;
  mentalHealthCoverage: boolean;
  networkType: string;
}

// Field labels for UI display
export const planFieldLabels: Record<InsuranceCategory, Record<string, string>> = {
  travel: {
    basePrice: "Monthly Premium",
    coverageAmount: "Max Coverage",
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
    uninsuredMotoristCoverage: "Uninsured Motorist",
    roadSideAssistance: "Roadside Assistance",
    rentalReimbursement: "Rental Reimbursement",
    deductible: "Deductible",
    multiVehicleDiscount: "Multi-Vehicle Discount",
    antiTheftDiscount: "Anti-Theft Discount",
    safeDriverDiscount: "Safe Driver Discount"
  },
  pet: {
    basePrice: "Annual Premium",
    coverageAmount: "Max Annual Coverage",
    annualLimit: "Annual Limit",
    deductible: "Deductible",
    reimbursement: "Reimbursement %",
    illnessCoverage: "Illness Coverage",
    accidentCoverage: "Accident Coverage",
    wellnessCoverage: "Wellness Coverage",
    dentalCoverage: "Dental Coverage",
    prescriptionCoverage: "Prescription Coverage",
    behavioralTherapy: "Behavioral Therapy",
    waitingPeriod: "Waiting Period",
    maximumAge: "Maximum Pet Age"
  },
  health: {
    basePrice: "Monthly Premium",
    coverageAmount: "Lifetime Maximum",
    annualDeductible: "Annual Deductible",
    outOfPocketMax: "Out-of-Pocket Maximum",
    coInsurance: "Co-Insurance",
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
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  // Format currency fields
  if (
    field === 'basePrice' || 
    field === 'coverageAmount' || 
    field === 'tripCancellation' || 
    field === 'tripInterruption' || 
    field === 'emergencyMedical' || 
    field === 'medicalEvacuation' || 
    field === 'baggageCoverage' || 
    field === 'baggageDelay' || 
    field === 'travelDelay' || 
    field === 'rentalCarCoverage' || 
    field === 'liabilityCoverage' || 
    field === 'collisionCoverage' || 
    field === 'comprehensiveCoverage' || 
    field === 'personalInjuryProtection' || 
    field === 'rentalReimbursement' || 
    field === 'deductible' || 
    field === 'annualLimit' || 
    field === 'annualDeductible' || 
    field === 'outOfPocketMax'
  ) {
    // Format as currency
    return `$${value.toLocaleString()}`;
  }
  
  // Format percentage fields
  if (field === 'reimbursement') {
    return `${value}%`;
  }
  
  // Format boolean fields
  if (typeof value === 'boolean') {
    return value ? '✅ Yes' : '❌ No';
  }
  
  // Default return the value as string
  return String(value);
};

// Create insert schemas 
export const insertUserSchema = createInsertSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Types for sessions
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;