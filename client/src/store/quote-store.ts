import { create } from 'zustand';

// Travel quote data types
export interface TravelQuoteData {
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  activities?: string[];
  coverage: 'basic' | 'standard' | 'premium';
}

// Auto quote data types
export interface AutoQuoteData {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleValue: number;
  primaryDriver: {
    age: number;
    drivingExperience: number;
    accidentHistory: 'none' | 'minor' | 'one' | 'multiple';
  };
  coverageType: 'liability' | 'collision' | 'comprehensive';
}

// Pet quote data types
export interface PetQuoteData {
  petType: 'dog' | 'cat' | 'bird' | 'other';
  breed: string;
  age: number;
  medicalHistory?: string[];
  coverageLevel: 'basic' | 'standard' | 'premium';
}

// Health quote data types
export interface HealthQuoteData {
  age: number;
  gender: string;
  smoker: boolean;
  preExistingConditions?: string[];
  coverageNeeds: string[];
}

// Store interface
interface QuoteStore {
  // Travel quotes
  travelQuote: TravelQuoteData | null;
  submittedTravelQuote: TravelQuoteData | null;
  showTravelQuoteSummary: boolean;
  updateTravelQuote: (data: Partial<TravelQuoteData>) => void;
  submitTravelQuote: () => void;
  resetTravelQuote: () => void;
  
  // Auto quotes
  autoQuote: AutoQuoteData | null;
  submittedAutoQuote: AutoQuoteData | null;
  showAutoQuoteSummary: boolean;
  updateAutoQuote: (data: Partial<AutoQuoteData>) => void;
  submitAutoQuote: () => void;
  resetAutoQuote: () => void;
  
  // Pet quotes
  petQuote: PetQuoteData | null;
  submittedPetQuote: PetQuoteData | null;
  showPetQuoteSummary: boolean;
  updatePetQuote: (data: Partial<PetQuoteData>) => void;
  submitPetQuote: () => void;
  resetPetQuote: () => void;
  
  // Health quotes
  healthQuote: HealthQuoteData | null;
  submittedHealthQuote: HealthQuoteData | null;
  showHealthQuoteSummary: boolean;
  updateHealthQuote: (data: Partial<HealthQuoteData>) => void;
  submitHealthQuote: () => void;
  resetHealthQuote: () => void;
}

export const useQuoteStore = create<QuoteStore>((set) => ({
  // Travel quotes
  travelQuote: null,
  submittedTravelQuote: null,
  showTravelQuoteSummary: false,
  updateTravelQuote: (data) => set((state) => ({ 
    travelQuote: { 
      ...state.travelQuote, 
      ...data 
    } 
  })),
  submitTravelQuote: () => set((state) => ({ 
    submittedTravelQuote: state.travelQuote,
    showTravelQuoteSummary: true
  })),
  resetTravelQuote: () => set({ 
    travelQuote: null,
    submittedTravelQuote: null,
    showTravelQuoteSummary: false
  }),
  
  // Auto quotes
  autoQuote: null,
  submittedAutoQuote: null,
  showAutoQuoteSummary: false,
  updateAutoQuote: (data) => set((state) => ({ 
    autoQuote: { 
      ...state.autoQuote, 
      ...data 
    } 
  })),
  submitAutoQuote: () => set((state) => ({ 
    submittedAutoQuote: state.autoQuote,
    showAutoQuoteSummary: true
  })),
  resetAutoQuote: () => set({ 
    autoQuote: null,
    submittedAutoQuote: null,
    showAutoQuoteSummary: false
  }),
  
  // Pet quotes
  petQuote: null,
  submittedPetQuote: null,
  showPetQuoteSummary: false,
  updatePetQuote: (data) => set((state) => ({ 
    petQuote: { 
      ...state.petQuote, 
      ...data 
    } 
  })),
  submitPetQuote: () => set((state) => ({ 
    submittedPetQuote: state.petQuote,
    showPetQuoteSummary: true
  })),
  resetPetQuote: () => set({ 
    petQuote: null,
    submittedPetQuote: null,
    showPetQuoteSummary: false
  }),
  
  // Health quotes
  healthQuote: null,
  submittedHealthQuote: null,
  showHealthQuoteSummary: false,
  updateHealthQuote: (data) => set((state) => ({ 
    healthQuote: { 
      ...state.healthQuote, 
      ...data 
    } 
  })),
  submitHealthQuote: () => set((state) => ({ 
    submittedHealthQuote: state.healthQuote,
    showHealthQuoteSummary: true
  })),
  resetHealthQuote: () => set({ 
    healthQuote: null,
    submittedHealthQuote: null,
    showHealthQuoteSummary: false
  }),
}));