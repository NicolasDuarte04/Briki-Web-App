import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SelectedPlan {
  id: number | string;
  category: string;
}

interface CompareState {
  selectedPlans: SelectedPlan[];
  addPlan: (plan: SelectedPlan) => void;
  removePlan: (id: number | string) => void;
  clearPlans: () => void;
  isPlanSelected: (id: number | string) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      selectedPlans: [],
      
      addPlan: (plan) => {
        const { selectedPlans } = get();
        // Check if we're already at the limit of 4 plans
        if (selectedPlans.length >= 4) {
          console.warn("Maximum of 4 plans can be compared at once");
          return;
        }
        // Check if this plan is already selected
        if (selectedPlans.some(p => p.id === plan.id)) {
          return;
        }
        set({ selectedPlans: [...selectedPlans, plan] });
      },
      
      removePlan: (id) => set((state) => ({
        selectedPlans: state.selectedPlans.filter(p => p.id !== id)
      })),
      
      clearPlans: () => set({ selectedPlans: [] }),
      
      isPlanSelected: (id) => {
        return get().selectedPlans.some(plan => plan.id === id);
      }
    }),
    {
      name: 'briki-compare-storage',
      // Optional: You can add partialize to only persist specific parts of the state
      partialize: (state) => ({ selectedPlans: state.selectedPlans }),
    }
  )
);