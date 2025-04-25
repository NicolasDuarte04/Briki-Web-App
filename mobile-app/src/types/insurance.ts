export interface InsurancePlan {
  id: number;
  name: string;
  provider: string;
  basePrice: number;
  medicalCoverage: number;
  tripCancellation: string | Record<string, string>;
  tripInterruption?: string;
  tripDelay?: string;
  missedConnection?: number;
  baggageProtection: number;
  baggageDelay?: number | string;
  emergencyEvacuation?: number;
  repatriation?: string | number;
  accidentalDeath?: number;
  accidentalDeathAirOnly?: number;
  adventureActivities: boolean;
  covidCoverage: boolean;
  rating: string;
  reviews: number;
  country: string;
  rentalCarCoverage?: number;
  servicesIncluded?: string[];
  exclusions?: string[];
  extras?: string[];
  extraFeatures?: string[];
  dentalEmergency?: string | number;
  dentalExpenses?: number;
  preExistingConditions?: string;
  earlyReturn?: string[] | boolean;
  earlyReturnTransport?: string;
  baggageAndDocuments?: {
    baggageLoss?: string;
    baggageDelay?: string;
    stolenDocuments?: string;
  };
  personalAccident?: {
    death: string | number;
    disability: string;
  };
  legalAssistance?: string;
  legalDefense?: string;
}

export interface Trip {
  id?: number;
  userId: number;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  primaryAge: number;
  hasMedicalConditions: boolean;
  priorities: string[];
  createdAt?: string;
}

export interface Order {
  id?: number;
  userId: number;
  planId: number;
  tripId: number;
  amount: number;
  status: string;
  paymentIntentId?: string;
  createdAt?: string;
}