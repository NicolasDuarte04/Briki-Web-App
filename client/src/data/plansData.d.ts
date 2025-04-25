// Type definitions for plansData.js
declare module '../data/plansData' {
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
    baggageProtection?: number | string;
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
    [key: string]: any; // Allow any other properties
  }

  export function formatPrice(price: number): string;
  export function formatCoverage(coverage: any): string;
  export function getBestValuePlan(): InsurancePlan;
  export function getMostEconomicalPlan(): InsurancePlan;
  export function getFilteredPlans(criteria?: Record<string, any>): InsurancePlan[];

  const insurancePlans: InsurancePlan[];
  export default insurancePlans;
}