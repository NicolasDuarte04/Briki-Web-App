import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InsurancePlan } from '@/types/insurance';

interface CompareState {
  plansToCompare: InsurancePlan[];
  addPlan: (plan: InsurancePlan) => boolean;
  removePlan: (planId: number | string) => void;
  isPlanSelected: (planId: number | string) => boolean;
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