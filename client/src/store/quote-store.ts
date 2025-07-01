import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TravelQuote, INSURANCE_CATEGORIES, InsuranceCategory } from '../../../shared/schema';
import { createId } from '../lib/utils';

// Initialize default values for new travel quotes
const createDefaultTravelQuote = (): TravelQuote => ({
  id: createId('travel'),
  destination: '',
  departureDate: undefined as unknown as Date,
  returnDate: undefined as unknown as Date,
  travelers: 1,
  activities: [],
  includesMedical: false,
  includesCancellation: false,
  includesValuables: false,
  coverageLevel: 'standard',
  category: INSURANCE_CATEGORIES.TRAVEL
});

interface QuoteState {
  // Current quote being worked on
  travelQuote: TravelQuote;
  
  // Submitted quotes history
  submittedQuotes: TravelQuote[];
  
  // Actions
  updateTravelQuote: (updates: Partial<TravelQuote>) => void;
  submitTravelQuote: () => void;
  resetTravelQuote: () => void;
  clearSubmittedQuotes: () => void;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set) => ({
      // Initial state
      travelQuote: createDefaultTravelQuote(),
      submittedQuotes: [],
      
      // Update the current travel quote
      updateTravelQuote: (updates: Partial<TravelQuote>) => 
        set((state) => ({
          travelQuote: { ...state.travelQuote, ...updates }
        })),
      
      // Submit the current travel quote
      submitTravelQuote: () => 
        set((state) => ({
          submittedQuotes: [...state.submittedQuotes, {
            ...state.travelQuote,
            createdAt: new Date(),
            updatedAt: new Date(),
          }],
          travelQuote: createDefaultTravelQuote()
        })),
      
      // Reset current travel quote to defaults
      resetTravelQuote: () => 
        set(() => ({
          travelQuote: createDefaultTravelQuote()
        })),
      
      // Clear all submitted quotes
      clearSubmittedQuotes: () => 
        set(() => ({
          submittedQuotes: []
        })),
    }),
    {
      name: 'briki-quotes-storage',
      partialize: (state) => ({ 
        travelQuote: state.travelQuote,
        submittedQuotes: state.submittedQuotes,
      }),
    }
  )
);

// Function to get quotes by category
export const getQuotesByCategory = (quotes: TravelQuote[], category: InsuranceCategory): TravelQuote[] => {
  return quotes.filter(quote => quote.category === category);
};

// Function to get the most recent quote
export const getMostRecentQuote = (quotes: TravelQuote[]): TravelQuote | undefined => {
  if (quotes.length === 0) return undefined;
  
  return quotes.reduce((prev, current) => {
    const prevDate = prev.createdAt || new Date(0);
    const currentDate = current.createdAt || new Date(0);
    return currentDate > prevDate ? current : prev;
  });
};