// Insurance plan type definitions
export interface InsurancePlan {
  id: number;
  name: string;
  provider: string;
  logo: any; // For React Native image require
  basePrice: number;
  medicalCoverage: number;
  tripCancellation: string;
  baggageProtection: number;
  emergencyEvacuation?: number;
  adventureActivities: boolean;
  rentalCarCoverage?: number;
  features: string[];
  restrictions: string[];
  rating?: number;
  reviews?: number;
  country: string;
  description: string;
  isSelected?: boolean; // For comparison functionality
}

// Trip information for insurance calculation
export interface TripInfo {
  origin: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  includeAdventure?: boolean;
  travelerAge?: number;
}

// Insurance plan filter criteria
export interface FilterCriteria {
  minMedicalCoverage?: number;
  maxPrice?: number;
  providers?: string[];
  includeAdventure?: boolean;
  destination?: string;
}

// Price calculation result
export interface PriceCalculation {
  basePricePerDay: number;
  numberOfDays: number;
  numberOfTravelers: number;
  adventureSurcharge: number;
  totalPrice: number;
}