import { promises as fs } from 'fs';
import path from 'path';
import { MockInsurancePlan } from '../data-loader';
import { db } from '../db';
import { insurancePlans } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { withDbRetry } from '../utils/db-retry';

/**
 * Insurance Data Service
 * Centralized service for loading and managing insurance plan data from database
 */

export interface InsuranceDataService {
  getAllPlans(): Promise<MockInsurancePlan[]>;
  getPlansByCategory(category: string): Promise<MockInsurancePlan[]>;
  getPlanById(id: string): Promise<MockInsurancePlan | null>;
  searchPlans(query: string): Promise<MockInsurancePlan[]>;
  getAvailableCategories(): Promise<string[]>;
  getPlansByProvider(provider: string): Promise<MockInsurancePlan[]>;
  getTopRatedPlans(limit: number): Promise<MockInsurancePlan[]>;
  getMostEconomicalPlans(category?: string): Promise<MockInsurancePlan[]>;
  getPremiumPlans(category?: string): Promise<MockInsurancePlan[]>;
  getStatistics(): Promise<any>;
}

class InsuranceDataServiceImpl implements InsuranceDataService {
  private plansCache: MockInsurancePlan[] | null = null;
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly DATA_DIR = path.join(process.cwd(), 'server', 'data');

  /**
   * Load all insurance plans from database
   */
  private async loadPlansFromDatabase(): Promise<MockInsurancePlan[]> {
    console.log('[Insurance Data Service] Loading plans from database...');
    
    try {
      const plans = await withDbRetry(
        () => db.select().from(insurancePlans),
        {
          maxRetries: 3,
          onRetry: (error, attempt) => {
            console.warn(`[InsuranceDataService] Retry attempt ${attempt} for getAllPlans:`, error.message);
          }
        }
      );
      
      // Transform database plans to MockInsurancePlan format
      const transformedPlans: MockInsurancePlan[] = plans.map(plan => ({
        id: plan.id.toString(),
        name: plan.name,
        category: plan.category as any,
        provider: plan.provider,
        basePrice: plan.basePrice,
        coverageAmount: plan.coverageAmount,
        currency: plan.currency,
        country: plan.country,
        features: plan.benefits || [],
        description: `${plan.name} by ${plan.provider}`,
        rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5 for now
        isExternal: plan.isExternal || false,
        externalLink: plan.externalLink || null,
        // Additional fields required by MockInsurancePlan
        duration: 'annual',
        coverage: {},
        deductible: 0,
        exclusions: [],
        additionalBenefits: [],
        tags: [],
        paymentOptions: ['monthly', 'annual'],
        addOns: [],
        status: 'active',
      }));
      
      console.log(`[Insurance Data Service] Successfully loaded ${transformedPlans.length} plans from database`);
      return transformedPlans;
      
    } catch (error) {
      console.error('[Insurance Data Service] Error loading plans from database:', error);
      
      // Fallback to JSON files if database is empty or fails
      console.log('[Insurance Data Service] Attempting fallback to JSON files...');
      return this.loadPlansFromFiles();
    }
  }
  
  /**
   * Load all insurance plans from JSON files (fallback)
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
    
    // Load fresh data from database
    console.log('[Insurance Data Service] Cache expired or empty, loading fresh data from database');
    this.plansCache = await this.loadPlansFromDatabase();
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
    const categories = Array.from(new Set(allPlans.map(plan => plan.category)));
    
    console.log(`[Insurance Data Service] Available categories: ${categories.join(', ')}`);
    return categories;
  }

  async getPlansByProvider(provider: string): Promise<MockInsurancePlan[]> {
    const allPlans = await this.getAllPlans();
    return allPlans.filter(plan => plan.provider.toLowerCase() === provider.toLowerCase());
  }

  async getTopRatedPlans(limit: number = 5): Promise<MockInsurancePlan[]> {
    const allPlans = await this.getAllPlans();
    return allPlans.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit);
  }

  async getMostEconomicalPlans(category?: string): Promise<MockInsurancePlan[]> {
    let plans = await this.getAllPlans();
    if (category) {
      plans = plans.filter(plan => plan.category === category);
    }
    return plans.sort((a, b) => a.basePrice - b.basePrice).slice(0, 5);
  }

  async getPremiumPlans(category?: string): Promise<MockInsurancePlan[]> {
    let plans = await this.getAllPlans();
    if (category) {
      plans = plans.filter(plan => plan.category === category);
    }
    return plans.sort((a, b) => b.basePrice - a.basePrice).slice(0, 5);
  }

  async getStatistics(): Promise<any> {
    const plans = await this.getAllPlans();
    const totalPlans = plans.length;
    const categories = Array.from(new Set(plans.map(p => p.category)));
    const providers = Array.from(new Set(plans.map(p => p.provider)));
    return { totalPlans, categories, providers };
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