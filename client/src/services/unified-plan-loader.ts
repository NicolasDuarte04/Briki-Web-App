/**
 * Unified Plan Loader Service
 * Manages loading plans from both mock and real sources based on configuration
 */

import { InsuranceCategory } from "@shared/schema";
import { MockInsurancePlan, travelPlans, autoPlans, petPlans, healthPlans } from "@/components/plans/mockPlans";
import { RealInsurancePlan, realPlans, getRealPlansByCategory } from "@/data/realPlans";
import { shouldShowMockPlans, shouldShowRealPlans } from "@/config/plan-sources";
import { getRecommendedPlans } from "@/utils/plan-comparison";

// Type that can represent both mock and real plans
export type UnifiedPlan = (MockInsurancePlan | RealInsurancePlan) & {
  // Ensure common fields exist
  id: string | number;
  name?: string;
  title?: string;
  provider: string;
  category: InsuranceCategory;
  features: string[];
  isExternal?: boolean;
  externalLink?: string;
  price?: string | number;
  basePrice?: number;
};

/**
 * Convert mock plan to unified format
 */
function mockPlanToUnified(plan: MockInsurancePlan): UnifiedPlan {
  return {
    ...plan,
    name: plan.title || plan.title, // MockInsurancePlan uses 'title'
    basePrice: plan.price,
    price: plan.price,
    isExternal: false,
    features: plan.features || []
  };
}

/**
 * Convert real plan to unified format
 */
function realPlanToUnified(plan: RealInsurancePlan): UnifiedPlan {
  return {
    ...plan,
    title: plan.name, // For backward compatibility
    features: plan.features || []
  };
}

/**
 * Get all mock plans
 */
function getAllMockPlans(): MockInsurancePlan[] {
  return [...travelPlans, ...autoPlans, ...petPlans, ...healthPlans];
}

/**
 * Get mock plans by category
 */
function getMockPlansByCategory(category: InsuranceCategory): MockInsurancePlan[] {
  switch (category) {
    case 'travel':
      return travelPlans;
    case 'auto':
      return autoPlans;
    case 'pet':
      return petPlans;
    case 'health':
      return healthPlans;
    default:
      return [];
  }
}

/**
 * Load all plans based on configuration
 */
export async function loadAllPlans(): Promise<UnifiedPlan[]> {
  const plans: UnifiedPlan[] = [];

  // Load mock plans if enabled
  if (shouldShowMockPlans()) {
    const mockPlans = getAllMockPlans();
    plans.push(...mockPlans.map(mockPlanToUnified));
  }

  // Load real plans if enabled
  if (shouldShowRealPlans()) {
    plans.push(...realPlans.map(realPlanToUnified));
  }

  return plans;
}

/**
 * Load plans by category based on configuration
 */
export async function loadPlansByCategory(category: InsuranceCategory): Promise<UnifiedPlan[]> {
  const plans: UnifiedPlan[] = [];

  // Load mock plans if enabled
  if (shouldShowMockPlans()) {
    const mockPlans = getMockPlansByCategory(category);
    plans.push(...mockPlans.map(mockPlanToUnified));
  }

  // Load real plans if enabled
  if (shouldShowRealPlans()) {
    const realCategoryPlans = getRealPlansByCategory(category);
    plans.push(...realCategoryPlans.map(realPlanToUnified));
  }

  return plans;
}

/**
 * Get recommended plans for AI assistant
 * Ensures provider diversity and relevance
 */
export async function getAIRecommendedPlans(
  userQuery: string,
  category?: InsuranceCategory,
  maxPlans: number = 4
): Promise<UnifiedPlan[]> {
  // Load plans based on category or all
  const allPlans = category 
    ? await loadPlansByCategory(category)
    : await loadAllPlans();

  // Get recommended plans with provider diversity
  const recommended = getRecommendedPlans(
    allPlans as any,
    userQuery,
    category,
    {
      maxPlans,
      uniqueProviders: true,
      sortBy: 'relevance'
    }
  );

  return recommended as UnifiedPlan[];
}

/**
 * Search plans across all sources
 */
export async function searchPlans(query: string): Promise<UnifiedPlan[]> {
  const allPlans = await loadAllPlans();
  
  const searchTerm = query.toLowerCase();
  return allPlans.filter(plan => {
    const planName = plan.name || plan.title || '';
    const searchableText = `${planName} ${plan.provider} ${plan.description || ''} ${plan.features.join(' ')}`.toLowerCase();
    return searchableText.includes(searchTerm);
  });
}

/**
 * Get plan by ID from any source
 */
export async function getPlanById(planId: string | number): Promise<UnifiedPlan | null> {
  const allPlans = await loadAllPlans();
  return allPlans.find(plan => String(plan.id) === String(planId)) || null;
}

/**
 * Get unique providers from all available plans
 */
export async function getAllProviders(): Promise<string[]> {
  const allPlans = await loadAllPlans();
  const providers = new Set(allPlans.map(plan => plan.provider));
  return Array.from(providers).sort();
}

/**
 * Helper to check if a plan is external
 */
export function isPlanExternal(plan: UnifiedPlan): boolean {
  return plan.isExternal === true && !!plan.externalLink;
} 