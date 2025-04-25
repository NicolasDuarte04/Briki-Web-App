export enum RiskLevel {
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  EXTREME = 'extreme'
}

export interface WeatherRiskFactor {
  type: string;
  severity: RiskLevel;
  description: string;
}

export interface DestinationRisk {
  country: string;
  city: string;
  safetyScore: number;
  weatherRisks: WeatherRiskFactor[];
  insuranceRecommendation: string;
  seasons: {
    [key: number]: { 
      safetyScore: number;
      weatherRisks: WeatherRiskFactor[];
    }
  };
}