/**
 * Application constants for Briki SaaS platform
 */

// Insurance categories and their display names
export const INSURANCE_CATEGORIES = {
  TRAVEL: 'travel',
  AUTO: 'auto',
  PET: 'pet',
  HEALTH: 'health',
} as const;

export type InsuranceCategory = typeof INSURANCE_CATEGORIES[keyof typeof INSURANCE_CATEGORIES];

// Plan status options
export const PLAN_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type PlanStatus = typeof PLAN_STATUS[keyof typeof PLAN_STATUS];

// Plan visibility options
export const PLAN_VISIBILITY = {
  PRIVATE: 'private',
  PUBLIC: 'public',
} as const;

export type PlanVisibility = typeof PLAN_VISIBILITY[keyof typeof PLAN_VISIBILITY];

// Field labels for each category's specific fields
export const planFieldLabels: Record<string, Record<string, string>> = {
  // Travel insurance specific fields
  travel: {
    coverageDuration: 'Coverage Duration',
    destinationCoverage: 'Destination Coverage',
    medicalCoverage: 'Medical Coverage',
    cancellationCoverage: 'Cancellation Coverage',
    baggageCoverage: 'Baggage Coverage',
    emergencyEvacuation: 'Emergency Evacuation',
    adventureActivities: 'Adventure Activities Coverage',
    preExistingConditions: 'Pre-existing Conditions',
    tripDelay: 'Trip Delay Coverage',
    tripInterruption: 'Trip Interruption Coverage',
  },
  
  // Auto insurance specific fields
  auto: {
    liabilityCoverage: 'Liability Coverage',
    collisionCoverage: 'Collision Coverage',
    comprehensiveCoverage: 'Comprehensive Coverage',
    uninsuredMotoristCoverage: 'Uninsured Motorist Coverage',
    personalInjuryProtection: 'Personal Injury Protection',
    deductible: 'Deductible',
    roadside: 'Roadside Assistance',
    rentalCar: 'Rental Car Coverage',
    vehicleReplacementCoverage: 'Vehicle Replacement',
    gap: 'Gap Insurance',
  },
  
  // Pet insurance specific fields
  pet: {
    accidentCoverage: 'Accident Coverage',
    illnessCoverage: 'Illness Coverage',
    wellnessCoverage: 'Wellness Coverage',
    dentalCoverage: 'Dental Coverage',
    prescriptionCoverage: 'Prescription Coverage',
    annualLimit: 'Annual Limit',
    deductible: 'Deductible',
    reimbursementRate: 'Reimbursement Rate',
    waitingPeriod: 'Waiting Period',
    ageLimits: 'Age Limits',
  },
  
  // Health insurance specific fields
  health: {
    annualDeductible: 'Annual Deductible',
    outOfPocketMax: 'Out of Pocket Maximum',
    coinsurance: 'Coinsurance',
    copay: 'Co-pay',
    primaryCareVisit: 'Primary Care Visit',
    specialistVisit: 'Specialist Visit',
    emergencyRoom: 'Emergency Room',
    hospitalCoverage: 'Hospital Coverage',
    prescriptionCoverage: 'Prescription Coverage',
    dentalVision: 'Dental & Vision Coverage',
  },
};