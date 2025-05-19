import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define insurance categories
export type InsuranceCategory = "travel" | "auto" | "pet" | "health";

// Travel quote types
export interface TravelQuote {
  destination: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  activities: string[];
  coverage: "basic" | "standard" | "premium";
}

// Auto quote types
export interface PrimaryDriver {
  age: number;
  drivingExperience: number;
  accidentHistory: "none" | "minor" | "one" | "multiple";
}

export interface AutoQuote {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  vehicleValue: number;
  primaryDriver: PrimaryDriver;
  coverageType: "liability" | "collision" | "comprehensive";
}

// Pet quote types
export interface PetQuote {
  petType: "dog" | "cat" | "bird" | "other";
  breed: string;
  age: number;
  medicalHistory: string[];
  coverageLevel: "basic" | "standard" | "premium";
}

// Health quote types
export interface HealthQuote {
  age: number;
  gender: string;
  smoker: boolean;
  preExistingConditions: string[];
  coverageNeeds: string[];
}

// Define store state
export interface QuoteStore {
  // Quote data by category
  travelQuote: TravelQuote | null;
  autoQuote: AutoQuote | null;
  petQuote: PetQuote | null;
  healthQuote: HealthQuote | null;
  
  // Status flags
  activeQuotes: Set<InsuranceCategory>;
  submittedQuotes: Set<InsuranceCategory>;
  
  // Actions
  updateTravelQuote: (quote: Partial<TravelQuote>) => void;
  updateAutoQuote: (quote: Partial<AutoQuote>) => void;
  updatePetQuote: (quote: Partial<PetQuote>) => void;
  updateHealthQuote: (quote: Partial<HealthQuote>) => void;
  
  submitTravelQuote: () => void;
  submitAutoQuote: () => void;
  submitPetQuote: () => void;
  submitHealthQuote: () => void;
  
  clearQuote: (category: InsuranceCategory) => void;
  clearAllQuotes: () => void;
}

// Create store with persistence
export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      // Initial data
      travelQuote: null,
      autoQuote: null,
      petQuote: null,
      healthQuote: null,
      
      activeQuotes: new Set<InsuranceCategory>(),
      submittedQuotes: new Set<InsuranceCategory>(),
      
      // Update actions
      updateTravelQuote: (quote) => 
        set((state) => {
          const updatedQuote = { ...state.travelQuote, ...quote };
          const newActiveQuotes = new Set(state.activeQuotes);
          newActiveQuotes.add("travel");
          
          return { 
            travelQuote: updatedQuote as TravelQuote,
            activeQuotes: newActiveQuotes
          };
        }),
      
      updateAutoQuote: (quote) => 
        set((state) => {
          const updatedQuote = { ...state.autoQuote, ...quote };
          const newActiveQuotes = new Set(state.activeQuotes);
          newActiveQuotes.add("auto");
          
          return { 
            autoQuote: updatedQuote as AutoQuote,
            activeQuotes: newActiveQuotes
          };
        }),
      
      updatePetQuote: (quote) => 
        set((state) => {
          const updatedQuote = { ...state.petQuote, ...quote };
          const newActiveQuotes = new Set(state.activeQuotes);
          newActiveQuotes.add("pet");
          
          return { 
            petQuote: updatedQuote as PetQuote,
            activeQuotes: newActiveQuotes
          };
        }),
      
      updateHealthQuote: (quote) => 
        set((state) => {
          const updatedQuote = { ...state.healthQuote, ...quote };
          const newActiveQuotes = new Set(state.activeQuotes);
          newActiveQuotes.add("health");
          
          return { 
            healthQuote: updatedQuote as HealthQuote,
            activeQuotes: newActiveQuotes
          };
        }),
      
      // Submit actions
      submitTravelQuote: () => 
        set((state) => {
          const newSubmittedQuotes = new Set(state.submittedQuotes);
          newSubmittedQuotes.add("travel");
          return { submittedQuotes: newSubmittedQuotes };
        }),
      
      submitAutoQuote: () => 
        set((state) => {
          const newSubmittedQuotes = new Set(state.submittedQuotes);
          newSubmittedQuotes.add("auto");
          return { submittedQuotes: newSubmittedQuotes };
        }),
      
      submitPetQuote: () => 
        set((state) => {
          const newSubmittedQuotes = new Set(state.submittedQuotes);
          newSubmittedQuotes.add("pet");
          return { submittedQuotes: newSubmittedQuotes };
        }),
      
      submitHealthQuote: () => 
        set((state) => {
          const newSubmittedQuotes = new Set(state.submittedQuotes);
          newSubmittedQuotes.add("health");
          return { submittedQuotes: newSubmittedQuotes };
        }),
      
      // Clear actions
      clearQuote: (category) => 
        set((state) => {
          const newActiveQuotes = new Set(state.activeQuotes);
          const newSubmittedQuotes = new Set(state.submittedQuotes);
          
          newActiveQuotes.delete(category);
          newSubmittedQuotes.delete(category);
          
          const updates: any = {
            activeQuotes: newActiveQuotes,
            submittedQuotes: newSubmittedQuotes
          };
          
          // Clear the specific category quote
          updates[`${category}Quote`] = null;
          
          return updates;
        }),
      
      clearAllQuotes: () => 
        set(() => ({
          travelQuote: null,
          autoQuote: null,
          petQuote: null,
          healthQuote: null,
          activeQuotes: new Set<InsuranceCategory>(),
          submittedQuotes: new Set<InsuranceCategory>()
        })),
    }),
    {
      name: "briki-insurance-quotes", // Storage name
    }
  )
);