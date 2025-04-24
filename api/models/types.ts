// Insurance Plan type
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
  createdAt?: Date;
}

// User interaction with plans
export interface PlanInteraction {
  id: number;
  planId: number;
  userId?: string;
  deviceId: string;
  interactionType: InteractionType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Types of interactions
export enum InteractionType {
  VIEW = 'view',
  SELECTION = 'selection',
  COMPARISON = 'comparison',
  CHECKOUT_START = 'checkout_start',
  CHECKOUT_COMPLETE = 'checkout_complete',
}

// Search/Filter criteria
export interface PlanFilterCriteria {
  origin?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
  age?: number;
  travelersCount?: number;
  minMedicalCoverage?: number;
  includeAdventureActivities?: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}