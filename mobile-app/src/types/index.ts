export interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
}

export interface Trip {
  id: number;
  userId: number;
  destination: string;
  countryOfOrigin: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  createdAt?: string;
}

export interface InsurancePlan {
  id: number;
  name: string;
  provider: string;
  basePrice: number;
  medicalCoverage: number;
  tripCancellation: string;
  baggageProtection: number;
  emergencyEvacuation?: number;
  adventureActivities: boolean;
  rentalCarCoverage?: number;
  rating?: string;
  reviews?: number;
  country: string;
}

export interface Order {
  id: number;
  userId: number;
  planId: number;
  tripId: number;
  status: string;
  totalAmount: number;
  paymentIntentId?: string;
  createdAt?: string;
}

export interface WeatherRiskFactor {
  id: string;
  name: string;
  risk: 'low' | 'medium' | 'high';
  description: string;
  icon: string;
  value?: number;
  unit?: string;
}

export type RiskLevel = 'low' | 'medium' | 'high';