/**
 * Plan Comparison Utilities
 * Functions to compare and score insurance plans based on various criteria
 */

import { InsuranceCategory } from "../../../shared/schema";

export interface ComparablePlan {
  id: string;
  name: string;
  provider: string;
  category: InsuranceCategory;
  price?: string;
  basePrice?: number;
  features: string[];
  rating?: string;
  coverageAmount?: number;
  [key: string]: any;
}

/**
 * Extract numeric price from string format
 * Examples: "Desde $75.000 COP/mes" -> 75000
 */
export function extractNumericPrice(priceString: string): number {
  if (!priceString) return 0;
  
  // Remove common text patterns
  const cleanedPrice = priceString
    .replace(/desde|from|starting at/gi, '')
    .replace(/mes|month|año|year|viaje|trip/gi, '')
    .replace(/cop|usd|eur|mxn|ars|clp|pen|brl/gi, '');
  
  // Extract numeric value
  const matches = cleanedPrice.match(/[\d,]+\.?\d*/);
  if (matches) {
    return parseFloat(matches[0].replace(/,/g, ''));
  }
  
  return 0;
}

/**
 * Compare plans by monthly cost
 */
export function compareByPrice(planA: ComparablePlan, planB: ComparablePlan): number {
  const priceA = planA.basePrice || extractNumericPrice(planA.price || '');
  const priceB = planB.basePrice || extractNumericPrice(planB.price || '');
  return priceA - priceB;
}

/**
 * Compare plans by number of features
 */
export function compareByFeatureCount(planA: ComparablePlan, planB: ComparablePlan): number {
  return (planB.features?.length || 0) - (planA.features?.length || 0);
}

/**
 * Compare plans by rating
 */
export function compareByRating(planA: ComparablePlan, planB: ComparablePlan): number {
  const ratingA = parseFloat(planA.rating || '0');
  const ratingB = parseFloat(planB.rating || '0');
  return ratingB - ratingA;
}

/**
 * Calculate relevance score for a plan based on user query
 */
export function calculateRelevanceScore(
  plan: ComparablePlan,
  userQuery: string,
  category?: InsuranceCategory
): number {
  let score = 0;
  const query = userQuery.toLowerCase();
  
  // Category match (highest weight)
  if (category && plan.category === category) {
    score += 50;
  }
  
  // Name and provider match
  if (plan.name.toLowerCase().includes(query)) {
    score += 20;
  }
  if (plan.provider.toLowerCase().includes(query)) {
    score += 15;
  }
  
  // Feature matches
  plan.features.forEach(feature => {
    if (feature.toLowerCase().includes(query)) {
      score += 5;
    }
  });
  
  // Price preference
  if (query.includes('barato') || query.includes('económico') || query.includes('cheap')) {
    const price = plan.basePrice || extractNumericPrice(plan.price || '');
    if (price > 0) {
      // Lower price = higher score
      score += Math.max(0, 20 - (price / 10000));
    }
  }
  
  if (query.includes('premium') || query.includes('completo') || query.includes('best')) {
    const price = plan.basePrice || extractNumericPrice(plan.price || '');
    if (price > 100000) {
      score += 15;
    }
  }
  
  // Rating bonus
  const rating = parseFloat(plan.rating || '0');
  score += rating * 2;
  
  return score;
}

/**
 * Get unique plans by provider (one per company)
 */
export function getUniquePlansByProvider(
  plans: ComparablePlan[],
  maxPlans: number = 4
): ComparablePlan[] {
  const uniquePlans: ComparablePlan[] = [];
  const seenProviders = new Set<string>();
  
  for (const plan of plans) {
    if (!seenProviders.has(plan.provider) && uniquePlans.length < maxPlans) {
      uniquePlans.push(plan);
      seenProviders.add(plan.provider);
    }
  }
  
  return uniquePlans;
}

/**
 * Sort and filter plans for AI recommendations
 */
export function getRecommendedPlans(
  plans: ComparablePlan[],
  userQuery: string,
  category?: InsuranceCategory,
  options: {
    maxPlans?: number;
    uniqueProviders?: boolean;
    sortBy?: 'relevance' | 'price' | 'rating' | 'features';
  } = {}
): ComparablePlan[] {
  const {
    maxPlans = 4,
    uniqueProviders = true,
    sortBy = 'relevance'
  } = options;
  
  // Calculate relevance scores
  let scoredPlans = plans.map(plan => ({
    plan,
    score: calculateRelevanceScore(plan, userQuery, category)
  }));
  
  // Sort by specified criteria
  switch (sortBy) {
    case 'price':
      scoredPlans.sort((a, b) => compareByPrice(a.plan, b.plan));
      break;
    case 'rating':
      scoredPlans.sort((a, b) => compareByRating(a.plan, b.plan));
      break;
    case 'features':
      scoredPlans.sort((a, b) => compareByFeatureCount(a.plan, b.plan));
      break;
    case 'relevance':
    default:
      scoredPlans.sort((a, b) => b.score - a.score);
  }
  
  // Extract sorted plans
  let sortedPlans = scoredPlans.map(item => item.plan);
  
  // Apply unique provider filter if requested
  if (uniqueProviders) {
    sortedPlans = getUniquePlansByProvider(sortedPlans, maxPlans);
  } else {
    sortedPlans = sortedPlans.slice(0, maxPlans);
  }
  
  return sortedPlans;
}

/**
 * Generate comparison summary between plans
 */
export function generateComparisonSummary(plans: ComparablePlan[]): {
  cheapest: ComparablePlan | null;
  mostFeatures: ComparablePlan | null;
  highestRated: ComparablePlan | null;
  priceRange: { min: number; max: number };
  averageFeatures: number;
} {
  if (plans.length === 0) {
    return {
      cheapest: null,
      mostFeatures: null,
      highestRated: null,
      priceRange: { min: 0, max: 0 },
      averageFeatures: 0
    };
  }
  
  // Find cheapest
  const cheapest = [...plans].sort(compareByPrice)[0];
  
  // Find most features
  const mostFeatures = [...plans].sort(compareByFeatureCount)[0];
  
  // Find highest rated
  const highestRated = [...plans].sort(compareByRating)[0];
  
  // Calculate price range
  const prices = plans.map(p => p.basePrice || extractNumericPrice(p.price || '')).filter(p => p > 0);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
  
  // Calculate average features
  const totalFeatures = plans.reduce((sum, plan) => sum + (plan.features?.length || 0), 0);
  const averageFeatures = Math.round(totalFeatures / plans.length);
  
  return {
    cheapest,
    mostFeatures,
    highestRated,
    priceRange,
    averageFeatures
  };
} 