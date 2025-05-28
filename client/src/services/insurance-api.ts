/**
 * Insurance API Service
 * Provides client-side access to the insurance data API
 */

export interface InsurancePlan {
  id: string;
  planId: string;
  category: string;
  provider: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  duration: string;
  coverageAmount: number;
  coverage: {
    medical?: number;
    luggage?: number;
    cancellation?: number;
    liability?: number;
    collision?: number;
    comprehensive?: number;
    veterinary?: number;
    wellness?: number;
    emergency?: number;
    prescription?: number;
    dental?: number;
    vision?: number;
  };
  features: string[];
  deductible?: number;
  exclusions?: string[];
  addOns?: string[];
  tags: string[];
  rating: number;
  status: string;
  eligibility?: {
    minAge?: number;
    maxAge?: number;
    countries?: string[];
    restrictions?: string[];
  };
}

export interface InsuranceAPIFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
}

class InsuranceAPI {
  private baseURL = '/api/insurance';

  /**
   * Get all insurance plans
   */
  async getAllPlans(): Promise<InsurancePlan[]> {
    const response = await fetch(`${this.baseURL}/plans`);
    if (!response.ok) {
      throw new Error('Failed to fetch insurance plans');
    }
    return response.json();
  }

  /**
   * Get plans by category with optional filters
   */
  async getPlansByCategory(
    category: string, 
    filters?: InsuranceAPIFilters
  ): Promise<InsurancePlan[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.features?.length) params.append('features', filters.features.join(','));
    
    const url = `${this.baseURL}/plans/${category}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${category} insurance plans`);
    }
    
    return response.json();
  }

  /**
   * Get a specific plan by ID
   */
  async getPlanById(id: string): Promise<InsurancePlan> {
    const response = await fetch(`${this.baseURL}/plan/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch insurance plan');
    }
    return response.json();
  }

  /**
   * Search plans by query
   */
  async searchPlans(query: string): Promise<InsurancePlan[]> {
    const response = await fetch(`${this.baseURL}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search insurance plans');
    }
    return response.json();
  }

  /**
   * Get plans by provider
   */
  async getPlansByProvider(provider: string): Promise<InsurancePlan[]> {
    const response = await fetch(`${this.baseURL}/provider/${encodeURIComponent(provider)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch plans by provider');
    }
    return response.json();
  }

  /**
   * Get top-rated plans
   */
  async getTopRatedPlans(limit: number = 10): Promise<InsurancePlan[]> {
    const response = await fetch(`${this.baseURL}/top-rated?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch top-rated plans');
    }
    return response.json();
  }

  /**
   * Get most economical plans
   */
  async getEconomicalPlans(category?: string): Promise<InsurancePlan[]> {
    const url = `${this.baseURL}/economical${category ? `?category=${category}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch economical plans');
    }
    return response.json();
  }

  /**
   * Get premium plans
   */
  async getPremiumPlans(category?: string): Promise<InsurancePlan[]> {
    const url = `${this.baseURL}/premium${category ? `?category=${category}` : ''}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch premium plans');
    }
    return response.json();
  }

  /**
   * Get insurance statistics
   */
  async getStatistics(): Promise<{
    totalPlans: number;
    activePlans: number;
    plansByCategory: Record<string, number>;
    averageRating: number;
    priceRange: { min: number; max: number };
    topProviders: string[];
  }> {
    const response = await fetch(`${this.baseURL}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch insurance statistics');
    }
    return response.json();
  }
}

// Create singleton instance
export const insuranceAPI = new InsuranceAPI();

// Export the type for use in other components
export type { InsuranceAPIFilters };