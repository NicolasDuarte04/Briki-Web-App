import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for different insurance category quote forms
export interface TravelQuoteData {
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  activities: string[];
  coverage: string;
}

export interface AutoQuoteData {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleValue: number;
  primaryDriver: {
    age: number;
    drivingExperience: number;
    accidentHistory: string;
  };
  coverageType: string;
}

export interface PetQuoteData {
  petType: string;
  breed: string;
  age: number;
  medicalHistory: string[];
  coverageLevel: string;
}

export interface HealthQuoteData {
  age: number;
  gender: string;
  smoker: boolean;
  preExistingConditions: string[];
  coverageNeeds: string[];
}

interface QuoteStore {
  // Current active quote data for each category
  travelQuote: TravelQuoteData | null;
  autoQuote: AutoQuoteData | null;
  petQuote: PetQuoteData | null;
  healthQuote: HealthQuoteData | null;
  
  // Last submitted quote data (for filtering plans)
  submittedTravelQuote: TravelQuoteData | null;
  submittedAutoQuote: AutoQuoteData | null;
  submittedPetQuote: PetQuoteData | null;
  submittedHealthQuote: HealthQuoteData | null;
  
  // Flag to show quote summary on category pages
  showTravelQuoteSummary: boolean;
  showAutoQuoteSummary: boolean;
  showPetQuoteSummary: boolean;
  showHealthQuoteSummary: boolean;
  
  // Actions
  setTravelQuote: (data: TravelQuoteData) => void;
  setAutoQuote: (data: AutoQuoteData) => void;
  setPetQuote: (data: PetQuoteData) => void;
  setHealthQuote: (data: HealthQuoteData) => void;
  
  submitTravelQuote: () => void;
  submitAutoQuote: () => void;
  submitPetQuote: () => void;
  submitHealthQuote: () => void;
  
  resetTravelQuote: () => void;
  resetAutoQuote: () => void;
  resetPetQuote: () => void;
  resetHealthQuote: () => void;
  
  clearAllQuotes: () => void;
}

// Default empty quote data
const emptyTravelQuote: TravelQuoteData = {
  destination: '',
  departureDate: '',
  returnDate: '',
  travelers: 1,
  activities: [],
  coverage: 'standard'
};

const emptyAutoQuote: AutoQuoteData = {
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: new Date().getFullYear(),
  vehicleValue: 0,
  primaryDriver: {
    age: 30,
    drivingExperience: 5,
    accidentHistory: 'none'
  },
  coverageType: 'comprehensive'
};

const emptyPetQuote: PetQuoteData = {
  petType: '',
  breed: '',
  age: 0,
  medicalHistory: [],
  coverageLevel: 'standard'
};

const emptyHealthQuote: HealthQuoteData = {
  age: 30,
  gender: '',
  smoker: false,
  preExistingConditions: [],
  coverageNeeds: []
};

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      // Initial state
      travelQuote: null,
      autoQuote: null,
      petQuote: null,
      healthQuote: null,
      
      submittedTravelQuote: null,
      submittedAutoQuote: null,
      submittedPetQuote: null,
      submittedHealthQuote: null,
      
      showTravelQuoteSummary: false,
      showAutoQuoteSummary: false,
      showPetQuoteSummary: false,
      showHealthQuoteSummary: false,
      
      // Actions
      setTravelQuote: (data) => set({ travelQuote: data }),
      setAutoQuote: (data) => set({ autoQuote: data }),
      setPetQuote: (data) => set({ petQuote: data }),
      setHealthQuote: (data) => set({ healthQuote: data }),
      
      submitTravelQuote: () => set((state) => ({ 
        submittedTravelQuote: state.travelQuote, 
        showTravelQuoteSummary: true 
      })),
      submitAutoQuote: () => set((state) => ({ 
        submittedAutoQuote: state.autoQuote, 
        showAutoQuoteSummary: true 
      })),
      submitPetQuote: () => set((state) => ({ 
        submittedPetQuote: state.petQuote, 
        showPetQuoteSummary: true 
      })),
      submitHealthQuote: () => set((state) => ({ 
        submittedHealthQuote: state.healthQuote, 
        showHealthQuoteSummary: true 
      })),
      
      resetTravelQuote: () => set({ 
        travelQuote: null, 
        submittedTravelQuote: null, 
        showTravelQuoteSummary: false 
      }),
      resetAutoQuote: () => set({ 
        autoQuote: null, 
        submittedAutoQuote: null, 
        showAutoQuoteSummary: false 
      }),
      resetPetQuote: () => set({ 
        petQuote: null, 
        submittedPetQuote: null, 
        showPetQuoteSummary: false 
      }),
      resetHealthQuote: () => set({ 
        healthQuote: null, 
        submittedHealthQuote: null, 
        showHealthQuoteSummary: false 
      }),
      
      clearAllQuotes: () => set({
        travelQuote: null,
        autoQuote: null,
        petQuote: null,
        healthQuote: null,
        submittedTravelQuote: null,
        submittedAutoQuote: null,
        submittedPetQuote: null,
        submittedHealthQuote: null,
        showTravelQuoteSummary: false,
        showAutoQuoteSummary: false,
        showPetQuoteSummary: false,
        showHealthQuoteSummary: false
      })
    }),
    {
      name: 'briki-quote-storage',
    }
  )
);