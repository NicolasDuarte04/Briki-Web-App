/**
 * Weather risk data for the Briki Travel Insurance app
 * 
 * This file contains structured data about weather risks across destinations
 * and months, used to provide personalized travel insurance recommendations.
 */

// Types for weather risk data
export type RiskLevel = 1 | 2 | 3 | 4 | 5; // 1 = Very Low, 5 = Very High

export interface Destination {
  id: number;
  name: string;
  country: string;
  region: string;
  riskLevel: RiskLevel;
  monthlyRisks: MonthlyRisk[];
  weatherHazards: WeatherHazard[];
}

export interface MonthlyRisk {
  month: number; // 1-12 representing Jan-Dec
  riskLevel: RiskLevel;
  primaryRisks: string[];
}

export interface WeatherHazard {
  name: string;
  probability: number; // 0-1
  severity: RiskLevel;
  description: string;
  relevantCoverage: string[];
}

export interface RiskFactor {
  id: number;
  name: string;
  description: string;
  impactLevel: RiskLevel;
  travelAdvice: string;
  recommendedCoverage: string[];
}

// Weather risk data
export const weatherRiskData = {
  // List of popular destinations
  destinations: [
    {
      id: 1,
      name: "Cancún",
      country: "Mexico",
      region: "Caribbean",
      riskLevel: 3,
      monthlyRisks: [
        { month: 1, riskLevel: 2, primaryRisks: ["Occasional rain", "Mild wind"] },
        { month: 2, riskLevel: 2, primaryRisks: ["Occasional rain", "Mild wind"] },
        { month: 3, riskLevel: 2, primaryRisks: ["Occasional rain", "UV exposure"] },
        { month: 4, riskLevel: 2, primaryRisks: ["UV exposure", "Heat"] },
        { month: 5, riskLevel: 3, primaryRisks: ["Heat", "UV exposure", "Heavy rain"] },
        { month: 6, riskLevel: 3, primaryRisks: ["Heavy rain", "Storms", "Heat"] },
        { month: 7, riskLevel: 3, primaryRisks: ["Heavy rain", "Storms", "Heat"] },
        { month: 8, riskLevel: 4, primaryRisks: ["Hurricane risk", "Heavy rain", "Storms"] },
        { month: 9, riskLevel: 5, primaryRisks: ["Hurricane peak season", "Flooding", "Storms"] },
        { month: 10, riskLevel: 4, primaryRisks: ["Hurricane risk", "Heavy rain", "Flooding"] },
        { month: 11, riskLevel: 3, primaryRisks: ["Heavy rain", "Mild storms"] },
        { month: 12, riskLevel: 2, primaryRisks: ["Occasional rain", "Mild wind"] }
      ],
      weatherHazards: [
        {
          name: "Hurricanes",
          probability: 0.4,
          severity: 5,
          description: "The Atlantic hurricane season runs from June to November, with peak activity in September. Direct hits can cause significant disruption to travel plans.",
          relevantCoverage: ["Trip cancellation", "Trip interruption", "Emergency evacuation"]
        },
        {
          name: "Flooding",
          probability: 0.5,
          severity: 4,
          description: "Heavy rainfall during the rainy season (May-October) can cause localized flooding in some areas.",
          relevantCoverage: ["Trip delay", "Trip interruption", "Emergency assistance"]
        }
      ]
    },
    {
      id: 2,
      name: "Bogotá",
      country: "Colombia",
      region: "Andean",
      riskLevel: 2,
      monthlyRisks: [
        { month: 1, riskLevel: 2, primaryRisks: ["Rain", "Chilly evenings"] },
        { month: 2, riskLevel: 2, primaryRisks: ["Rain", "Chilly evenings"] },
        { month: 3, riskLevel: 2, primaryRisks: ["Rain", "Temperature fluctuations"] },
        { month: 4, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk"] },
        { month: 5, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk"] },
        { month: 6, riskLevel: 2, primaryRisks: ["Mild rain", "Temperature fluctuations"] },
        { month: 7, riskLevel: 2, primaryRisks: ["Mild rain", "Wind"] },
        { month: 8, riskLevel: 2, primaryRisks: ["Mild rain", "Wind"] },
        { month: 9, riskLevel: 2, primaryRisks: ["Moderate rain", "Temperature fluctuations"] },
        { month: 10, riskLevel: 3, primaryRisks: ["Heavy rain", "Landslide risk"] },
        { month: 11, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk"] },
        { month: 12, riskLevel: 2, primaryRisks: ["Rain", "Chilly evenings"] }
      ],
      weatherHazards: [
        {
          name: "Landslides",
          probability: 0.3,
          severity: 4,
          description: "During heavy rain periods, landslides may occur in mountainous areas and on roads connecting to other regions.",
          relevantCoverage: ["Trip interruption", "Emergency assistance", "Medical evacuation"]
        },
        {
          name: "Altitude sickness",
          probability: 0.4,
          severity: 3,
          description: "At 2,640 meters above sea level, some visitors may experience altitude sickness, especially those with respiratory or cardiovascular conditions.",
          relevantCoverage: ["Emergency medical", "Medical evacuation", "Trip interruption"]
        }
      ]
    },
    {
      id: 3,
      name: "Cartagena",
      country: "Colombia",
      region: "Caribbean",
      riskLevel: 2,
      monthlyRisks: [
        { month: 1, riskLevel: 1, primaryRisks: ["Heat", "UV exposure"] },
        { month: 2, riskLevel: 1, primaryRisks: ["Heat", "UV exposure"] },
        { month: 3, riskLevel: 1, primaryRisks: ["Heat", "UV exposure"] },
        { month: 4, riskLevel: 2, primaryRisks: ["Heat", "Occasional rain", "UV exposure"] },
        { month: 5, riskLevel: 2, primaryRisks: ["Heat", "Rain", "UV exposure"] },
        { month: 6, riskLevel: 2, primaryRisks: ["Heat", "Rain", "Humidity"] },
        { month: 7, riskLevel: 2, primaryRisks: ["Heat", "Wind", "Humidity"] },
        { month: 8, riskLevel: 2, primaryRisks: ["Heat", "Wind", "Humidity"] },
        { month: 9, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk", "Heat"] },
        { month: 10, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk", "Heat"] },
        { month: 11, riskLevel: 2, primaryRisks: ["Rain", "Heat"] },
        { month: 12, riskLevel: 1, primaryRisks: ["Heat", "UV exposure"] }
      ],
      weatherHazards: [
        {
          name: "Coastal flooding",
          probability: 0.3,
          severity: 3,
          description: "During heavy rain season, some areas of the city, particularly the Getsemaní district, may experience street flooding.",
          relevantCoverage: ["Trip delay", "Hotel accommodations", "Emergency assistance"]
        },
        {
          name: "Heat-related illness",
          probability: 0.5,
          severity: 3,
          description: "High temperatures and humidity year-round, especially mid-day, can lead to dehydration and heat exhaustion.",
          relevantCoverage: ["Emergency medical", "Medical evacuation"]
        }
      ]
    },
    {
      id: 4,
      name: "Mexico City",
      country: "Mexico",
      region: "Central",
      riskLevel: 2,
      monthlyRisks: [
        { month: 1, riskLevel: 1, primaryRisks: ["Cool mornings", "Dry air"] },
        { month: 2, riskLevel: 1, primaryRisks: ["Cool mornings", "Dry air"] },
        { month: 3, riskLevel: 2, primaryRisks: ["Dust", "UV exposure"] },
        { month: 4, riskLevel: 2, primaryRisks: ["Heat", "Dust", "UV exposure"] },
        { month: 5, riskLevel: 2, primaryRisks: ["Heat", "UV exposure", "Occasional storms"] },
        { month: 6, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk", "Storms"] },
        { month: 7, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk", "Storms"] },
        { month: 8, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk", "Storms"] },
        { month: 9, riskLevel: 3, primaryRisks: ["Heavy rain", "Flooding risk", "Storms"] },
        { month: 10, riskLevel: 2, primaryRisks: ["Rain", "Temperature fluctuations"] },
        { month: 11, riskLevel: 1, primaryRisks: ["Cool temperatures", "Occasional rain"] },
        { month: 12, riskLevel: 1, primaryRisks: ["Cool temperatures", "Dry air"] }
      ],
      weatherHazards: [
        {
          name: "Urban flooding",
          probability: 0.4,
          severity: 3,
          description: "The rainy season (June-September) can cause flash flooding and transportation disruptions in the city.",
          relevantCoverage: ["Trip delay", "Trip interruption", "Emergency assistance"]
        },
        {
          name: "Air quality issues",
          probability: 0.6,
          severity: 3,
          description: "During dry seasons, air quality can deteriorate, potentially affecting travelers with respiratory conditions.",
          relevantCoverage: ["Emergency medical", "Trip interruption"]
        }
      ]
    },
    {
      id: 5,
      name: "Medellín",
      country: "Colombia",
      region: "Andean",
      riskLevel: 1,
      monthlyRisks: [
        { month: 1, riskLevel: 1, primaryRisks: ["Mild temperatures", "Occasional rain"] },
        { month: 2, riskLevel: 1, primaryRisks: ["Mild temperatures", "Occasional rain"] },
        { month: 3, riskLevel: 2, primaryRisks: ["Rain", "Temperature fluctuations"] },
        { month: 4, riskLevel: 2, primaryRisks: ["Heavy rain", "Mild flooding risk"] },
        { month: 5, riskLevel: 2, primaryRisks: ["Heavy rain", "Mild flooding risk"] },
        { month: 6, riskLevel: 1, primaryRisks: ["Mild temperatures", "Occasional rain"] },
        { month: 7, riskLevel: 1, primaryRisks: ["Mild temperatures", "Occasional rain"] },
        { month: 8, riskLevel: 1, primaryRisks: ["Mild temperatures", "Occasional rain"] },
        { month: 9, riskLevel: 2, primaryRisks: ["Rain", "Temperature fluctuations"] },
        { month: 10, riskLevel: 2, primaryRisks: ["Heavy rain", "Mild flooding risk"] },
        { month: 11, riskLevel: 2, primaryRisks: ["Heavy rain", "Mild flooding risk"] },
        { month: 12, riskLevel: 1, primaryRisks: ["Mild temperatures", "Occasional rain"] }
      ],
      weatherHazards: [
        {
          name: "Landslides",
          probability: 0.2,
          severity: 4,
          description: "Heavy rainfall in the surrounding hillsides can occasionally trigger landslides, particularly in the rainy seasons.",
          relevantCoverage: ["Trip interruption", "Emergency assistance", "Medical evacuation"]
        }
      ]
    }
  ],
  
  // Common risk factors for travelers
  riskFactors: [
    {
      id: 1,
      name: "Hurricanes",
      description: "Powerful tropical storms that can cause widespread destruction, travel disruptions, and evacuation orders.",
      impactLevel: 5,
      travelAdvice: "Avoid travel to hurricane-prone regions during peak hurricane season (August-October).",
      recommendedCoverage: ["Trip cancellation", "Trip interruption", "Emergency evacuation"]
    },
    {
      id: 2,
      name: "Flooding",
      description: "Excess water accumulation that can damage infrastructure, cause transportation disruptions, and pose health hazards.",
      impactLevel: 4,
      travelAdvice: "Research local flood patterns and avoid travel during heavy rainy seasons if possible.",
      recommendedCoverage: ["Trip delay", "Trip interruption", "Emergency assistance"]
    },
    {
      id: 3,
      name: "Extreme Heat",
      description: "High temperatures that can lead to dehydration, heat exhaustion, and heat stroke, particularly in humid environments.",
      impactLevel: 3,
      travelAdvice: "Stay hydrated, limit outdoor activities during peak sun hours, and use sun protection.",
      recommendedCoverage: ["Emergency medical", "Trip interruption"]
    },
    {
      id: 4,
      name: "Landslides",
      description: "Downward movement of soil and rock that can block roads, damage infrastructure, and pose danger to travelers.",
      impactLevel: 4,
      travelAdvice: "Exercise caution when traveling in mountainous areas during or after heavy rainfall.",
      recommendedCoverage: ["Trip interruption", "Emergency medical", "Medical evacuation"]
    },
    {
      id: 5,
      name: "Altitude Sickness",
      description: "Physical distress caused by exposure to low oxygen pressure at high elevations, common in destinations above 2,500 meters.",
      impactLevel: 3,
      travelAdvice: "Acclimatize gradually, stay hydrated, and consider medication if traveling to high-altitude locations.",
      recommendedCoverage: ["Emergency medical", "Medical evacuation", "Trip interruption"]
    }
  ],
  
  // Insurance considerations based on weather risk
  insuranceConsiderations: [
    {
      riskLevel: 1,
      recommendedCoverage: "Basic travel insurance with standard trip cancellation/interruption coverage.",
      estimatedCostIncrease: 0
    },
    {
      riskLevel: 2,
      recommendedCoverage: "Standard travel insurance with weather delay protection and emergency assistance.",
      estimatedCostIncrease: 10
    },
    {
      riskLevel: 3,
      recommendedCoverage: "Enhanced travel insurance with weather-related trip interruption and emergency assistance.",
      estimatedCostIncrease: 25
    },
    {
      riskLevel: 4,
      recommendedCoverage: "Comprehensive travel insurance with robust weather-related protections and evacuation coverage.",
      estimatedCostIncrease: 40
    },
    {
      riskLevel: 5,
      recommendedCoverage: "Premium travel insurance with maximum coverage for severe weather events, including CFAR (Cancel For Any Reason).",
      estimatedCostIncrease: 60
    }
  ]
};