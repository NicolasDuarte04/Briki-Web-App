import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card, Checkbox, Button, Divider, Chip } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';

import { MainStackParamList } from '../navigation/AppNavigator';
import { InsurancePlan } from '../types/insurance';
import { INSURANCE_PLANS } from '../data/insurancePlansData';
import { COLORS } from '../utils/theme';

type ComparePlansScreenNavigationProp = StackNavigationProp<MainStackParamList>;
type ComparePlansScreenRouteProp = RouteProp<MainStackParamList, 'ComparePlans'>;

const { width } = Dimensions.get('window');

const ComparePlansScreen = () => {
  const navigation = useNavigation<ComparePlansScreenNavigationProp>();
  const route = useRoute<ComparePlansScreenRouteProp>();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlans, setSelectedPlans] = useState<InsurancePlan[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  
  // Animation values
  const compareButtonScale = useSharedValue(1);
  const compareViewPosition = useSharedValue(height);
  
  // Populate plans based on filter criteria or use all plans
  useEffect(() => {
    // In a real app, this would fetch from API with filters
    setIsLoading(true);
    setTimeout(() => {
      // Apply any filters from route params if they exist
      if (route.params?.filterCriteria) {
        // Implement filtering logic here
        setPlans(INSURANCE_PLANS);
      } else {
        setPlans(INSURANCE_PLANS);
      }
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Handle plan selection for comparison
  const togglePlanSelection = (plan: InsurancePlan) => {
    const isSelected = selectedPlans.some(p => p.id === plan.id);
    
    if (isSelected) {
      // Remove plan from selection
      setSelectedPlans(selectedPlans.filter(p => p.id !== plan.id));
    } else {
      // Add plan to selection (max 3)
      if (selectedPlans.length < 3) {
        setSelectedPlans([...selectedPlans, plan]);
      }
    }
  };
  
  // Start comparison view animation
  const handleStartCompare = () => {
    // Animate the compare button when pressed
    compareButtonScale.value = withSpring(0.95, {}, () => {
      compareButtonScale.value = withSpring(1);
    });
    
    // Slide up the comparison view
    compareViewPosition.value = withTiming(0, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    setShowCompare(true);
  };
  
  // Close comparison view
  const handleCloseCompare = () => {
    // Slide down the comparison view
    compareViewPosition.value = withTiming(height, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    // Delay setting showCompare to false until animation completes
    setTimeout(() => {
      setShowCompare(false);
    }, 400);
  };
  
  // Animated styles
  const compareButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: compareButtonScale.value }],
    };
  });
  
  const compareViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: compareViewPosition.value }],
    };
  });
  
  // Format price display
  const formatPrice = (price: number): string => {
    return `$${price}`;
  };
  
  // Format medical coverage display
  const formatCoverage = (coverage: number): string => {
    if (coverage >= 1000000) {
      return `$${(coverage / 1000000).toFixed(1)}M`;
    } else if (coverage >= 1000) {
      return `$${(coverage / 1000).toFixed(0)}K`;
    }
    return `$${coverage}`;
  };
  
  // Render an individual plan card
  const renderPlanCard = ({ item }: { item: InsurancePlan }) => {
    const isSelected = selectedPlans.some(p => p.id === item.id);
    
    return (
      <Card 
        style={[
          styles.planCard, 
          isSelected ? styles.selectedPlanCard : null
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.providerContainer}>
            <Image 
              source={item.logo} 
              style={styles.providerLogo}
              resizeMode="contain"
            />
            <View style={styles.planInfo}>
              <Text style={styles.planName}>{item.name}</Text>
              <Text style={styles.providerName}>{item.provider}</Text>
            </View>
          </View>
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => togglePlanSelection(item)}
            color={COLORS.primary}
          />
        </View>
        
        <Card.Content>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Precio base:</Text>
            <Text style={styles.priceValue}>{formatPrice(item.basePrice)}</Text>
          </View>
          
          <View style={styles.coverageItem}>
            <View style={styles.coverageIcon}>
              <MaterialCommunityIcons 
                name="hospital-box" 
                size={22} 
                color={COLORS.primary}
              />
            </View>
            <View style={styles.coverageDetails}>
              <Text style={styles.coverageLabel}>Cobertura médica</Text>
              <Text style={styles.coverageValue}>
                {formatCoverage(item.medicalCoverage)}
              </Text>
            </View>
          </View>
          
          <View style={styles.coverageItem}>
            <View style={styles.coverageIcon}>
              <MaterialCommunityIcons 
                name="calendar-remove" 
                size={22} 
                color={COLORS.primary}
              />
            </View>
            <View style={styles.coverageDetails}>
              <Text style={styles.coverageLabel}>Cancelación</Text>
              <Text style={styles.coverageValue}>{item.tripCancellation}</Text>
            </View>
          </View>
          
          <View style={styles.coverageItem}>
            <View style={styles.coverageIcon}>
              <MaterialCommunityIcons 
                name="bag-suitcase" 
                size={22} 
                color={COLORS.primary}
              />
            </View>
            <View style={styles.coverageDetails}>
              <Text style={styles.coverageLabel}>Equipaje</Text>
              <Text style={styles.coverageValue}>${item.baggageProtection}</Text>
            </View>
          </View>
          
          {item.adventureActivities && (
            <Chip 
              style={styles.adventureChip}
              icon="hiking"
            >
              Actividades de aventura
            </Chip>
          )}
        </Card.Content>
        
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('PlanDetails', { planId: item.id })}
          >
            Ver detalles
          </Button>
          <Button 
            mode="contained"
            onPress={() => navigation.navigate('Checkout', { planId: item.id })}
          >
            Contratar
          </Button>
        </Card.Actions>
      </Card>
    );
  };
  
  // Render the comparison view
  const renderComparisonView = () => {
    if (!showCompare) return null;
    
    return (
      <Animated.View style={[styles.compareContainer, compareViewStyle]}>
        <View style={styles.compareHeader}>
          <Text style={styles.compareTitle}>Comparar Planes</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleCloseCompare}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.compareContent}>
          {/* Plan headers */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureHeaderText}>Características</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`header-${plan.id}`} style={styles.comparePlanCell}>
                <Image 
                  source={plan.logo} 
                  style={styles.comparePlanLogo}
                  resizeMode="contain"
                />
                <Text style={styles.comparePlanName}>{plan.name}</Text>
                <Text style={styles.comparePlanProvider}>{plan.provider}</Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Price comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Precio base</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`price-${plan.id}`} style={styles.comparePlanCell}>
                <Text style={styles.comparePlanPrice}>{formatPrice(plan.basePrice)}</Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Medical coverage comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Cobertura médica</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`medical-${plan.id}`} style={styles.comparePlanCell}>
                <Text style={styles.comparePlanFeature}>{formatCoverage(plan.medicalCoverage)}</Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Trip cancellation comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Cancelación</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`cancel-${plan.id}`} style={styles.comparePlanCell}>
                <Text style={styles.comparePlanFeature}>{plan.tripCancellation}</Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Baggage protection comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Protección de equipaje</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`baggage-${plan.id}`} style={styles.comparePlanCell}>
                <Text style={styles.comparePlanFeature}>${plan.baggageProtection}</Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Emergency evacuation comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Evacuación de emergencia</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`evac-${plan.id}`} style={styles.comparePlanCell}>
                <Text style={styles.comparePlanFeature}>
                  {plan.emergencyEvacuation ? formatCoverage(plan.emergencyEvacuation) : 'No incluido'}
                </Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Adventure activities comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Actividades de aventura</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`adventure-${plan.id}`} style={styles.comparePlanCell}>
                <MaterialCommunityIcons 
                  name={plan.adventureActivities ? "check-circle" : "close-circle"} 
                  size={24} 
                  color={plan.adventureActivities ? COLORS.success : COLORS.error} 
                />
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Rental car coverage comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Cobertura de auto rentado</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`car-${plan.id}`} style={styles.comparePlanCell}>
                <Text style={styles.comparePlanFeature}>
                  {plan.rentalCarCoverage ? `$${plan.rentalCarCoverage}` : 'No incluido'}
                </Text>
              </View>
            ))}
          </View>
          
          <Divider style={styles.divider} />
          
          {/* Rating comparison */}
          <View style={styles.compareRow}>
            <View style={styles.compareFeatureCell}>
              <Text style={styles.featureText}>Calificación</Text>
            </View>
            {selectedPlans.map(plan => (
              <View key={`rating-${plan.id}`} style={styles.comparePlanCell}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{plan.rating}</Text>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.reviewsText}>({plan.reviews})</Text>
                </View>
              </View>
            ))}
          </View>
          
          <View style={styles.compareButtons}>
            {selectedPlans.map(plan => (
              <Button
                key={`btn-${plan.id}`}
                mode="contained"
                style={styles.compareActionButton}
                onPress={() => navigation.navigate('Checkout', { planId: plan.id })}
              >
                Contratar {plan.name}
              </Button>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planes de Seguro</Text>
        <View style={styles.placeholder} />
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando planes de seguro...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <FlatList
            data={plans}
            renderItem={renderPlanCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
          
          {selectedPlans.length > 1 && (
            <Animated.View style={[styles.compareButtonContainer, compareButtonStyle]}>
              <Button
                mode="contained"
                icon="compare"
                onPress={handleStartCompare}
                style={styles.compareButton}
              >
                Comparar ({selectedPlans.length})
              </Button>
            </Animated.View>
          )}
        </View>
      )}
      
      {renderComparisonView()}
    </SafeAreaView>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Extra padding for the compare button
  },
  planCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLogo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  providerName: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  coverageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  coverageDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverageLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  coverageValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  adventureChip: {
    marginTop: 12,
    backgroundColor: COLORS.primaryLight,
  },
  cardActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  compareButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  compareButton: {
    borderRadius: 30,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  compareContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 10,
  },
  compareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  compareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  compareContent: {
    flex: 1,
  },
  compareRow: {
    flexDirection: 'row',
    minHeight: 60,
    alignItems: 'center',
  },
  compareFeatureCell: {
    width: width * 0.35,
    padding: 10,
    justifyContent: 'center',
  },
  featureHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.text,
  },
  comparePlanCell: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparePlanLogo: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  comparePlanName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  comparePlanProvider: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  comparePlanPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  comparePlanFeature: {
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  divider: {
    backgroundColor: COLORS.border,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 2,
  },
  reviewsText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  compareButtons: {
    padding: 16,
  },
  compareActionButton: {
    marginVertical: 8,
  },
});

export default ComparePlansScreen;