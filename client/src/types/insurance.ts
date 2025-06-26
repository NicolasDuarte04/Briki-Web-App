import { InsuranceCategory as SharedInsuranceCategory } from '@shared/schema';

// Insurance category types
export type InsuranceCategory = SharedInsuranceCategory | 'general';

// Base plan fields that all insurance plans should have
export interface BasePlanFields {
  planId: string;
  name: string;
  basePrice: number;
  coverageAmount: number;
}

// Insurance plan interface based on the shared schema
export interface InsurancePlan {
  id: number | string;
  name: string;
  category: InsuranceCategory;
  provider: string;
  basePrice: number;
  coverageAmount: number;
  currency: string;
  country: string;
  benefits: string[];
  description?: string;
  duration?: string;
  tags?: string[];
  deductible?: number;
  copay?: string;
  validity?: string;
  // Deprecated/optional fields
  title?: string;
  price?: number;
  features?: string[];
  badge?: string;
  rating?: string;
  sourceLink?: string;
  coverageHighlights?: string;
  priceRange?: string;
}

// For mock plans that don't yet fully implement the InsurancePlan interface
export interface MockInsurancePlan {
  category: InsuranceCategory;
  id: string | number;
  title: string;
  provider: string;
  price: number;
  description?: string;
  features: string[];
  badge?: string;
  rating?: string;
  country?: string;
  sourceLink?: string;
  coverageHighlights?: string;
  priceRange?: string;
}