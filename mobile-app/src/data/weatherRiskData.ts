import { RiskLevel, DestinationRisk } from '../types/weather';

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
            description: 'Clima primaveral agradable con pocas posibilidades de condiciones extremas.'
          }
        ]
      },
      9: {
        safetyScore: 60,
        weatherRisks: [
          {
            type: 'hurricane',
            severity: RiskLevel.HIGH,
            description: 'Temporada alta de tifones con posibilidades de tormentas severas y cancelaciones de vuelos.'
          },
          {
            type: 'flood',
            severity: RiskLevel.MODERATE,
            description: 'Riesgo de fuertes lluvias e inundaciones en algunas áreas.'
          }
        ]
      }
    }
  },
  {
    country: 'México',
    city: 'Cancún',
    safetyScore: 72,
    weatherRisks: [
      {
        type: 'hurricane',
        severity: RiskLevel.HIGH,
        description: 'Temporada de huracanes (junio-noviembre) puede traer condiciones climáticas peligrosas.'
      },
      {
        type: 'extreme_heat',
        severity: RiskLevel.HIGH,
        description: 'Temperaturas que pueden superar los 35°C con humedad extrema.'
      }
    ],
    insuranceRecommendation: 'Recomendamos un seguro premium con amplia cobertura para cancelaciones, evacuaciones de emergencia y atención médica, especialmente durante la temporada de huracanes.',
    seasons: {
      1: {
        safetyScore: 88,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.MODERATE,
            description: 'Clima tropical cálido pero no extremo.'
          }
        ]
      },
      8: {
        safetyScore: 60,
        weatherRisks: [
          {
            type: 'hurricane',
            severity: RiskLevel.EXTREME,
            description: 'Alta temporada de huracanes con riesgo significativo de tormentas severas.'
          },
          {
            type: 'flood',
            severity: RiskLevel.HIGH,
            description: 'Riesgo de inundaciones por lluvias intensas y mareas de tormenta.'
          },
          {
            type: 'extreme_heat',
            severity: RiskLevel.HIGH,
            description: 'Calor extremo con alta humedad que puede causar problemas de salud.'
          }
        ]
      }
    }
  },
  {
    country: 'Italia',
    city: 'Venecia',
    safetyScore: 65,
    weatherRisks: [
      {
        type: 'flood',
        severity: RiskLevel.HIGH,
        description: 'Acqua alta (inundaciones) especialmente entre octubre y enero.'
      }
    ],
    insuranceRecommendation: 'Un seguro con cobertura para cancelaciones y cambios de alojamiento es esencial, especialmente en temporada de acqua alta.',
    seasons: {
      7: {
        safetyScore: 85,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.MODERATE,
            description: 'Temperaturas de verano que pueden ser incómodas, especialmente con la humedad.'
          }
        ]
      },
      11: {
        safetyScore: 55,
        weatherRisks: [
          {
            type: 'flood',
            severity: RiskLevel.EXTREME,
            description: 'Alto riesgo de acqua alta (inundaciones) que pueden afectar significativamente su estancia.'
          }
        ]
      }
    }
  },
  {
    country: 'Colombia',
    city: 'Bogotá',
    safetyScore: 78,
    weatherRisks: [
      {
        type: 'flood',
        severity: RiskLevel.MODERATE,
        description: 'Temporadas de lluvia (abril-mayo y octubre-noviembre) pueden causar inundaciones localizadas.'
      }
    ],
    insuranceRecommendation: 'Un seguro estándar es suficiente, pero considere cobertura para cambios en el itinerario durante la temporada de lluvias.',
    seasons: {
      4: {
        safetyScore: 75,
        weatherRisks: [
          {
            type: 'flood',
            severity: RiskLevel.MODERATE,
            description: 'Primera temporada de lluvias con posibilidad de tormentas intensas e inundaciones localizadas.'
          }
        ]
      },
      7: {
        safetyScore: 85,
        weatherRisks: []
      },
      10: {
        safetyScore: 75,
        weatherRisks: [
          {
            type: 'flood',
            severity: RiskLevel.MODERATE,
            description: 'Segunda temporada de lluvias con posibilidad de tormentas intensas e inundaciones localizadas.'
          }
        ]
      }
    }
  },
  {
    country: 'Argentina',
    city: 'Buenos Aires',
    safetyScore: 82,
    weatherRisks: [],
    insuranceRecommendation: 'Un seguro básico es suficiente para Buenos Aires, ya que no presenta riesgos climáticos extremos en la mayoría de los meses.',
    seasons: {
      1: {
        safetyScore: 75,
        weatherRisks: [
          {
            type: 'extreme_heat',
            severity: RiskLevel.MODERATE,
            description: 'Verano con posibilidad de días muy calurosos.'
          }
        ]
      },
      7: {
        safetyScore: 85,
        weatherRisks: []
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
        severity: RiskLevel.LOW,
        description: 'Temporada de lluvias en la sierra (diciembre-marzo) puede afectar transporte a zonas interiores.'
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