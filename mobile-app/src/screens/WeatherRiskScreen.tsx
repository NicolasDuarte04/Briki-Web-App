import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Card, 
  Button, 
  Divider, 
  List, 
  ProgressBar, 
  Chip, 
  IconButton,
  Snackbar
} from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat 
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { MainStackParamList } from '../navigation/AppNavigator';
import { RiskLevel, WeatherRiskFactor, DestinationRisk } from '../types/weather';
import { COLORS } from '../utils/theme';

// Importing the weather risk data
// In a real app, this would come from an API call
import { DESTINATIONS } from '../data/weatherRiskData';

type WeatherRiskScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const WeatherRiskScreen = () => {
  const navigation = useNavigation<WeatherRiskScreenNavigationProp>();
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [originCountry, setOriginCountry] = useState<string>('colombia');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [destination, setDestination] = useState<DestinationRisk | null>(null);
  const [insuranceRecommendation, setInsuranceRecommendation] = useState<string>('');
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  // Animation values
  const pulseAnimation = useSharedValue(1);

  // Start pulse animation on component mount
  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1.05, { duration: 1000 }),
      -1, // Infinite repetition
      true // Reverse the animation
    );
    
    // Set first destination if available
    if (DESTINATIONS.length > 0 && !selectedDestination) {
      const firstDest = DESTINATIONS[0];
      setSelectedDestination(`${firstDest.country.toLowerCase()}-${firstDest.city.toLowerCase()}`);
      updateDestination(`${firstDest.country.toLowerCase()}-${firstDest.city.toLowerCase()}`);
    }
  }, []);

  // Update destination when selection changes
  const updateDestination = (value: string) => {
    const [country, city] = value.split('-');
    
    const found = DESTINATIONS.find(d => 
      d.country.toLowerCase() === country.toLowerCase() &&
      d.city.toLowerCase() === city.toLowerCase()
    );
    
    if (found) {
      // If the destination has specific data for the month, use that
      if (found.seasons && found.seasons[currentMonth]) {
        setDestination({
          ...found,
          safetyScore: found.seasons[currentMonth].safetyScore,
          weatherRisks: found.seasons[currentMonth].weatherRisks,
        });
      } else {
        setDestination(found);
      }
      
      setInsuranceRecommendation(found.insuranceRecommendation);
    }
  };

  // Handle month change
  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
    
    // Update destination data for new month
    if (selectedDestination) {
      updateDestination(selectedDestination);
    }
  };

  // Animated style for risk indicators
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnimation.value }],
    };
  });

  const getRiskColor = (severity: RiskLevel): string => {
    switch (severity) {
      case RiskLevel.LOW:
        return COLORS.riskLow;
      case RiskLevel.MODERATE:
        return COLORS.riskModerate;
      case RiskLevel.HIGH:
        return COLORS.riskHigh;
      case RiskLevel.EXTREME:
        return COLORS.riskExtreme;
      default:
        return COLORS.gray;
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'hurricane':
        return 'weather-hurricane';
      case 'flood':
        return 'water';
      case 'extreme_heat':
        return 'thermometer-high';
      case 'wildfire':
        return 'fire';
      case 'avalanche':
        return 'snowflake';
      case 'blizzard':
        return 'snowflake-alert';
      case 'drought':
        return 'weather-sunny-alert';
      default:
        return 'alert-circle';
    }
  };

  const viewInsurancePlans = () => {
    if (destination) {
      // Show a message that we're using the recommendation
      setSnackMessage('Filtrando seguros recomendados para tu destino');
      setSnackVisible(true);
      
      // In a real app, this would navigate to a filtered list of insurance plans
      setTimeout(() => {
        navigation.navigate('InsurancePlans');
      }, 1500);
    }
  };

  // Get list of months for the picker
  const getMonths = () => {
    return [
      { label: 'Enero', value: 1 },
      { label: 'Febrero', value: 2 },
      { label: 'Marzo', value: 3 },
      { label: 'Abril', value: 4 },
      { label: 'Mayo', value: 5 },
      { label: 'Junio', value: 6 },
      { label: 'Julio', value: 7 },
      { label: 'Agosto', value: 8 },
      { label: 'Septiembre', value: 9 },
      { label: 'Octubre', value: 10 },
      { label: 'Noviembre', value: 11 },
      { label: 'Diciembre', value: 12 },
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Riesgos Climáticos de Viaje</Text>
          <Text style={styles.headerSubtitle}>
            Consulta los posibles riesgos climáticos en tu destino de viaje para elegir el seguro más adecuado.
          </Text>
        </View>
        
        {/* Disclaimer */}
        <Card style={styles.disclaimerCard}>
          <Card.Content>
            <View style={styles.disclaimerContent}>
              <Ionicons name="information-circle" size={24} color={COLORS.primary} />
              <Text style={styles.disclaimerText}>
                La información de riesgos climáticos está basada en datos meteorológicos históricos y tendencias estacionales. 
                Los datos se actualizan periódicamente y se proporcionan como referencia para ayudar en la planificación de viajes.
              </Text>
            </View>
          </Card.Content>
        </Card>
        
        {/* Trip Details */}
        <Card style={styles.tripDetailsCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Detalles del Viaje</Text>
            
            <Text style={styles.inputLabel}>País de Origen</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={originCountry}
                onValueChange={(value) => setOriginCountry(value)}
                style={styles.picker}
              >
                <Picker.Item label="Colombia" value="colombia" />
                <Picker.Item label="México" value="mexico" />
                <Picker.Item label="Argentina" value="argentina" />
                <Picker.Item label="Chile" value="chile" />
                <Picker.Item label="Perú" value="peru" />
              </Picker>
            </View>
            
            <Text style={styles.inputLabel}>País de Destino</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDestination}
                onValueChange={(value) => {
                  setSelectedDestination(value);
                  updateDestination(value);
                }}
                style={styles.picker}
              >
                {DESTINATIONS.map((dest) => (
                  <Picker.Item 
                    key={`${dest.country}-${dest.city}`} 
                    label={`${dest.city}, ${dest.country}`} 
                    value={`${dest.country.toLowerCase()}-${dest.city.toLowerCase()}`} 
                  />
                ))}
              </Picker>
            </View>
          </Card.Content>
        </Card>
        
        {/* Weather Risk Visualization */}
        <Card style={styles.weatherCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Riesgos Climáticos</Text>
            
            <Text style={styles.inputLabel}>Mes de viaje</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={currentMonth}
                onValueChange={(value) => handleMonthChange(value)}
                style={styles.picker}
              >
                {getMonths().map((month) => (
                  <Picker.Item 
                    key={month.value} 
                    label={month.label} 
                    value={month.value} 
                  />
                ))}
              </Picker>
            </View>
            
            {destination ? (
              <View style={styles.destinationContainer}>
                <View style={styles.destinationHeader}>
                  <Text style={styles.destinationTitle}>
                    {destination.city}, {destination.country}
                  </Text>
                  
                  <View style={styles.safetyContainer}>
                    <Ionicons name="shield" size={18} color={COLORS.primary} />
                    <Text style={styles.safetyLabel}>Índice de seguridad:</Text>
                    <Text style={styles.safetyScore}>{destination.safetyScore}/100</Text>
                  </View>
                </View>
                
                <Text style={styles.progressLabel}>Nivel de seguridad:</Text>
                <ProgressBar 
                  progress={destination.safetyScore / 100} 
                  color={
                    destination.safetyScore > 80 ? COLORS.riskLow :
                    destination.safetyScore > 60 ? COLORS.riskModerate :
                    COLORS.riskHigh
                  }
                  style={styles.progressBar}
                />
                
                <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>
                  Factores de riesgo climático:
                </Text>
                
                {destination.weatherRisks.length > 0 ? (
                  destination.weatherRisks.map((risk, index) => (
                    <Animated.View 
                      key={`${risk.type}-${index}`} 
                      style={[
                        styles.riskCard,
                        { borderColor: getRiskColor(risk.severity) },
                        index === 0 ? animatedStyle : null // Only animate the first card
                      ]}
                    >
                      <View style={styles.riskHeader}>
                        <View style={styles.riskIconContainer}>
                          <MaterialCommunityIcons 
                            name={getRiskIcon(risk.type)} 
                            size={24} 
                            color={getRiskColor(risk.severity)} 
                          />
                        </View>
                        
                        <View style={styles.riskTitleContainer}>
                          <Text style={styles.riskTitle}>
                            {risk.type.replace('_', ' ')}
                          </Text>
                          <Chip 
                            style={[
                              styles.severityChip,
                              { backgroundColor: getRiskColor(risk.severity) + '30' }
                            ]}
                            textStyle={{ color: getRiskColor(risk.severity) }}
                          >
                            {risk.severity}
                          </Chip>
                        </View>
                      </View>
                      
                      <Text style={styles.riskDescription}>{risk.description}</Text>
                    </Animated.View>
                  ))
                ) : (
                  <View style={styles.emptyRisksContainer}>
                    <MaterialCommunityIcons name="weather-sunny" size={40} color={COLORS.grayLight} />
                    <Text style={styles.emptyRisksText}>
                      No hay riesgos climáticos significativos para este destino
                    </Text>
                  </View>
                )}
                
                {/* Insurance Recommendation */}
                <View style={styles.recommendationCard}>
                  <View style={styles.recommendationHeader}>
                    <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
                    <Text style={styles.recommendationTitle}>
                      Recomendación de seguro
                    </Text>
                  </View>
                  
                  <Text style={styles.recommendationText}>
                    {insuranceRecommendation}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="weather-cloudy" size={50} color={COLORS.grayLight} />
                <Text style={styles.emptyText}>
                  Selecciona un destino para ver sus riesgos climáticos
                </Text>
              </View>
            )}
          </Card.Content>
          
          {destination && (
            <Card.Actions style={styles.cardActions}>
              <Button mode="contained" onPress={viewInsurancePlans}>
                Ver planes recomendados
              </Button>
            </Card.Actions>
          )}
        </Card>
        
        {/* Footer disclaimer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            La información de seguro está basada en documentos públicos oficiales de cada proveedor, 
            incluyendo folletos y resúmenes de pólizas. Nos esforzamos por mantener la precisión y 
            transparencia mientras finalizamos alianzas formales con aseguradoras. Por favor, confirme 
            los detalles del plan con el proveedor antes de comprar.
          </Text>
        </View>
      </ScrollView>
      
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  disclaimerCard: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: COLORS.primaryLight + '15',
  },
  disclaimerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    color: COLORS.primary,
  },
  tripDetailsCard: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  weatherCard: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: COLORS.text,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    color: COLORS.text,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
    ...Platform.select({
      ios: {
        paddingHorizontal: 10,
      },
    }),
  },
  picker: {
    height: 50,
    width: '100%',
  },
  destinationContainer: {
    marginTop: 10,
  },
  destinationHeader: {
    marginBottom: 15,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  safetyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  safetyLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  safetyScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 5,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  riskCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskIconContainer: {
    marginRight: 10,
  },
  riskTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  riskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  severityChip: {
    height: 24,
    textTransform: 'capitalize',
  },
  riskDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  emptyRisksContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginVertical: 10,
  },
  emptyRisksText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  recommendationCard: {
    backgroundColor: COLORS.primaryLight + '15',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: 'flex-end',
    paddingTop: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 16,
  },
});

// In a real app, this would be fetched from an API
// For this demo, define it here
const DESTINATIONS: DestinationRisk[] = [
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
  }
];

export default WeatherRiskScreen;