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

// Define the structure for the entire quote store
interface QuoteStore {
  travelQuote: TravelQuote | null;
  autoQuote: AutoQuote | null;
  healthQuote: HealthQuote | null;
  petQuote: PetQuote | null;
  
  // Actions
  setTravelQuote: (quote: TravelQuote) => void;
  setAutoQuote: (quote: AutoQuote) => void;
  setHealthQuote: (quote: HealthQuote) => void;
  setPetQuote: (quote: PetQuote) => void;
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
      
      // Actions
      setTravelQuote: (quote: TravelQuote) => set({ travelQuote: quote }),
      setAutoQuote: (quote: AutoQuote) => set({ autoQuote: quote }),
      setHealthQuote: (quote: HealthQuote) => set({ healthQuote: quote }),
      setPetQuote: (quote: PetQuote) => set({ petQuote: quote }),
      resetQuotes: () => set({ 
        travelQuote: null,
        autoQuote: null,
        healthQuote: null,
        petQuote: null 
      }),
    }),
    {
      name: 'briki-insurance-quotes',
    }
  )
);