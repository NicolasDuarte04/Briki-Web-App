import { InsurancePlan } from "@/types/insurance";

export interface PlanInsight {
  type: 'best-value' | 'most-popular' | 'premium-choice' | 'budget-friendly';
  label: string;
  description: string;
  color: string;
  priority: number;
}

export interface PlanAnalytics {
  viewCount: number;
  selectionCount: number;
  compareCount: number;
  lastUpdated: Date;
}

// Calculate coverage-to-price ratio for best value analysis
export function calculateValueRatio(plan: InsurancePlan): number {
  const price = plan.basePrice || 1;
  const coverage = plan.coverageAmount || 0;
  return coverage / price;
}

// Determine if a plan offers the best value
export function isBestValue(plan: InsurancePlan, allPlans: InsurancePlan[]): boolean {
  const planRatio = calculateValueRatio(plan);
  const avgRatio = allPlans.reduce((sum, p) => sum + calculateValueRatio(p), 0) / allPlans.length;
  return planRatio > avgRatio * 1.2; // 20% above average
}

// Mock analytics data - in production this would come from a backend service
const mockAnalytics: Record<string, PlanAnalytics> = {
  'travel-latam-001': {
    viewCount: 1250,
    selectionCount: 340,
    compareCount: 180,
    lastUpdated: new Date()
  },
  'travel-basic-001': {
    viewCount: 980,
    selectionCount: 420,
    compareCount: 220,
    lastUpdated: new Date()
  },
  'travel-premium-001': {
    viewCount: 750,
    selectionCount: 180,
    compareCount: 95,
    lastUpdated: new Date()
  },
  'travel-family-001': {
    viewCount: 1100,
    selectionCount: 380,
    compareCount: 200,
    lastUpdated: new Date()
  }
};

// Get analytics for a specific plan
export function getPlanAnalytics(planId: string): PlanAnalytics {
  return mockAnalytics[planId] || {
    viewCount: Math.floor(Math.random() * 500) + 100,
    selectionCount: Math.floor(Math.random() * 100) + 20,
    compareCount: Math.floor(Math.random() * 50) + 10,
    lastUpdated: new Date()
  };
}

// Determine if a plan is most popular based on analytics
export function isMostPopular(plan: InsurancePlan, allPlans: InsurancePlan[]): boolean {
  const planAnalytics = getPlanAnalytics(plan.planId);
  const allAnalytics = allPlans.map(p => getPlanAnalytics(p.planId));
  
  // Calculate selection rate (selections / views)
  const planSelectionRate = planAnalytics.selectionCount / Math.max(planAnalytics.viewCount, 1);
  const avgSelectionRate = allAnalytics.reduce((sum, a) => {
    return sum + (a.selectionCount / Math.max(a.viewCount, 1));
  }, 0) / allAnalytics.length;
  
  return planSelectionRate > avgSelectionRate * 1.15; // 15% above average
}

// Check if plan is premium choice (high coverage, good rating)
export function isPremiumChoice(plan: InsurancePlan, allPlans: InsurancePlan[]): boolean {
  const rating = parseFloat(plan.rating || "0");
  const coverage = plan.coverageAmount || 0;
  
  const avgCoverage = allPlans.reduce((sum, p) => sum + (p.coverageAmount || 0), 0) / allPlans.length;
  const avgRating = allPlans.reduce((sum, p) => sum + parseFloat(p.rating || "0"), 0) / allPlans.length;
  
  return coverage > avgCoverage * 1.3 && rating > avgRating * 1.1;
}

// Check if plan is budget-friendly
export function isBudgetFriendly(plan: InsurancePlan, allPlans: InsurancePlan[]): boolean {
  const price = plan.basePrice || 0;
  const avgPrice = allPlans.reduce((sum, p) => sum + (p.basePrice || 0), 0) / allPlans.length;
  
  return price < avgPrice * 0.8; // 20% below average
}

// Generate insights for a plan
export function generatePlanInsights(plan: InsurancePlan, allPlans: InsurancePlan[]): PlanInsight[] {
  const insights: PlanInsight[] = [];
  
  if (isBestValue(plan, allPlans)) {
    insights.push({
      type: 'best-value',
      label: 'Best Value',
      description: 'Excellent coverage-to-price ratio',
      color: 'bg-emerald-500',
      priority: 1
    });
  }
  
  if (isMostPopular(plan, allPlans)) {
    insights.push({
      type: 'most-popular',
      label: 'Most Popular',
      description: 'Frequently chosen by travelers',
      color: 'bg-blue-500',
      priority: 2
    });
  }
  
  if (isPremiumChoice(plan, allPlans)) {
    insights.push({
      type: 'premium-choice',
      label: 'Premium Choice',
      description: 'Comprehensive coverage & high rating',
      color: 'bg-purple-500',
      priority: 3
    });
  }
  
  if (isBudgetFriendly(plan, allPlans)) {
    insights.push({
      type: 'budget-friendly',
      label: 'Budget Friendly',
      description: 'Great value for money',
      color: 'bg-orange-500',
      priority: 4
    });
  }
  
  // Sort by priority and return top 2 insights
  return insights.sort((a, b) => a.priority - b.priority).slice(0, 2);
}

// Track plan interaction (view, selection, comparison)
export function trackPlanInteraction(planId: string, action: 'view' | 'select' | 'compare'): void {
  // In production, this would send data to analytics service
  console.log(`[Analytics] Plan ${planId} - ${action} tracked`);
  
  // For demo, we could update local storage or state
  const key = `plan_analytics_${planId}`;
  const existing = localStorage.getItem(key);
  const analytics = existing ? JSON.parse(existing) : {
    viewCount: 0,
    selectionCount: 0,
    compareCount: 0,
    lastUpdated: new Date().toISOString()
  };
  
  switch (action) {
    case 'view':
      analytics.viewCount++;
      break;
    case 'select':
      analytics.selectionCount++;
      break;
    case 'compare':
      analytics.compareCount++;
      break;
  }
  
  analytics.lastUpdated = new Date().toISOString();
  localStorage.setItem(key, JSON.stringify(analytics));
}