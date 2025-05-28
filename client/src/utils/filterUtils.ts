import { InsurancePlan } from "@/types/insurance";
import { AdvancedFilters } from "@/components/insurance/AdvancedFilterPanel";

export function applyAdvancedFilters(
  plans: InsurancePlan[],
  filters: AdvancedFilters
): InsurancePlan[] {
  return plans.filter((plan) => {
    // Price range filter
    const price = plan.basePrice || 0;
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Coverage amount filter
    const coverage = plan.coverageAmount || 0;
    if (coverage < filters.coverageRange[0] || coverage > filters.coverageRange[1]) {
      return false;
    }

    // Deductible range filter
    const deductible = plan.deductible || 0;
    if (deductible < filters.deductibleRange[0] || deductible > filters.deductibleRange[1]) {
      return false;
    }

    // Rating filter
    const rating = parseFloat(plan.rating || "0");
    if (rating < filters.rating) {
      return false;
    }

    // Provider filter
    if (filters.providers.length > 0 && !filters.providers.includes(plan.provider || "")) {
      return false;
    }

    // Features filter
    if (filters.features.length > 0) {
      const planFeatures = plan.features || [];
      const hasRequiredFeatures = filters.features.every(feature =>
        planFeatures.some(planFeature => 
          planFeature.toLowerCase().includes(feature.toLowerCase())
        )
      );
      if (!hasRequiredFeatures) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const planTags = plan.tags || [];
      const hasRequiredTags = filters.tags.every(tag =>
        planTags.some(planTag => 
          planTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasRequiredTags) {
        return false;
      }
    }

    return true;
  });
}

export function getFilterOptions(plans: InsurancePlan[]) {
  const providers = [...new Set(plans.map(plan => plan.provider).filter(Boolean))];
  
  const features = [...new Set(
    plans.flatMap(plan => plan.features || [])
  )].filter(Boolean);
  
  const tags = [...new Set(
    plans.flatMap(plan => plan.tags || [])
  )].filter(Boolean);

  return {
    providers: providers.sort(),
    features: features.sort(),
    tags: tags.sort()
  };
}

export function countActiveFilters(filters: AdvancedFilters): number {
  let count = 0;
  
  // Check if price range is not default
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
    count++;
  }
  
  // Check if coverage range is not default
  if (filters.coverageRange[0] > 0 || filters.coverageRange[1] < 100000) {
    count++;
  }
  
  // Check if deductible range is not default
  if (filters.deductibleRange[0] > 0 || filters.deductibleRange[1] < 1000) {
    count++;
  }
  
  // Check if rating is set
  if (filters.rating > 0) {
    count++;
  }
  
  // Check array filters
  if (filters.providers.length > 0) count++;
  if (filters.features.length > 0) count++;
  if (filters.tags.length > 0) count++;
  
  return count;
}

export function getDefaultFilters(): AdvancedFilters {
  return {
    priceRange: [0, 1000],
    coverageRange: [0, 100000],
    deductibleRange: [0, 1000],
    providers: [],
    features: [],
    tags: [],
    rating: 0
  };
}