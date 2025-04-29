import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  SafeAreaView,
  Dimensions,
  Image,
  FlatList
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
  Snackbar,
  Surface,
  ActivityIndicator,
  SegmentedButtons
} from 'react-native-paper';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
  FadeIn,
  SlideInRight,
  interpolateColor
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { MainStackParamList } from '../navigation/AppNavigator';
import { RiskLevel, WeatherRiskFactor, DestinationRisk } from '../types/weather';
import { COLORS } from '../utils/theme';
import { styles } from './WeatherRiskScreenStyles';

// Importing the weather risk data
import { DESTINATIONS, getDestinationsByMonth } from '../data/weatherRiskData';

type WeatherRiskScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const WeatherRiskScreen: React.FC = () => {
  const navigation = useNavigation<WeatherRiskScreenNavigationProp>();
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [originCountry, setOriginCountry] = useState<string>('colombia');
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [destination, setDestination] = useState<DestinationRisk | null>(null);
  const [insuranceRecommendation, setInsuranceRecommendation] = useState<string>('');
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [activeTab, setActiveTab] = useState('weather');
  const [isLoading, setIsLoading] = useState(false);
  
  // Destination carousel ref
  const flatListRef = useRef<FlatList>(null);
  
  // Animation values
  const pulseAnimation = useSharedValue(1);
  const tabIndicatorPosition = useSharedValue(0);
  const weatherOpacity = useSharedValue(1);
  const safetyOpacity = useSharedValue(0);

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

  // Switch between tabs with animation
  const switchTab = (tab: string) => {
    setIsLoading(true);
    
    // Animate tab indicator position
    tabIndicatorPosition.value = withTiming(
      tab === 'weather' ? 0 : Dimensions.get('window').width / 2, 
      { duration: 300, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }
    );
    
    // Fade out current tab content
    if (tab === 'weather') {
      safetyOpacity.value = withTiming(0, { duration: 150 });
      setTimeout(() => {
        setActiveTab(tab);
        // Fade in new tab content
        weatherOpacity.value = withTiming(1, { duration: 250 });
        setIsLoading(false);
      }, 200);
    } else {
      weatherOpacity.value = withTiming(0, { duration: 150 });
      setTimeout(() => {
        setActiveTab(tab);
        // Fade in new tab content
        safetyOpacity.value = withTiming(1, { duration: 250 });
        setIsLoading(false);
      }, 200);
    }
  };
  
  // Animated styles for tab content
  const weatherContentStyle = useAnimatedStyle(() => {
    return {
      opacity: weatherOpacity.value,
      display: weatherOpacity.value === 0 ? 'none' as const : 'flex' as const,
    };
  });
  
  const safetyContentStyle = useAnimatedStyle(() => {
    return {
      opacity: safetyOpacity.value,
      display: safetyOpacity.value === 0 ? 'none' as const : 'flex' as const,
    };
  });
  
  // Animated style for tab indicator
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabIndicatorPosition.value }],
    };
  });
  
  // Scroll the destination carousel
  const scrollToDestination = (index: number) => {
    flatListRef.current?.scrollToIndex({ 
      index, 
      animated: true,
      viewPosition: 0.5
    });
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header with gradient background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Riesgos de Viaje</Text>
          <Text style={styles.headerSubtitle}>
            Analiza los riesgos en tu destino para elegir el seguro adecuado.
          </Text>
        </View>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'weather' ? styles.activeTab : null]} 
            onPress={() => switchTab('weather')}
          >
            <MaterialCommunityIcons 
              name="weather-partly-cloudy" 
              size={24} 
              color={activeTab === 'weather' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'weather' ? COLORS.primary : COLORS.textSecondary }
            ]}>
              Clima
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'safety' ? styles.activeTab : null]} 
            onPress={() => switchTab('safety')}
          >
            <Ionicons 
              name="shield-checkmark-outline" 
              size={24} 
              color={activeTab === 'safety' ? COLORS.primary : COLORS.textSecondary} 
            />
            <Text style={[
              styles.tabText, 
              { color: activeTab === 'safety' ? COLORS.primary : COLORS.textSecondary }
            ]}>
              Seguridad
            </Text>
          </TouchableOpacity>
          
          <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
        </View>
      </View>
      
      {/* Destination Carousel */}
      <View style={styles.destinationCarouselContainer}>
        <Text style={styles.carouselLabel}>Destinos populares</Text>
        <FlatList
          ref={flatListRef}
          data={DESTINATIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item.country}-${item.city}`}
          contentContainerStyle={styles.carouselContent}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[
                styles.destinationItem, 
                selectedDestination === `${item.country.toLowerCase()}-${item.city.toLowerCase()}` ? 
                  styles.selectedDestinationItem : null
              ]}
              onPress={() => {
                setSelectedDestination(`${item.country.toLowerCase()}-${item.city.toLowerCase()}`);
                updateDestination(`${item.country.toLowerCase()}-${item.city.toLowerCase()}`);
              }}
            >
              <View style={styles.destinationImageContainer}>
                <View style={[
                  styles.riskIndicator,
                  { 
                    backgroundColor: 
                      item.safetyScore > 80 ? COLORS.riskLow :
                      item.safetyScore > 60 ? COLORS.riskModerate :
                      COLORS.riskHigh 
                  }
                ]} />
                <Text style={styles.destinationName}>{item.city}</Text>
                <Text style={styles.destinationCountry}>{item.country}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      
      <ScrollView style={styles.scrollView}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        
        {/* Weather Tab Content */}
        <Animated.View style={weatherContentStyle}>
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
        </Animated.View>
        
        {/* Safety Tab Content */}
        <Animated.View style={safetyContentStyle}>
          <Card style={styles.disclaimerCard}>
            <Card.Content>
              <View style={styles.disclaimerContent}>
                <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
                <Text style={styles.disclaimerText}>
                  La información de seguridad se basa en datos de fuentes oficiales y actualizaciones de viajeros.
                  Incluye factores como seguridad sanitaria, criminalidad y riesgos naturales.
                </Text>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
        
        {/* Trip Details - Shown in both tabs */}
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
        
        {/* Weather Tab Specific Content */}
        <Animated.View style={weatherContentStyle}>
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
                  </View>
                  
                  <View style={styles.safetyScoreContainer}>
                    <Text style={styles.safetyScoreLabel}>Índice de Seguridad:</Text>
                    <Text 
                      style={[
                        styles.safetyScore,
                        { 
                          color: 
                            destination.safetyScore > 80 ? COLORS.riskLow :
                            destination.safetyScore > 60 ? COLORS.riskModerate :
                            COLORS.riskHigh 
                        }
                      ]}
                    >
                      {destination.safetyScore}/100
                    </Text>
                    <View style={styles.progressContainer}>
                      <ProgressBar 
                        progress={destination.safetyScore / 100} 
                        color={
                          destination.safetyScore > 80 ? COLORS.riskLow :
                          destination.safetyScore > 60 ? COLORS.riskModerate :
                          COLORS.riskHigh
                        }
                        style={{ height: 8, borderRadius: 4 }}
                      />
                    </View>
                  </View>
                  
                  <Divider style={{ marginVertical: 10 }} />
                  
                  <Text style={styles.sectionTitle}>Factores de Riesgo</Text>
                  
                  {destination.weatherRisks.length > 0 ? (
                    destination.weatherRisks.map((risk, index) => (
                      <Animated.View 
                        key={`${risk.type}-${index}`} 
                        style={[
                          styles.riskLevelCard,
                          { 
                            borderLeftColor: getRiskColor(risk.severity),
                            backgroundColor: `${getRiskColor(risk.severity)}15`,
                          },
                          risk.severity === RiskLevel.HIGH || risk.severity === RiskLevel.EXTREME 
                            ? animatedStyle 
                            : {}
                        ]}
                        entering={SlideInRight.delay(index * 200)}
                      >
                        <MaterialCommunityIcons 
                          name={getRiskIcon(risk.type)} 
                          size={28} 
                          color={getRiskColor(risk.severity)} 
                        />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                          <Text style={[styles.riskLevelText, { color: getRiskColor(risk.severity) }]}>
                            {risk.type === 'hurricane' && 'Huracanes/Tormentas'}
                            {risk.type === 'flood' && 'Inundaciones'}
                            {risk.type === 'extreme_heat' && 'Calor Extremo'}
                            {risk.type === 'wildfire' && 'Incendios Forestales'}
                            {risk.type === 'avalanche' && 'Avalanchas'}
                            {risk.type === 'blizzard' && 'Ventiscas'}
                            {risk.type === 'drought' && 'Sequía'}
                            {!['hurricane', 'flood', 'extreme_heat', 'wildfire', 'avalanche', 'blizzard', 'drought'].includes(risk.type) && risk.type}
                          </Text>
                          <Text style={styles.riskLevelDescription}>
                            {risk.description}
                          </Text>
                        </View>
                      </Animated.View>
                    ))
                  ) : (
                    <Text style={{ color: COLORS.textSecondary, textAlign: 'center', marginVertical: 20 }}>
                      No hay riesgos climáticos significativos en este destino para el mes seleccionado.
                    </Text>
                  )}
                  
                  <Card style={styles.insuranceRecommendationCard}>
                    <Card.Content>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Ionicons name="shield-checkmark" size={22} color={COLORS.primary} />
                        <Text style={styles.recommendationTitle}>
                          Recomendación de Seguro
                        </Text>
                      </View>
                      <Text style={styles.recommendationText}>
                        {insuranceRecommendation}
                      </Text>
                    </Card.Content>
                  </Card>
                  
                  <Button 
                    mode="contained"
                    style={styles.ctaButton}
                    contentStyle={styles.ctaButtonContent}
                    labelStyle={styles.ctaButtonLabel}
                    icon="shield-check"
                    onPress={viewInsurancePlans}
                  >
                    Ver Seguros Recomendados
                  </Button>
                </View>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={{ marginTop: 10 }}>Cargando datos...</Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
        
        {/* Safety Tab Content */}
        <Animated.View style={safetyContentStyle}>
          {destination && (
            <Card style={styles.weatherCard}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Seguridad en {destination.city}</Text>
                
                <View style={styles.safetyScoreContainer}>
                  <Text style={styles.safetyScoreLabel}>Índice de Seguridad:</Text>
                  <Text 
                    style={[
                      styles.safetyScore,
                      { 
                        color: 
                          destination.safetyScore > 80 ? COLORS.riskLow :
                          destination.safetyScore > 60 ? COLORS.riskModerate :
                          COLORS.riskHigh 
                      }
                    ]}
                  >
                    {destination.safetyScore}/100
                  </Text>
                  <View style={styles.progressContainer}>
                    <ProgressBar 
                      progress={destination.safetyScore / 100} 
                      color={
                        destination.safetyScore > 80 ? COLORS.riskLow :
                        destination.safetyScore > 60 ? COLORS.riskModerate :
                        COLORS.riskHigh
                      }
                      style={{ height: 8, borderRadius: 4 }}
                    />
                  </View>
                </View>
                
                <Divider style={{ marginVertical: 10 }} />
                
                <Text style={styles.sectionTitle}>Recomendaciones de Seguridad</Text>
                
                <View style={styles.safetyTipsContainer}>
                  <View style={styles.safetyTipItem}>
                    <View style={styles.safetyTipNumber}>
                      <Text style={styles.safetyTipNumberText}>1</Text>
                    </View>
                    <View style={styles.safetyTipContent}>
                      <Text style={styles.safetyTipTitle}>Mantente informado</Text>
                      <Text style={styles.safetyTipDescription}>
                        Consulta fuentes oficiales sobre las condiciones climáticas y alertas de seguridad antes y durante tu viaje.
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.safetyTipItem}>
                    <View style={styles.safetyTipNumber}>
                      <Text style={styles.safetyTipNumberText}>2</Text>
                    </View>
                    <View style={styles.safetyTipContent}>
                      <Text style={styles.safetyTipTitle}>Contrata seguro adecuado</Text>
                      <Text style={styles.safetyTipDescription}>
                        Asegúrate de que tu póliza cubra riesgos específicos de tu destino y actividades planificadas.
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.safetyTipItem}>
                    <View style={styles.safetyTipNumber}>
                      <Text style={styles.safetyTipNumberText}>3</Text>
                    </View>
                    <View style={styles.safetyTipContent}>
                      <Text style={styles.safetyTipTitle}>Plan de contingencia</Text>
                      <Text style={styles.safetyTipDescription}>
                        Ten un plan alternativo en caso de eventos climáticos o de seguridad inesperados.
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.safetyTipItem}>
                    <View style={styles.safetyTipNumber}>
                      <Text style={styles.safetyTipNumberText}>4</Text>
                    </View>
                    <View style={styles.safetyTipContent}>
                      <Text style={styles.safetyTipTitle}>Documentos importantes</Text>
                      <Text style={styles.safetyTipDescription}>
                        Guarda copias de tu póliza de seguro, pasaporte y contactos de emergencia en tu teléfono y en la nube.
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Button 
                  mode="contained"
                  style={styles.ctaButton}
                  contentStyle={styles.ctaButtonContent}
                  labelStyle={styles.ctaButtonLabel}
                  icon="shield-check"
                  onPress={viewInsurancePlans}
                >
                  Ver Seguros Recomendados
                </Button>
              </Card.Content>
            </Card>
          )}
        </Animated.View>
      </ScrollView>
      
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackVisible(false),
        }}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default WeatherRiskScreen;