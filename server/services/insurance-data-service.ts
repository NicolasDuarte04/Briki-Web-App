import { promises as fs } from 'fs';
import path from 'path';
// Import the type from the existing mockPlans file
export interface MockInsurancePlan {
  id: string;
  name: string;
  provider: string;
  category: 'travel' | 'auto' | 'pet' | 'health';
  basePrice: number;
  coverageAmount: number;
  description?: string;
  features?: string[];
  [key: string]: any;
}

/**
 * Insurance Data Service
 * Centralized service for loading and managing insurance plan data from JSON files
 */

export interface InsuranceDataService {
  getAllPlans(): Promise<MockInsurancePlan[]>;
  getPlansByCategory(category: string): Promise<MockInsurancePlan[]>;
  getPlanById(id: string): Promise<MockInsurancePlan | null>;
  searchPlans(query: string): Promise<MockInsurancePlan[]>;
  getAvailableCategories(): Promise<string[]>;
}

class InsuranceDataServiceImpl implements InsuranceDataService {
  private plansCache: MockInsurancePlan[] | null = null;
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DATA_DIR = path.join(process.cwd(), 'server', 'data');

  /**
   * Load all insurance plans from JSON files
   */
  private async loadPlansFromFiles(): Promise<MockInsurancePlan[]> {
    console.log('[Insurance Data Service] Loading plans from files...');
    const allPlans: MockInsurancePlan[] = [];
    
    try {
      const categories = ['travel', 'auto', 'pet', 'health'];
      
      for (const category of categories) {
        const categoryPath = path.join(this.DATA_DIR, category);
        
        try {
          const files = await fs.readdir(categoryPath);
          const jsonFiles = files.filter(file => file.endsWith('.json'));
          
          console.log(`[Insurance Data Service] Found ${jsonFiles.length} files in ${category} category`);
          
          for (const file of jsonFiles) {
            try {
              const filePath = path.join(categoryPath, file);
              const fileContent = await fs.readFile(filePath, 'utf-8');
              const planData = JSON.parse(fileContent);
              
              // Ensure the plan has the correct category
              const plan: MockInsurancePlan = {
                ...planData,
                category: category as any,
                id: planData.id || `${category}-${file.replace('.json', '')}`
              };
              
              allPlans.push(plan);
              console.log(`[Insurance Data Service] Loaded plan: ${plan.name} (${category})`);
            } catch (fileError) {
              console.error(`[Insurance Data Service] Error loading plan from ${file}:`, fileError);
            }
          }
        } catch (categoryError) {
          console.error(`[Insurance Data Service] Error reading category ${category}:`, categoryError);
        }
      }
      
      console.log(`[Insurance Data Service] Successfully loaded ${allPlans.length} total plans`);
      return allPlans;
      
    } catch (error) {
      console.error('[Insurance Data Service] Error loading plans:', error);
      throw new Error('Failed to load insurance plans from data files');
    }
  }

  /**
   * Get all insurance plans with caching
   */
  async getAllPlans(): Promise<MockInsurancePlan[]> {
    const now = Date.now();
    
    // Return cached data if it's still fresh
    if (this.plansCache && (now - this.lastCacheUpdate) < this.CACHE_TTL) {
      console.log('[Insurance Data Service] Returning cached plans');
      return this.plansCache;
    }
    
    // Load fresh data
    console.log('[Insurance Data Service] Cache expired or empty, loading fresh data');
    this.plansCache = await this.loadPlansFromFiles();
    this.lastCacheUpdate = now;
    
    return this.plansCache;
  }

  /**
   * Get plans by category
   */
  async getPlansByCategory(category: string): Promise<MockInsurancePlan[]> {
    const allPlans = await this.getAllPlans();
    const filteredPlans = allPlans.filter(plan => plan.category === category);
    
    console.log(`[Insurance Data Service] Found ${filteredPlans.length} plans for category: ${category}`);
    return filteredPlans;
  }

  /**
   * Get a specific plan by ID
   */
  async getPlanById(id: string): Promise<MockInsurancePlan | null> {
    const allPlans = await this.getAllPlans();
    const plan = allPlans.find(plan => plan.id === id);
    
    console.log(`[Insurance Data Service] Plan lookup for ID ${id}: ${plan ? 'found' : 'not found'}`);
    return plan || null;
  }

  /**
   * Search plans by query string
   */
  async searchPlans(query: string): Promise<MockInsurancePlan[]> {
    const allPlans = await this.getAllPlans();
    const lowercaseQuery = query.toLowerCase();
    
    const matchingPlans = allPlans.filter(plan => 
      plan.name.toLowerCase().includes(lowercaseQuery) ||
      plan.provider.toLowerCase().includes(lowercaseQuery) ||
      plan.description?.toLowerCase().includes(lowercaseQuery) ||
      plan.features?.some((feature: string) => feature.toLowerCase().includes(lowercaseQuery))
    );
    
    console.log(`[Insurance Data Service] Search for "${query}" found ${matchingPlans.length} matching plans`);
    return matchingPlans;
  }

  /**
   * Get all available categories
   */
  async getAvailableCategories(): Promise<string[]> {
    const allPlans = await this.getAllPlans();
    const categories = [...new Set(allPlans.map(plan => plan.category))];
    
    console.log(`[Insurance Data Service] Available categories: ${categories.join(', ')}`);
    return categories;
  }

  /**
   * Clear cache (useful for testing or when data files are updated)
   */
  clearCache(): void {
    console.log('[Insurance Data Service] Cache cleared');
    this.plansCache = null;
    this.lastCacheUpdate = 0;
  }
}

// Export singleton instance
export const insuranceDataService = new InsuranceDataServiceImpl();

// Export for dependency injection if needed
export { InsuranceDataServiceImpl };