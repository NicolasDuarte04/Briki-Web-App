/**
 * Unified Plan Loader Service
 * Manages loading plans from real sources
 */

import { InsuranceCategory } from "@shared/schema";
import { RealInsurancePlan, realPlans, getRealPlansByCategory } from "@/data/realPlans";

// Type that represents real plans
export type UnifiedPlan = RealInsurancePlan & {
  id: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  features: string[];
  isExternal: boolean;
  externalLink: string | null;
  price: string | null;
  basePrice?: number;
};

/**
 * Convert real plan to unified format
 */
function realPlanToUnified(plan: RealInsurancePlan): UnifiedPlan {
  return {
    ...plan
  };
}

/**
 * Load all plans
 */
export async function loadAllPlans(): Promise<UnifiedPlan[]> {
  return realPlans.map(realPlanToUnified);
}

/**
 * Load plans by category
 */
export async function loadPlansByCategory(category: InsuranceCategory): Promise<UnifiedPlan[]> {
    const realCategoryPlans = getRealPlansByCategory(category);
  return realCategoryPlans.map(realPlanToUnified);
}

/**
 * Get recommended plans for AI assistant
 * Uses simple relevance scoring based on text matching
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

  // Simple relevance scoring based on text matching
  const scoredPlans = allPlans.map(plan => {
    const searchableText = `${plan.name} ${plan.provider} ${plan.description || ''} ${plan.features.join(' ')}`.toLowerCase();
    const queryTerms = userQuery.toLowerCase().split(' ');
    const score = queryTerms.reduce((acc, term) => 
      acc + (searchableText.includes(term) ? 1 : 0), 0
    );
    return { plan, score };
  });

  // Sort by score and take top N plans
  const recommended = scoredPlans
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPlans)
    .map(({ plan }) => plan);

  return recommended;
}

/**
 * Search plans across all sources
 */
export async function searchPlans(query: string): Promise<UnifiedPlan[]> {
  const allPlans = await loadAllPlans();
  
  const searchTerm = query.toLowerCase();
  return allPlans.filter(plan => {
    const searchableText = `${plan.name} ${plan.provider} ${plan.description || ''} ${plan.features.join(' ')}`.toLowerCase();
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