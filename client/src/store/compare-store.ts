import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  InsuranceCategory, 
  BasePlanFields,
  TravelPlanFields,
  AutoPlanFields, 
  PetPlanFields,
  HealthPlanFields
} from '@shared/schema';

// Define comprehensive plan type for all categories
export type InsurancePlan = BasePlanFields & {
  categoryDetails?: {
    travel?: TravelPlanFields;
    auto?: AutoPlanFields;
    pet?: PetPlanFields;
    health?: HealthPlanFields;
  };
};

// Define the store state type with enhanced functionality
interface CompareState {
  selectedPlans: InsurancePlan[];
  maxPlans: number;
  maxPlansPerCategory: number;
  addPlan: (plan: InsurancePlan) => void;
  removePlan: (planId: string) => void;
  clearPlans: () => void;
  clearCategory: (category: InsuranceCategory) => void;
  isPlanSelected: (planId: string) => boolean;
  canAddMorePlans: () => boolean;
  canAddPlanToCategory: (category: InsuranceCategory) => boolean;
  getSelectedPlansByCategory: (category: InsuranceCategory) => InsurancePlan[];
  getSelectedCategories: () => InsuranceCategory[];
  getComparisonReady: () => boolean;
}

// Create the Zustand store with localStorage persistence
export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedPlans: [],
      maxPlans: 8, // Maximum number of plans that can be compared at once
      maxPlansPerCategory: 4, // Maximum plans per single category
      
      // Add a plan to comparison
      addPlan: (plan) => {
        const { selectedPlans, maxPlans, maxPlansPerCategory } = get();
        
        // Check if we've reached the maximum number of plans
        if (selectedPlans.length >= maxPlans) {
          console.warn(`Maximum of ${maxPlans} plans can be compared at once`);
          return;
        }
        
        // Check if we've reached the maximum number of plans for this category
        const plansInCategory = selectedPlans.filter(p => p.category === plan.category);
        if (plansInCategory.length >= maxPlansPerCategory) {
          console.warn(`Maximum of ${maxPlansPerCategory} plans per category can be compared at once`);
          return;
        }
        
        // Check if the plan is already selected
        if (selectedPlans.some(p => p.id === plan.id)) {
          console.warn(`Plan ${plan.id} is already in comparison`);
          return;
        }
        
        set({ selectedPlans: [...selectedPlans, plan] });
      },
      
      // Remove a plan from comparison
      removePlan: (planId) => {
        const { selectedPlans } = get();
        set({ selectedPlans: selectedPlans.filter(p => p.id !== planId) });
      },
      
      // Clear all selected plans
      clearPlans: () => {
        set({ selectedPlans: [] });
      },
      
      // Clear all plans from a specific category
      clearCategory: (category) => {
        const { selectedPlans } = get();
        set({ selectedPlans: selectedPlans.filter(p => p.category !== category) });
      },
      
      // Check if a plan is already selected
      isPlanSelected: (planId) => {
        return get().selectedPlans.some(p => p.id === planId);
      },
      
      // Check if more plans can be added
      canAddMorePlans: () => {
        const { selectedPlans, maxPlans } = get();
        return selectedPlans.length < maxPlans;
      },
      
      // Check if more plans can be added to a specific category
      canAddPlanToCategory: (category) => {
        const { selectedPlans, maxPlansPerCategory } = get();
        const plansInCategory = selectedPlans.filter(p => p.category === category);
        return plansInCategory.length < maxPlansPerCategory;
      },
      
      // Get selected plans filtered by category
      getSelectedPlansByCategory: (category) => {
        return get().selectedPlans.filter(p => p.category === category);
      },
      
      // Get unique categories that have selected plans
      getSelectedCategories: () => {
        const categoriesSet = new Set<InsuranceCategory>();
        get().selectedPlans.forEach(p => categoriesSet.add(p.category));
        return Array.from(categoriesSet);
      },
      
      // Check if we have at least two plans selected for comparison
      getComparisonReady: () => {
        return get().selectedPlans.length >= 2;
      }
    }),
    {
      name: 'briki-compare-plans',
      // Store the full state in localStorage
      partialize: (state) => ({ 
        selectedPlans: state.selectedPlans
      }),
      // Version information for migrations if schema changes
      version: 1,
    }
  )
);