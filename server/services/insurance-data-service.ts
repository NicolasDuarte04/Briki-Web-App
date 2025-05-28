import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export interface MockInsurancePlan {
  id: string;
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

/**
 * Insurance Data Service
 * Provides dynamic access to the expanded insurance plan database
 */
class InsuranceDataService {
  private plans: MockInsurancePlan[] = [];
  private plansByCategory: Record<string, MockInsurancePlan[]> = {};
  private dataPath: string;

  constructor() {
    this.dataPath = join(process.cwd(), 'server', 'data');
    this.loadAllPlans();
  }

  /**
   * Load all insurance plans from JSON files in the data directory
   */
  private loadAllPlans(): void {
    console.log('Loading insurance plans from expanded database...');
    
    const categories = ['travel', 'auto', 'pet', 'health'];
    
    for (const category of categories) {
      const categoryPath = join(this.dataPath, category);
      
      try {
        const files = readdirSync(categoryPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        console.log(`Loading ${jsonFiles.length} ${category} plans...`);
        
        for (const file of jsonFiles) {
          try {
            const filePath = join(categoryPath, file);
            const fileContent = readFileSync(filePath, 'utf-8');
            const planData = JSON.parse(fileContent) as MockInsurancePlan;
            
            // Ensure category is set correctly
            planData.category = category;
            
            this.plans.push(planData);
            
            // Group by category
            if (!this.plansByCategory[category]) {
              this.plansByCategory[category] = [];
            }
            this.plansByCategory[category].push(planData);
            
            console.log(`Loaded plan: ${planData.name} (${category})`);
          } catch (error) {
            console.error(`Error loading plan file ${file}:`, error);
          }
        }
      } catch (error) {
        console.error(`Error reading category directory ${category}:`, error);
      }
    }
    
    console.log(`Total plans loaded: ${this.plans.length}`);
    console.log('Plans by category:', Object.keys(this.plansByCategory).map(cat => 
      `${cat}: ${this.plansByCategory[cat].length}`
    ).join(', '));
  }

  /**
   * Get all insurance plans
   */
  getAllPlans(): MockInsurancePlan[] {
    return this.plans.filter(plan => plan.status === 'active');
  }

  /**
   * Get plans by category
   */
  getPlansByCategory(category: string): MockInsurancePlan[] {
    return this.plansByCategory[category]?.filter(plan => plan.status === 'active') || [];
  }

  /**
   * Get a specific plan by ID
   */
  getPlanById(id: string): MockInsurancePlan | null {
    return this.plans.find(plan => plan.id === id && plan.status === 'active') || null;
  }

  /**
   * Get plans by provider
   */
  getPlansByProvider(provider: string): MockInsurancePlan[] {
    return this.plans.filter(plan => 
      plan.provider.toLowerCase().includes(provider.toLowerCase()) && 
      plan.status === 'active'
    );
  }

  /**
   * Search plans by query (name, description, features, tags)
   */
  searchPlans(query: string): MockInsurancePlan[] {
    const searchTerm = query.toLowerCase();
    
    return this.plans.filter(plan => {
      if (plan.status !== 'active') return false;
      
      return (
        plan.name.toLowerCase().includes(searchTerm) ||
        plan.description.toLowerCase().includes(searchTerm) ||
        plan.features.some(feature => feature.toLowerCase().includes(searchTerm)) ||
        plan.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        plan.provider.toLowerCase().includes(searchTerm)
      );
    });
  }

  /**
   * Get plans filtered by price range
   */
  getPlansByPriceRange(minPrice: number, maxPrice: number): MockInsurancePlan[] {
    return this.plans.filter(plan => 
      plan.status === 'active' &&
      plan.basePrice >= minPrice && 
      plan.basePrice <= maxPrice
    );
  }

  /**
   * Get top-rated plans
   */
  getTopRatedPlans(limit: number = 10): MockInsurancePlan[] {
    return this.plans
      .filter(plan => plan.status === 'active')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  /**
   * Get most economical plans by category
   */
  getMostEconomicalPlans(category?: string): MockInsurancePlan[] {
    let plansToFilter = category ? this.getPlansByCategory(category) : this.getAllPlans();
    
    return plansToFilter
      .sort((a, b) => a.basePrice - b.basePrice)
      .slice(0, 5);
  }

  /**
   * Get premium plans by category
   */
  getPremiumPlans(category?: string): MockInsurancePlan[] {
    let plansToFilter = category ? this.getPlansByCategory(category) : this.getAllPlans();
    
    return plansToFilter
      .filter(plan => 
        plan.tags.some(tag => tag.toLowerCase().includes('premium')) ||
        plan.coverageAmount > 50000
      )
      .sort((a, b) => b.basePrice - a.basePrice);
  }

  /**
   * Get plans with specific features
   */
  getPlansWithFeatures(features: string[]): MockInsurancePlan[] {
    return this.plans.filter(plan => {
      if (plan.status !== 'active') return false;
      
      return features.some(feature =>
        plan.features.some(planFeature =>
          planFeature.toLowerCase().includes(feature.toLowerCase())
        )
      );
    });
  }

  /**
   * Get statistics about the loaded plans
   */
  getStatistics() {
    const stats = {
      totalPlans: this.plans.length,
      activePlans: this.getAllPlans().length,
      plansByCategory: {} as Record<string, number>,
      averageRating: 0,
      priceRange: { min: 0, max: 0 },
      topProviders: [] as string[]
    };

    // Calculate by category
    Object.keys(this.plansByCategory).forEach(category => {
      stats.plansByCategory[category] = this.plansByCategory[category].length;
    });

    // Calculate average rating
    const activePlans = this.getAllPlans();
    stats.averageRating = activePlans.reduce((sum, plan) => sum + plan.rating, 0) / activePlans.length;

    // Calculate price range
    const prices = activePlans.map(plan => plan.basePrice);
    stats.priceRange.min = Math.min(...prices);
    stats.priceRange.max = Math.max(...prices);

    // Get top providers
    const providerCounts: Record<string, number> = {};
    activePlans.forEach(plan => {
      providerCounts[plan.provider] = (providerCounts[plan.provider] || 0) + 1;
    });
    
    stats.topProviders = Object.entries(providerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([provider]) => provider);

    return stats;
  }

  /**
   * Reload plans from disk (for development/testing)
   */
  reloadPlans(): void {
    this.plans = [];
    this.plansByCategory = {};
    this.loadAllPlans();
  }
}

// Create singleton instance
export const insuranceDataService = new InsuranceDataService();

// Export for use in routes
export default insuranceDataService;