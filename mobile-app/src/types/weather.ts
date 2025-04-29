/**
 * Types related to the Weather Risk Screen
 */

// Risk level enum for categorizing severity
export enum RiskLevel {
  NONE = 'none',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  EXTREME = 'extreme'
}

// Interface for individual weather risk factors
export interface WeatherRiskFactor {
  type: string;  // e.g., hurricane, flood, extreme_heat, etc
  severity: RiskLevel;
  description: string;
}

// Season data with specific risks for a given month
export interface SeasonData {
  safetyScore: number; // 0-100 scale
  weatherRisks: WeatherRiskFactor[];
}

// Interface for destination with associated risks
export interface DestinationRisk {
  country: string;
  city: string;
  safetyScore: number; // 0-100 scale
  weatherRisks: WeatherRiskFactor[];
  insuranceRecommendation: string;
  seasons?: {
    [month: number]: SeasonData; // Month number (1-12) to season data
  };
}