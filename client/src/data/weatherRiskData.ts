// Weather risk data for popular travel destinations

export type RiskLevel = 'low' | 'moderate' | 'high' | 'severe';

export interface WeatherRiskFactor {
  type: 'hurricane' | 'flood' | 'extreme_heat' | 'wildfire' | 'avalanche' | 'blizzard' | 'drought';
  severity: RiskLevel;
  description: string;
  icon: string; // Lucide icon name
}

export interface DestinationRisk {
  country: string;
  city: string;
  weatherRisks: WeatherRiskFactor[];
  safetyScore: number; // 0-100
  travelAdvisory: RiskLevel;
  insuranceRecommendation: string;
  month: number; // 1-12
}

// Sample data for popular destinations with seasonal risks
export const destinationRisks: DestinationRisk[] = [
  {
    country: 'Mexico',
    city: 'Cancún',
    weatherRisks: [
      {
        type: 'hurricane',
        severity: 'high',
        description: 'Hurricane season runs from June to November with peak activity in September and October',
        icon: 'cloud-rain',
      },
      {
        type: 'extreme_heat',
        severity: 'moderate',
        description: 'Summer temperatures regularly exceed 90°F (32°C) with high humidity',
        icon: 'thermometer-sun',
      }
    ],
    safetyScore: 65,
    travelAdvisory: 'moderate',
    insuranceRecommendation: 'Hurricane coverage is strongly recommended during season',
    month: 9
  },
  {
    country: 'Thailand',
    city: 'Bangkok',
    weatherRisks: [
      {
        type: 'flood',
        severity: 'moderate',
        description: 'Monsoon season from July to October can cause flooding in urban areas',
        icon: 'droplets',
      },
      {
        type: 'extreme_heat',
        severity: 'high',
        description: 'March to May sees extreme heat with temperatures often above 95°F (35°C)',
        icon: 'thermometer-sun',
      }
    ],
    safetyScore: 70,
    travelAdvisory: 'low',
    insuranceRecommendation: 'Trip interruption coverage recommended during monsoon season',
    month: 4
  },
  {
    country: 'USA',
    city: 'Miami',
    weatherRisks: [
      {
        type: 'hurricane',
        severity: 'high',
        description: 'Atlantic hurricane season runs from June to November',
        icon: 'cloud-rain',
      },
      {
        type: 'flood',
        severity: 'moderate',
        description: 'Low-lying areas prone to flooding during storms',
        icon: 'droplets',
      }
    ],
    safetyScore: 78,
    travelAdvisory: 'low',
    insuranceRecommendation: 'Trip cancellation insurance recommended during hurricane season',
    month: 8
  },
  {
    country: 'Colombia',
    city: 'Bogotá',
    weatherRisks: [
      {
        type: 'flood',
        severity: 'low',
        description: 'Rainy seasons April-May and October-November may cause localized flooding',
        icon: 'cloud-drizzle',
      }
    ],
    safetyScore: 65,
    travelAdvisory: 'moderate',
    insuranceRecommendation: 'Standard travel insurance with medical coverage recommended',
    month: 4
  },
  {
    country: 'Japan',
    city: 'Tokyo',
    weatherRisks: [
      {
        type: 'hurricane',
        severity: 'moderate',
        description: 'Typhoon season runs from May to October',
        icon: 'wind',
      }
    ],
    safetyScore: 85,
    travelAdvisory: 'low',
    insuranceRecommendation: 'Trip delay coverage recommended during typhoon season',
    month: 7
  },
  {
    country: 'Italy',
    city: 'Rome',
    weatherRisks: [
      {
        type: 'extreme_heat',
        severity: 'moderate',
        description: 'Summer months can see temperatures above 90°F (32°C)',
        icon: 'thermometer-sun',
      },
      {
        type: 'flood',
        severity: 'low',
        description: 'Brief but intense thunderstorms in late summer',
        icon: 'cloud-lightning',
      }
    ],
    safetyScore: 88,
    travelAdvisory: 'low',
    insuranceRecommendation: 'Standard travel insurance recommended',
    month: 7
  },
  {
    country: 'Canada',
    city: 'Vancouver',
    weatherRisks: [
      {
        type: 'flood',
        severity: 'low',
        description: 'Heavy rainfall from October to March',
        icon: 'cloud-drizzle',
      },
      {
        type: 'wildfire',
        severity: 'moderate',
        description: 'Smoke from wildfires can affect air quality in summer months',
        icon: 'flame',
      }
    ],
    safetyScore: 90,
    travelAdvisory: 'low',
    insuranceRecommendation: 'Standard travel insurance recommended',
    month: 7
  },
  {
    country: 'Switzerland',
    city: 'Zermatt',
    weatherRisks: [
      {
        type: 'avalanche',
        severity: 'moderate',
        description: 'Avalanche risk in winter months, particularly January-February',
        icon: 'mountain-snow',
      },
      {
        type: 'blizzard',
        severity: 'moderate',
        description: 'Heavy snowfall can disrupt transportation',
        icon: 'snowflake',
      }
    ],
    safetyScore: 92,
    travelAdvisory: 'low',
    insuranceRecommendation: 'Adventure sports coverage recommended for winter activities',
    month: 1
  }
];

// Get destinations filtered by month
export function getDestinationsByMonth(month: number): DestinationRisk[] {
  // In real app, this would filter based on month-specific risks
  // For demo, we'll return all but simulate a filter
  return destinationRisks.map(destination => {
    // Adjust severity based on whether it's in season
    const weatherRisks = destination.weatherRisks.map(risk => {
      // Hurricane severity is higher during hurricane months
      if (risk.type === 'hurricane' && month >= 6 && month <= 11) {
        return { ...risk, severity: 'high' as RiskLevel };
      }
      // Extreme heat is higher in summer months
      if (risk.type === 'extreme_heat' && month >= 6 && month <= 8) {
        return { ...risk, severity: 'high' as RiskLevel };
      }
      // Avalanche risk is higher in winter
      if (risk.type === 'avalanche' && month >= 12 || month <= 3) {
        return { ...risk, severity: 'high' as RiskLevel };
      }
      // Otherwise return original risk
      return risk;
    });

    return {
      ...destination,
      weatherRisks
    };
  });
}

// Util to get color for risk level
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'low':
      return 'text-green-500 bg-green-100';
    case 'moderate':
      return 'text-yellow-500 bg-yellow-100';
    case 'high':
      return 'text-orange-500 bg-orange-100';
    case 'severe':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-500 bg-gray-100';
  }
}

// Util to get insurance type recommendation based on risk factors
export function getInsuranceRecommendation(risks: WeatherRiskFactor[]): string {
  if (risks.some(r => r.severity === 'high' || r.severity === 'severe')) {
    if (risks.some(r => r.type === 'hurricane' || r.type === 'flood')) {
      return 'Trip cancellation/interruption with natural disaster coverage';
    }
    if (risks.some(r => r.type === 'avalanche' || r.type === 'wildfire')) {
      return 'Adventure sports coverage with emergency evacuation';
    }
  }
  
  return 'Standard travel insurance with medical coverage';
}