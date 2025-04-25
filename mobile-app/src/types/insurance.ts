export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Trip {
  id: number;
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
  covidCoverage?: boolean;
  rating: string;
  reviews: number;
  country: string;
  createdAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  planId: number;
  tripId: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  policyNumber?: string;
  createdAt?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}