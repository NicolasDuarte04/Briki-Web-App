import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Simple type for insurance plans
export interface InsurancePlan {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: number;
  provider?: string;
  features?: string[];
  coverage?: Record<string, any>;
}

// Define the store state type
interface CompareState {
  selectedPlans: InsurancePlan[];
  maxPlans: number;
  addPlan: (plan: InsurancePlan) => void;
  removePlan: (planId: string) => void;
  clearPlans: () => void;
  isPlanSelected: (planId: string) => boolean;
  canAddMorePlans: () => boolean;
}

// Create the Zustand store with localStorage persistence
export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedPlans: [],
      maxPlans: 4, // Maximum number of plans that can be compared at once

      // Add a plan to comparison
      addPlan: (plan) => {
        const { selectedPlans, maxPlans } = get();
        
        // Check if we've reached the maximum number of plans
        if (selectedPlans.length >= maxPlans) {
          console.warn(`Maximum of ${maxPlans} plans can be compared at once`);
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
      
      // Check if a plan is already selected
      isPlanSelected: (planId) => {
        return get().selectedPlans.some(p => p.id === planId);
      },
      
      // Check if more plans can be added
      canAddMorePlans: () => {
        const { selectedPlans, maxPlans } = get();
        return selectedPlans.length < maxPlans;
      }
    }),
    {
      name: 'briki-compare-plans',
      // Only persist the selectedPlans array
      partialize: (state) => ({ selectedPlans: state.selectedPlans }),
    }
  )
);