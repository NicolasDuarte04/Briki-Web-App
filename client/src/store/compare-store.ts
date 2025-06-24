import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InsurancePlan as Plan } from '@/components/briki-ai-assistant/PlanCard';

interface CompareState {
  plansToCompare: Plan[];
  addPlan: (plan: Plan) => boolean;
  removePlan: (planId: number) => void;
  isPlanSelected: (planId: number) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      plansToCompare: [],

      addPlan: (plan) => {
        const { plansToCompare } = get();
        if (plansToCompare.length >= 3) {
          // Limit reached
          return false;
        }
        if (!plansToCompare.some(p => p.id === plan.id)) {
          set({ plansToCompare: [...plansToCompare, plan] });
        }
        return true;
      },

      removePlan: (planId) => {
        set(state => ({
          plansToCompare: state.plansToCompare.filter(p => p.id !== planId)
        }));
      },

      isPlanSelected: (planId) => {
        return get().plansToCompare.some(p => p.id === planId);
      },
      
      clearCompare: () => {
        set({ plansToCompare: [] });
      }
    }),
    {
      name: 'briki-compare-storage',
      partialize: (state) => ({ 
        plansToCompare: state.plansToCompare
      }),
    }
  )
);