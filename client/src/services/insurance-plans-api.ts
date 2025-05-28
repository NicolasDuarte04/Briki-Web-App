/**
 * Insurance Plans API Service
 * Replaces static mockPlans with dynamic API calls to the backend
 */

export interface InsurancePlan {
  id: string;
  name: string;
  provider: string;
  category: 'travel' | 'auto' | 'pet' | 'health';
  basePrice: number;
  coverageAmount: number;
  description?: string;
  features?: string[];
  rating?: string;
  reviews?: number;
  badge?: string;
  country?: string;
  [key: string]: any;
}

class InsurancePlansApiService {
  private baseUrl = '/api/insurance';

  /**
   * Fetch all insurance plans dynamically
   */
  async getAllPlans(): Promise<InsurancePlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plans`);
      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.statusText}`);
      }
      const plans = await response.json();
      console.log(`[Insurance API] Fetched ${plans.length} plans dynamically`);
      return plans;
    } catch (error) {
      console.error('[Insurance API] Error fetching all plans:', error);
      throw error;
    }
  }

  /**
   * Fetch plans by category dynamically
   */
  async getPlansByCategory(category: string): Promise<InsurancePlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/plans/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} plans: ${response.statusText}`);
      }
      const plans = await response.json();
      console.log(`[Insurance API] Fetched ${plans.length} ${category} plans dynamically`);
      return plans;
    } catch (error) {
      console.error(`[Insurance API] Error fetching ${category} plans:`, error);
      throw error;
    }
  }

  /**
   * Fetch a specific plan by ID
   */
  async getPlanById(id: string): Promise<InsurancePlan | null> {
    try {
      const response = await fetch(`${this.baseUrl}/plan/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch plan ${id}: ${response.statusText}`);
      }
      const plan = await response.json();
      console.log(`[Insurance API] Fetched plan dynamically: ${plan.name}`);
      return plan;
    } catch (error) {
      console.error(`[Insurance API] Error fetching plan ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search plans with criteria
   */
  async searchPlans(category: string, criteria?: any): Promise<InsurancePlan[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${category}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ criteria }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to search ${category} plans: ${response.statusText}`);
      }
      
      const plans = await response.json();
      console.log(`[Insurance API] Search returned ${plans.length} ${category} plans`);
      return plans;
    } catch (error) {
      console.error(`[Insurance API] Error searching ${category} plans:`, error);
      throw error;
    }
  }

  /**
   * Get available categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const categories = await response.json();
      console.log(`[Insurance API] Fetched ${categories.length} categories dynamically`);
      return categories;
    } catch (error) {
      console.error('[Insurance API] Error fetching categories:', error);
      throw error;
    }
  }
}

// Export singleton instance for use throughout the app
export const insurancePlansApi = new InsurancePlansApiService();

// Export for dependency injection if needed
export { InsurancePlansApiService };