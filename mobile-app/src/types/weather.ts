export enum RiskLevel {
  LOW = 'Bajo',
  MODERATE = 'Moderado',
  HIGH = 'Alto',
  EXTREME = 'Extremo'
}

export interface WeatherRiskFactor {
  type: string;
  severity: RiskLevel;
  description: string;
}

export interface MonthlyWeatherData {
  safetyScore: number;
  weatherRisks: WeatherRiskFactor[];
}

export interface DestinationRisk {
  country: string;
  city: string;
  safetyScore: number;
  weatherRisks: WeatherRiskFactor[];
  insuranceRecommendation: string;
  seasons?: {
    [month: number]: MonthlyWeatherData;
  };
}