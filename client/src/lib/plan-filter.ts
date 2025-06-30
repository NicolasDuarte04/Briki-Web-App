import { RealInsurancePlan } from "@/data/realPlans";

// Define the InsurancePlan interface to match the backend
interface InsurancePlan {
  id: number;
  name: string;
  category: string;
  provider: string;
  basePrice: number;
  coverageAmount: number;
  currency: string;
  country: string;
  benefits: string[];
  description?: string;
  priceUnit?: string;
}

export interface FilterCriteria {
  maxResults?: number;
  relevanceThreshold?: number;
  userPreferences?: {
    preferredProviders?: string[];
    mustHaveFeatures?: string[];
    priceRange?: {
      min: number;
      max: number;
      currency: string;
      isMonthly?: boolean; // Whether the range is in monthly amounts
    };
  };
}

// Type guard to check if a plan is a RealInsurancePlan
function isRealPlan(plan: RealInsurancePlan | InsurancePlan): plan is RealInsurancePlan {
  return 'features' in plan;
}

/**
 * Gets the features/benefits array from a plan, handling both types
 */
function getPlanFeatures(plan: RealInsurancePlan | InsurancePlan): string[] {
  if (isRealPlan(plan)) {
    return plan.features;
  }
  return plan.benefits;
}

/**
 * Gets the monthly price for a plan
 */
function getMonthlyPrice(plan: RealInsurancePlan | InsurancePlan): number | undefined {
  if (!('basePrice' in plan) || typeof plan.basePrice !== 'number') {
    return undefined;
  }

  // Assume annual by default unless explicitly marked as monthly
  const isMonthly = plan.priceUnit === 'monthly';
  return isMonthly ? plan.basePrice : Math.round(plan.basePrice / 12);
}

/**
 * Calculates a relevance score for a plan based on user preferences
 */
function calculatePlanRelevance(plan: RealInsurancePlan | InsurancePlan, criteria: FilterCriteria): number {
  let score = 0;
  const preferences = criteria.userPreferences;

  if (!preferences) {
    return 1; // Default relevance if no preferences
  }

  // Provider preference boost (30% weight)
  if (preferences.preferredProviders?.includes(plan.provider)) {
    score += 0.3;
  }

  // Feature matching (40% weight)
  if (preferences.mustHaveFeatures && preferences.mustHaveFeatures.length > 0) {
    const planFeatures = getPlanFeatures(plan).map((f: string) => f.toLowerCase());
    const matchingFeatures = preferences.mustHaveFeatures.filter((feature: string) =>
      planFeatures.some((planFeature: string) => planFeature.includes(feature.toLowerCase()))
    );
    score += 0.4 * (matchingFeatures.length / preferences.mustHaveFeatures.length);
  } else {
    score += 0.4; // No required features specified
  }

  // Price range matching (30% weight)
  if (preferences.priceRange) {
    const monthlyPrice = getMonthlyPrice(plan);
    
    if (monthlyPrice !== undefined) {
      const { min, max } = preferences.priceRange;
      
      if (monthlyPrice >= min && monthlyPrice <= max) {
        score += 0.3; // Perfect price match
      } else {
        // Partial score based on how close we are to the range
        const distance = monthlyPrice < min ? min - monthlyPrice : monthlyPrice - max;
        const range = max - min;
        const penalty = Math.min(distance / range, 1);
        score += 0.3 * (1 - penalty);
      }
    } else {
      score += 0.15; // Half score if we can't determine price
    }
  } else {
    score += 0.3; // No price preference specified
  }

  return score;
}

/**
 * Filters and sorts insurance plans based on provided criteria
 */
export function filterPlans<T extends RealInsurancePlan | InsurancePlan>(
  plans: T[],
  criteria: FilterCriteria = {}
): T[] {
  const {
    maxResults = 4,
    relevanceThreshold = 0.3,
    userPreferences
  } = criteria;

  // Skip scoring if no preferences defined
  if (!userPreferences || 
      (!userPreferences.preferredProviders?.length && !userPreferences.mustHaveFeatures?.length)) {
    return plans.slice(0, maxResults);
  }

  // Score and filter plans
  const scoredPlans = plans.map(plan => ({
    plan,
    relevance: calculatePlanRelevance(plan, criteria)
  }));

  // Filter by relevance threshold and sort by score
  return scoredPlans
    .filter(({ relevance }) => relevance >= relevanceThreshold)
    .sort((a, b) => b.relevance - a.relevance)
    .map(({ plan }) => plan)
    .slice(0, maxResults);
}

/**
 * Extracts common features across a set of plans
 * Useful for building feature suggestions for user preferences
 */
export function extractCommonFeatures<T extends RealInsurancePlan | InsurancePlan>(plans: T[]): string[] {
  const featureFrequency: Record<string, number> = {};
  
  plans.forEach(plan => {
    const features = getPlanFeatures(plan);
    features.forEach((feature: string) => {
      const normalizedFeature = feature.toLowerCase();
      featureFrequency[normalizedFeature] = (featureFrequency[normalizedFeature] || 0) + 1;
    });
  });

  // Return features that appear in at least 20% of plans
  const minOccurrence = Math.max(1, Math.floor(plans.length * 0.2));
  return Object.entries(featureFrequency)
    .filter(([_, count]) => count >= minOccurrence)
    .map(([feature]) => feature);
} 