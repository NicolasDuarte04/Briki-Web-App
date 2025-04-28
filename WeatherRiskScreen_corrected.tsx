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

const { width, height } = Dimensions.get('window');

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
      tab === 'weather' ? 0 : width / 2, 
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
      display: weatherOpacity.value === 0 ? 'none' : 'flex',
    };
  });
  
  const safetyContentStyle = useAnimatedStyle(() => {
    return {
      opacity: safetyOpacity.value,
      display: safetyOpacity.value === 0 ? 'none' : 'flex',
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
                    <Chip 
                      icon="shield-check" 
                      style={[
                        styles.safetyChip, 
                        { 
                          backgroundColor: 
                            destination.safetyScore > 80 ? COLORS.riskLow + '20' :
                            destination.safetyScore > 60 ? COLORS.riskModerate + '20' :
                            COLORS.riskHigh + '20' 
                        }
                      ]}
                      textStyle={{
                        color: 
                          destination.safetyScore > 80 ? COLORS.riskLow :
                          destination.safetyScore > 60 ? COLORS.riskModerate :
                          COLORS.riskHigh
                      }}
                    >
                      Seguridad: {destination.safetyScore}/100
                    </Chip>
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  <Text style={styles.riskSectionTitle}>
                    Riesgos principales en {getMonths().find(m => m.value === currentMonth)?.label}
                  </Text>
                  
                  {destination.weatherRisks && destination.weatherRisks.length > 0 ? (
                    destination.weatherRisks.map((risk, index) => (
                      <Animated.View 
                        key={`${risk.type}-${index}`}
                        entering={FadeIn.delay(index * 200)}
                        style={styles.riskItem}
                      >
                        <View style={styles.riskHeader}>
                          <View style={styles.riskTitleContainer}>
                            <MaterialCommunityIcons 
                              name={getRiskIcon(risk.type)} 
                              size={24} 
                              color={getRiskColor(risk.severity)} 
                            />
                            <Text style={styles.riskTitle}>
                              {risk.type === 'hurricane' ? 'Huracanes' :
                               risk.type === 'flood' ? 'Inundaciones' :
                               risk.type === 'extreme_heat' ? 'Calor Extremo' :
                               risk.type === 'wildfire' ? 'Incendios' :
                               risk.type === 'avalanche' ? 'Avalanchas' :
                               risk.type === 'blizzard' ? 'Ventiscas' :
                               risk.type === 'drought' ? 'Sequías' : 'Riesgo desconocido'}
                            </Text>
                          </View>
                          
                          <Chip 
                            style={{
                              backgroundColor: getRiskColor(risk.severity) + '30',
                            }}
                            textStyle={{
                              color: getRiskColor(risk.severity),
                              fontWeight: 'bold'
                            }}
                          >
                            {risk.severity === RiskLevel.LOW ? 'Bajo' :
                             risk.severity === RiskLevel.MODERATE ? 'Moderado' :
                             risk.severity === RiskLevel.HIGH ? 'Alto' :
                             risk.severity === RiskLevel.EXTREME ? 'Extremo' : 'Desconocido'}
                          </Chip>
                        </View>
                        
                        <Text style={styles.riskDescription}>
                          {risk.details}
                        </Text>
                        
                        {risk.months && risk.months.length > 0 && (
                          <View style={styles.monthsContainer}>
                            <Text style={styles.monthsLabel}>Meses de mayor riesgo:</Text>
                            <View style={styles.monthChipsContainer}>
                              {risk.months.map((month) => (
                                <Chip 
                                  key={`month-${month}`}
                                  style={[
                                    styles.monthChip,
                                    month === currentMonth ? { backgroundColor: getRiskColor(risk.severity) + '30' } : null
                                  ]}
                                  textStyle={[
                                    styles.monthChipText,
                                    month === currentMonth ? { color: getRiskColor(risk.severity) } : null
                                  ]}
                                >
                                  {getMonths().find(m => m.value === month)?.label.substring(0, 3)}
                                </Chip>
                              ))}
                            </View>
                          </View>
                        )}
                        
                        {index < destination.weatherRisks.length - 1 && (
                          <Divider style={styles.riskDivider} />
                        )}
                      </Animated.View>
                    ))
                  ) : (
                    <Text style={styles.noRisksText}>
                      No hay riesgos climáticos significativos para este destino en este mes.
                    </Text>
                  )}
                  
                  <Divider style={styles.divider} />
                  
                  <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationTitle}>Recomendación de Seguro</Text>
                    <Text style={styles.recommendationText}>
                      {insuranceRecommendation}
                    </Text>
                    
                    <Button 
                      mode="contained" 
                      onPress={viewInsurancePlans}
                      style={styles.insuranceButton}
                    >
                      Ver seguros recomendados
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={styles.noDestinationContainer}>
                  <Text style={styles.noDestinationText}>
                    Selecciona un destino para ver su información de riesgos.
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
        
        {/* Safety Tab Specific Content */}
        <Animated.View style={safetyContentStyle}>
          {/* Safety Info Card */}
          <Card style={styles.safetyCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Información de Seguridad</Text>
              
              {destination ? (
                <View style={styles.safetyInfoContainer}>
                  {/* Overall Safety Score */}
                  <View style={styles.safetyScoreContainer}>
                    <Text style={styles.safetyScoreLabel}>Puntuación general de seguridad</Text>
                    <View style={styles.safetyScoreWrapper}>
                      <Animated.View style={[styles.safetyScoreBubble, animatedStyle]}>
                        <Text style={styles.safetyScoreValue}>{destination.safetyScore}</Text>
                      </Animated.View>
                    </View>
                    <ProgressBar 
                      progress={destination.safetyScore / 100} 
                      color={
                        destination.safetyScore > 80 ? COLORS.riskLow :
                        destination.safetyScore > 60 ? COLORS.riskModerate :
                        COLORS.riskHigh
                      }
                      style={styles.safetyProgressBar}
                    />
                    <Text style={styles.safetyScoreDescription}>
                      {destination.safetyScore > 80 ? 'Destino muy seguro con bajo riesgo para viajeros.' :
                       destination.safetyScore > 60 ? 'Destino moderadamente seguro. Tome precauciones normales.' :
                       'Destino con algunos riesgos significativos. Tome precauciones adicionales.'}
                    </Text>
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  {/* Safety Categories List */}
                  <View style={styles.safetyCategoriesContainer}>
                    <List.Item 
                      title="Criminalidad"
                      description="Información sobre índices de criminalidad y áreas a evitar."
                      left={props => <List.Icon {...props} icon="shield-alert" color={COLORS.primary} />}
                    />
                    <List.Item 
                      title="Riesgos sanitarios"
                      description="Recomendaciones de salud, vacunas y acceso a atención médica."
                      left={props => <List.Icon {...props} icon="medical-bag" color={COLORS.primary} />}
                    />
                    <List.Item 
                      title="Transportes"
                      description="Seguridad en transporte público y desplazamientos locales."
                      left={props => <List.Icon {...props} icon="car" color={COLORS.primary} />}
                    />
                    <List.Item 
                      title="Recomendaciones"
                      description="Consejos específicos para una estancia segura."
                      left={props => <List.Icon {...props} icon="information" color={COLORS.primary} />}
                    />
                  </View>
                  
                  <Divider style={styles.divider} />
                  
                  {/* Insurance Recommendation */}
                  <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationTitle}>Recomendación de Seguro</Text>
                    <Text style={styles.recommendationText}>
                      {insuranceRecommendation}
                    </Text>
                    
                    <Button 
                      mode="contained" 
                      onPress={viewInsurancePlans}
                      style={styles.insuranceButton}
                    >
                      Ver seguros recomendados
                    </Button>
                  </View>
                </View>
              ) : (
                <View style={styles.noDestinationContainer}>
                  <Text style={styles.noDestinationText}>
                    Selecciona un destino para ver su información de seguridad.
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>
      
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        style={styles.snackbar}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

// The DESTINATIONS array is imported from weatherRiskData.ts at the top of this file

export default WeatherRiskScreen;