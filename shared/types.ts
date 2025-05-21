/**
 * Shared type definitions for Briki platform
 * These types are used across both client and server components
 */

/**
 * User type definition representing any authenticated user in the system
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: UserRole;
  companyId?: string; // For B2B users, reference to their company
  createdAt: string;
  updatedAt: string;
}

/**
 * Role-based user types to distinguish between B2C and B2B users
 */
export enum UserRole {
  CLIENT = "client",      // B2C regular user
  COMPANY = "company",    // B2B company user
  ADMIN = "admin"         // Platform administrator
}

/**
 * Company profile for B2B users
 */
export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  description?: string;
  logoUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isPublicProfile: boolean; // Whether this company is visible in marketplace
  isVerified: boolean;      // Whether this company has been verified
  features?: CompanyFeatures;
  createdAt: string;
  updatedAt: string;
}

/**
 * Toggle-able features for company profiles
 */
export interface CompanyFeatures {
  enableAnalytics: boolean;
  enableMarketplace: boolean;
  enableApiAccess: boolean;
  enableCustomBranding: boolean;
}

/**
 * Insurance plan type for the platform
 */
export interface InsurancePlan {
  id: string;
  companyId: string;
  name: string;
  category: InsuranceCategory;
  coverageAmount: number;
  monthlyPremium: number;
  annualPremium: number;
  deductible: number;
  features: string[];
  benefits: Record<string, any>;
  restrictions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Insurance categories supported by the platform
 */
export enum InsuranceCategory {
  TRAVEL = "travel",
  AUTO = "auto",
  PET = "pet",
  HEALTH = "health"
}

/**
 * Analytics event categories
 */
export enum EventCategory {
  NAVIGATION = "navigation",
  AUTH = "authentication",
  INSURANCE = "insurance",
  COMPANY = "company",
  MARKETPLACE = "marketplace",
  COPILOT = "copilot",
  COMPARISON = "comparison",
  USER = "user"
}