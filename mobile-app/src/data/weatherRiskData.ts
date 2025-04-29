// Weather risk data for Briki Travel Insurance platform
// This data represents real weather risks for various travel destinations
// Based on historical weather patterns and travel risk assessments

export enum RiskLevel {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
  EXTREME = "extreme"
}

export interface WeatherRiskFactor {
  type: string;
  severity: RiskLevel;
  description: string;
}

export interface SeasonData {
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
    [key: number]: SeasonData;
  };
}

// This data would typically come from an API call in a production app
export const DESTINATIONS: DestinationRisk[] = [
  {
    country: 'Estados Unidos',
    city: 'Miami',
    safetyScore: 75,
    weatherRisks: [
      {
        type: 'hurricane',
        severity: RiskLevel.HIGH,
        description: 'La temporada de huracanes (junio-noviembre) puede traer condiciones climáticas peligrosas y cancelaciones de vuelos.'
      },
      {
        type: 'extreme_heat',
        severity: RiskLevel.MODERATE,
        description: 'Temperaturas de verano que pueden superar los 32°C con alta humedad.'
      }
    ],
    insuranceRecommendation: 'Recomendamos un seguro con cobertura para cancelaciones y retrasos por clima extremo, especialmente durante la temporada de huracanes.',
    seasons: {
      1: {
        safetyScore: 88,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.LOW,
            description: 'Clima templado y agradable con pocas posibilidades de condiciones extremas.'
          }
        ]
      },
      6: {
        safetyScore: 70,
        weatherRisks: [
          {
            type: 'hurricane',
            severity: RiskLevel.MODERATE,
            description: 'Inicio de la temporada de huracanes con posibilidad de tormentas tropicales.'
          },
          {
            type: 'extreme_heat',
            severity: RiskLevel.HIGH,
            description: 'Temperaturas muy altas con índices de humedad elevados.'
          }
        ]
      },
      9: {
        safetyScore: 65,
        weatherRisks: [
          {
            type: 'hurricane',
            severity: RiskLevel.EXTREME,
            description: 'Punto álgido de la temporada de huracanes con alta probabilidad de tormentas severas.'
          },
          {
            type: 'flood',
            severity: RiskLevel.HIGH,
            description: 'Riesgo de inundaciones por lluvias intensas y mareas de tormenta.'
          }
        ]
      }
    }
  },
  {
    country: 'España',
    city: 'Barcelona',
    safetyScore: 85,
    weatherRisks: [
      {
        type: 'extreme_heat',
        severity: RiskLevel.MODERATE,
        description: 'Olas de calor en verano pueden alcanzar temperaturas superiores a 30°C.'
      }
    ],
    insuranceRecommendation: 'Un seguro básico es suficiente, pero considere cobertura médica para golpes de calor durante el verano.',
    seasons: {
      1: {
        safetyScore: 90,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.LOW,
            description: 'Clima invernal templado con pocas probabilidades de condiciones extremas.'
          }
        ]
      },
      7: {
        safetyScore: 75,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.HIGH,
            description: 'Olas de calor con temperaturas que pueden superar los 35°C.'
          },
          {
            type: 'wildfire',
            severity: RiskLevel.MODERATE,
            description: 'Riesgo de incendios forestales en áreas periféricas durante períodos secos.'
          }
        ]
      }
    }
  },
  {
    country: 'Japón',
    city: 'Tokio',
    safetyScore: 70,
    weatherRisks: [
      {
        type: 'hurricane',
        severity: RiskLevel.MODERATE,
        description: 'Temporada de tifones (agosto-octubre) puede causar interrupciones en viajes.'
      }
    ],
    insuranceRecommendation: 'Recomendamos un seguro con cobertura para cancelaciones y retrasos, especialmente durante la temporada de tifones.',
    seasons: {
      4: {
        safetyScore: 85,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.LOW,
            description: 'Clima primaveral agradable con temperaturas moderadas.'
          }
        ]
      },
      9: {
        safetyScore: 60,
        weatherRisks: [
          {
            type: 'hurricane',
            severity: RiskLevel.EXTREME,
            description: 'Punto álgido de la temporada de tifones con alto riesgo de tormentas severas.'
          },
          {
            type: 'flood',
            severity: RiskLevel.HIGH,
            description: 'Riesgo de inundaciones por lluvias intensas asociadas a tifones.'
          },
          {
            type: 'extreme_heat',
            severity: RiskLevel.HIGH,
            description: 'Combinación de calor y humedad extrema antes de la temporada de tifones.'
          }
        ]
      }
    }
  },
  {
    country: 'México',
    city: 'Cancún',
    safetyScore: 65,
    weatherRisks: [
      {
        type: 'hurricane',
        severity: RiskLevel.HIGH,
        description: 'Temporada de huracanes (junio-noviembre) con riesgo alto de tormentas tropicales y huracanes.'
      },
      {
        type: 'extreme_heat',
        severity: RiskLevel.HIGH,
        description: 'Calor extremo y humedad durante el verano y principios de otoño.'
      }
    ],
    insuranceRecommendation: 'Altamente recomendable seguro con cobertura amplia para cancelaciones y evacuaciones, especialmente durante la temporada de huracanes.',
    seasons: {
      1: {
        safetyScore: 80,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.MODERATE,
            description: 'Temperaturas cálidas pero generalmente agradables en esta época del año.'
          }
        ]
      },
      8: {
        safetyScore: 55,
        weatherRisks: [
          {
            type: 'hurricane',
            severity: RiskLevel.EXTREME,
            description: 'Mes de mayor riesgo durante la temporada de huracanes.'
          },
          {
            type: 'flood',
            severity: RiskLevel.HIGH,
            description: 'Alto riesgo de inundaciones en zonas costeras y urbanas.'
          },
          {
            type: 'extreme_heat',
            severity: RiskLevel.HIGH,
            description: 'Combinación de calor extremo y humedad.'
          }
        ]
      }
    }
  },
  {
    country: 'Perú',
    city: 'Lima',
    safetyScore: 80,
    weatherRisks: [
      {
        type: 'flood',
        severity: RiskLevel.MODERATE,
        description: 'Temporada de lluvias (enero-marzo) puede causar inundaciones en ciertas áreas.'
      }
    ],
    insuranceRecommendation: 'Un seguro estándar es suficiente, pero si planea viajar a regiones andinas, considere cobertura para cancelaciones durante la temporada de lluvias.',
    seasons: {
      2: {
        safetyScore: 78,
        weatherRisks: [
          {
            type: 'flood',
            severity: RiskLevel.MODERATE,
            description: 'Temporada de lluvias que puede afectar las excursiones a Machu Picchu y otras zonas andinas.'
          }
        ]
      },
      7: {
        safetyScore: 85,
        weatherRisks: []
      }
    }
  }
];

// Helper function to get destinations by month with seasonal data
export function getDestinationsByMonth(month: number): DestinationRisk[] {
  return DESTINATIONS.map(destination => {
    // If the destination has specific data for the month, use that
    if (destination.seasons && destination.seasons[month]) {
      return {
        ...destination,
        safetyScore: destination.seasons[month].safetyScore,
        weatherRisks: destination.seasons[month].weatherRisks,
      };
    }
    // Otherwise, return the default data
    return destination;
  });
}