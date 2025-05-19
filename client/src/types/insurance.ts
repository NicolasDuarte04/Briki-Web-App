// Insurance category types
export type InsuranceCategory = 'travel' | 'auto' | 'pet' | 'health';

// Base plan fields that all insurance plans should have
export interface BasePlanFields {
  planId: string;
  name: string;
  basePrice: number;
  coverageAmount: number;
}

// Insurance plan interface
export interface InsurancePlan extends BasePlanFields {
  category: InsuranceCategory;
  id: string;
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