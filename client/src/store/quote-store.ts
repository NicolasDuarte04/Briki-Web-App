import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the structure for travel quote data
interface TravelQuote {
  destination: string;
  departureDate: Date;
  returnDate: Date;
  travelers: number;
  travelerAge: number;
  tripCost: number;
  activities?: string[];
  medicalConditions?: boolean;
  cancellationCoverage?: boolean;
  baggageCoverage?: boolean;
  medicalCoverage?: boolean;
  adventureActivities?: boolean;
}

// Define the structure for auto quote data
interface AutoQuote {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleValue: number;
  driverAge: number;
  drivingHistory: string;
  coverage: string;
  deductible: number;
  isLeased: boolean;
  hasAntiTheft: boolean;
}

// Define the structure for health quote data
interface HealthQuote {
  age: number;
  gender: string;
  smoker: boolean;
  preExistingConditions: boolean;
  coverage: string;
  dependents: number;
  income: number;
}

// Define the structure for pet quote data
interface PetQuote {
  petType: string;
  petBreed: string;
  petAge: number;
  preExistingConditions: boolean;
  coverageLevel: string;
  annualLimit: number;
  deductible: number;
}

// Define insurance categories
export type InsuranceCategory = 'travel' | 'auto' | 'health' | 'pet';

// Define the structure for the entire quote store
interface QuoteStore {
  travelQuote: TravelQuote | null;
  autoQuote: AutoQuote | null;
  healthQuote: HealthQuote | null;
  petQuote: PetQuote | null;
  submittedQuotes: InsuranceCategory[];
  
  // Actions
  setTravelQuote: (quote: TravelQuote) => void;
  setAutoQuote: (quote: AutoQuote) => void;
  setHealthQuote: (quote: HealthQuote) => void;
  setPetQuote: (quote: PetQuote) => void;
  submitQuote: (category: InsuranceCategory) => void;
  clearQuote: (category: InsuranceCategory) => void;
  resetQuotes: () => void;
}

// Create the store with persistence
export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      travelQuote: null,
      autoQuote: null,
      healthQuote: null,
      petQuote: null,
      submittedQuotes: [],
      
      // Actions
      setTravelQuote: (quote: TravelQuote) => set({ travelQuote: quote }),
      setAutoQuote: (quote: AutoQuote) => set({ autoQuote: quote }),
      setHealthQuote: (quote: HealthQuote) => set({ healthQuote: quote }),
      setPetQuote: (quote: PetQuote) => set({ petQuote: quote }),
      
      submitQuote: (category: InsuranceCategory) => 
        set((state) => ({
          submittedQuotes: Array.from(new Set([...state.submittedQuotes, category]))
        })),
        
      clearQuote: (category: InsuranceCategory) => 
        set((state) => {
          const newState: Partial<QuoteStore> = {
            submittedQuotes: state.submittedQuotes.filter(c => c !== category)
          };
          
          // Clear the specific quote type
          switch (category) {
            case 'travel':
              newState.travelQuote = null;
              break;
            case 'auto':
              newState.autoQuote = null;
              break;
            case 'health':
              newState.healthQuote = null;
              break;
            case 'pet':
              newState.petQuote = null;
              break;
          }
          
          return newState;
        }),
        
      resetQuotes: () => set({ 
        travelQuote: null,
        autoQuote: null,
        healthQuote: null,
        petQuote: null,
        submittedQuotes: []
      }),
    }),
    {
      name: 'briki-insurance-quotes',
    }
  )
);