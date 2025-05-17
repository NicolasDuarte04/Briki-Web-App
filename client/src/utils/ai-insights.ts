import { InsurancePlan } from "@/store/compare-store";

// Types for AI-generated insights
export type InsightTag = 'best-value' | 'best-coverage' | 'brikis-pick' | 'popular-choice' | 'budget-friendly' | 'comprehensive';

export interface PlanInsight {
  tag: InsightTag;
  reason: string;
  confidence: number; // 0-1 range representing AI confidence in this insight
}

// Helper function to determine if a plan should have the "best value" tag
const isBestValue = (plan: InsurancePlan, allPlans: InsurancePlan[]): boolean => {
  if (!plan.price) return false;
  
  // Simple algorithm: if the plan has above-average features count but below-average price
  const avgPrice = allPlans
    .filter(p => p.price && p.price > 0)
    .reduce((sum, p) => sum + (p.price || 0), 0) / allPlans.filter(p => p.price).length;
  
  const avgFeaturesCount = allPlans
    .filter(p => p.features && p.features.length > 0)
    .reduce((sum, p) => sum + (p.features ? p.features.length : 0), 0) / 
    allPlans.filter(p => p.features && p.features.length > 0).length;
  
  return (plan.price < avgPrice) && 
         (plan.features && plan.features.length >= avgFeaturesCount);
};

// Helper function to determine if a plan should have the "best coverage" tag
const isBestCoverage = (plan: InsurancePlan): boolean => {
  if (!plan.coverage) return false;
  
  // Check if the plan has comprehensive coverage details
  const coverageKeys = Object.keys(plan.coverage);
  const hasMedical = coverageKeys.some(key => key.toLowerCase().includes('medical'));
  const hasEmergency = coverageKeys.some(key => key.toLowerCase().includes('emergency'));
  const hasCancellation = coverageKeys.some(key => key.toLowerCase().includes('cancel'));
  
  // If the plan has good medical and emergency coverage, consider it "best coverage"
  return hasMedical && hasEmergency && hasCancellation;
};

// Helper function to identify if a plan should be "Briki's Pick"
const isBrikisPick = (plan: InsurancePlan, allPlans: InsurancePlan[]): boolean => {
  // Briki's pick is the plan with the best overall score based on a weighted algorithm
  
  // Get scores for different aspects (higher is better)
  let priceScore = 0;
  if (plan.price) {
    const avgPrice = allPlans
      .filter(p => p.price && p.price > 0)
      .reduce((sum, p) => sum + (p.price || 0), 0) / allPlans.filter(p => p.price).length;
    
    // Lower price than average gets higher score (inverse relationship)
    priceScore = avgPrice / (plan.price || avgPrice) * 50; // Scale to 0-50 range
  }
  
  // Feature count score (direct relationship)
  let featureScore = 0;
  if (plan.features) {
    const maxFeatures = Math.max(...allPlans.map(p => p.features ? p.features.length : 0));
    featureScore = (plan.features.length / maxFeatures) * 30; // Scale to 0-30 range
  }
  
  // Coverage breadth score (direct relationship)
  let coverageScore = 0;
  if (plan.coverage) {
    const maxCoverageKeys = Math.max(...allPlans.map(p => p.coverage ? Object.keys(p.coverage).length : 0));
    coverageScore = (Object.keys(plan.coverage).length / maxCoverageKeys) * 20; // Scale to 0-20 range
  }
  
  // Calculate total score (max 100)
  const totalScore = priceScore + featureScore + coverageScore;
  
  // Find the plan with the highest total score
  const allScores = allPlans.map(p => {
    let pScore = 0;
    
    // Price score
    if (p.price) {
      const avgPrice = allPlans
        .filter(p => p.price && p.price > 0)
        .reduce((sum, p) => sum + (p.price || 0), 0) / allPlans.filter(p => p.price).length;
      pScore += avgPrice / (p.price || avgPrice) * 50;
    }
    
    // Feature score
    if (p.features) {
      const maxFeatures = Math.max(...allPlans.map(p => p.features ? p.features.length : 0));
      pScore += (p.features.length / maxFeatures) * 30;
    }
    
    // Coverage score
    if (p.coverage) {
      const maxCoverageKeys = Math.max(...allPlans.map(p => p.coverage ? Object.keys(p.coverage).length : 0));
      pScore += (Object.keys(p.coverage).length / maxCoverageKeys) * 20;
    }
    
    return pScore;
  });
  
  // Find the maximum score among all plans
  const maxScore = Math.max(...allScores);
  
  // Check if this plan has the highest score or within 5% of the highest score
  return totalScore >= maxScore - 5;
};

// Helper function to determine if a plan is budget-friendly
const isBudgetFriendly = (plan: InsurancePlan, allPlans: InsurancePlan[]): boolean => {
  if (!plan.price) return false;
  
  // Find the average and minimum prices
  const prices = allPlans.filter(p => p.price).map(p => p.price as number);
  const minPrice = Math.min(...prices);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  // If price is within 20% of the minimum price, consider it budget-friendly
  return plan.price <= minPrice * 1.2 || plan.price <= avgPrice * 0.7;
};

/**
 * Generate insights for an insurance plan based on its features and how it compares to other plans
 */
export function generatePlanInsights(plan: InsurancePlan, allPlans: InsurancePlan[]): PlanInsight[] {
  const insights: PlanInsight[] = [];
  
  // Check for "Best Value" tag
  if (isBestValue(plan, allPlans)) {
    insights.push({
      tag: 'best-value',
      reason: 'Great balance of features and price compared to similar plans',
      confidence: 0.85
    });
  }
  
  // Check for "Best Coverage" tag
  if (isBestCoverage(plan)) {
    insights.push({
      tag: 'best-coverage',
      reason: 'Offers comprehensive coverage across medical, emergency, and cancellation benefits',
      confidence: 0.9
    });
  }
  
  // Check for "Briki's Pick" tag
  if (isBrikisPick(plan, allPlans)) {
    insights.push({
      tag: 'brikis-pick',
      reason: 'Our AI recommends this plan based on optimal balance of coverage, features, and price',
      confidence: 0.95
    });
  }
  
  // Check for "Budget-Friendly" tag
  if (isBudgetFriendly(plan, allPlans)) {
    insights.push({
      tag: 'budget-friendly',
      reason: 'One of the most affordable options with good basic coverage',
      confidence: 0.88
    });
  }
  
  // If no insights were generated but plan has features, add a generic one
  if (insights.length === 0 && plan.features && plan.features.length > 2) {
    insights.push({
      tag: 'comprehensive',
      reason: 'Includes multiple important coverage benefits',
      confidence: 0.7
    });
  }
  
  return insights;
}

/**
 * Sort plans by different AI-recommended criteria
 */
export function sortPlansByInsight(plans: InsurancePlan[], sortType: 'value' | 'coverage' | 'price' | 'recommended' = 'recommended'): InsurancePlan[] {
  switch (sortType) {
    case 'value':
      // Sort by value (calculated as features per unit price)
      return [...plans].sort((a, b) => {
        const aValue = a.features && a.price ? a.features.length / a.price : 0;
        const bValue = b.features && b.price ? b.features.length / b.price : 0;
        return bValue - aValue; // Higher value first
      });
      
    case 'coverage':
      // Sort by coverage breadth
      return [...plans].sort((a, b) => {
        const aCoverage = a.coverage ? Object.keys(a.coverage).length : 0;
        const bCoverage = b.coverage ? Object.keys(b.coverage).length : 0;
        return bCoverage - aCoverage; // More coverage first
      });
      
    case 'price':
      // Sort by price (low to high)
      return [...plans].sort((a, b) => {
        const aPrice = a.price || Number.MAX_SAFE_INTEGER;
        const bPrice = b.price || Number.MAX_SAFE_INTEGER;
        return aPrice - bPrice;
      });
      
    case 'recommended':
    default:
      // Sort by Briki's recommendation algorithm
      return [...plans].sort((a, b) => {
        // Give each plan a score
        const aInsights = generatePlanInsights(a, plans);
        const bInsights = generatePlanInsights(b, plans);
        
        // Calculate weighted score based on insights
        const getInsightScore = (insights: PlanInsight[]): number => {
          let score = 0;
          
          // Prioritize Briki's Pick
          if (insights.some(i => i.tag === 'brikis-pick')) {
            score += 100;
          }
          
          // Add points for other valuable insights
          if (insights.some(i => i.tag === 'best-value')) {
            score += 75;
          }
          
          if (insights.some(i => i.tag === 'best-coverage')) {
            score += 60;
          }
          
          if (insights.some(i => i.tag === 'popular-choice')) {
            score += 50;
          }
          
          if (insights.some(i => i.tag === 'budget-friendly')) {
            score += 40;
          }
          
          return score;
        };
        
        const aScore = getInsightScore(aInsights);
        const bScore = getInsightScore(bInsights);
        
        return bScore - aScore; // Higher score first
      });
  }
}