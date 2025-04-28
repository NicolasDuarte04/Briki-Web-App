import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Card, Divider, ProgressBar } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { MainStackParamList } from '../navigation/AppNavigator';
import { InsurancePlan } from '../types/insurance';
import { REAL_INSURANCE_PLANS } from '../data/realInsurancePlansData';
import { COLORS } from '../utils/theme';

type PlanDetailsScreenNavigationProp = StackNavigationProp<MainStackParamList>;
type PlanDetailsScreenRouteProp = RouteProp<MainStackParamList, 'PlanDetails'>;

const PlanDetailsScreen = () => {
  const navigation = useNavigation<PlanDetailsScreenNavigationProp>();
  const route = useRoute<PlanDetailsScreenRouteProp>();
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const featureItemOpacity = useSharedValue(0);
  const priceCardScale = useSharedValue(0.95);
  
  // Fetch plan details
  useEffect(() => {
    const fetchPlan = () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      const foundPlan = REAL_INSURANCE_PLANS.find(p => p.id === route.params.planId);
      
      if (foundPlan) {
        setPlan(foundPlan);
      }
      
      setIsLoading(false);
    };
    
    fetchPlan();
  }, [route.params.planId]);
  
  // Start animations when plan is loaded
  useEffect(() => {
    if (plan) {
      // Animate header
      headerOpacity.value = withTiming(1, { duration: 500 });
      
      // Animate content with delay
      contentOpacity.value = withDelay(
        200, 
        withTiming(1, { duration: 600 })
      );
      
      // Animate feature items with sequence
      featureItemOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 800 })
      );
      
      // Animate price card
      priceCardScale.value = withDelay(
        600,
        withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 200 })
        )
      );
    }
  }, [plan]);
  
  // Animated styles
  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });
  
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });
  
  const featureItemStyle = useAnimatedStyle(() => {
    return {
      opacity: featureItemOpacity.value,
    };
  });
  
  const priceCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: priceCardScale.value }],
    };
  });
  
  // Format currency
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };
  
  // Format coverage display
  const formatCoverage = (coverage: number): string => {
    if (coverage >= 1000000) {
      return `$${(coverage / 1000000).toFixed(1)}M`;
    } else if (coverage >= 1000) {
      return `$${(coverage / 1000).toFixed(0)}K`;
    }
    return `$${coverage}`;
  };
  
  if (!plan) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <Text style={styles.loadingText}>
          {isLoading ? 'Cargando detalles del plan...' : 'Plan no encontrado'}
        </Text>
      </SafeAreaView>
    );
  }
  
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
        <Text style={styles.headerTitle}>Detalles del Plan</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.planHeader, headerStyle]}>
          <Image 
            source={plan.logo} 
            style={styles.providerLogo}
            resizeMode="contain"
          />
          <View style={styles.planInfo}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.providerName}>{plan.provider}</Text>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>{plan.rating}</Text>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.reviewCount}>({plan.reviews} reseñas)</Text>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View style={[styles.planDescription, contentStyle]}>
          <Text style={styles.descriptionText}>{plan.description}</Text>
        </Animated.View>
        
        <Animated.View style={[styles.section, priceCardStyle]}>
          <Card style={styles.priceCard}>
            <Card.Content>
              <Text style={styles.priceTitle}>Precio base</Text>
              <Text style={styles.priceValue}>{formatCurrency(plan.basePrice)}</Text>
              <Text style={styles.priceNote}>
                por persona / día
              </Text>
              
              <Button 
                mode="contained" 
                style={styles.contractButton}
                onPress={() => navigation.navigate('Checkout', { planId: plan.id })}
              >
                Contratar ahora
              </Button>
            </Card.Content>
          </Card>
        </Animated.View>
        
        <Animated.View style={[styles.section, contentStyle]}>
          <Text style={styles.sectionTitle}>Coberturas Principales</Text>
          
          <Card style={styles.coverageCard}>
            <Card.Content>
              {/* Medical coverage */}
              <View style={styles.coverageItem}>
                <View style={styles.coverageIconContainer}>
                  <MaterialCommunityIcons 
                    name="hospital-box" 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.coverageInfo}>
                  <Text style={styles.coverageTitle}>Asistencia médica</Text>
                  <Text style={styles.coverageValue}>
                    {formatCoverage(plan.medicalCoverage)}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              {/* Trip cancellation */}
              <View style={styles.coverageItem}>
                <View style={styles.coverageIconContainer}>
                  <MaterialCommunityIcons 
                    name="calendar-remove" 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.coverageInfo}>
                  <Text style={styles.coverageTitle}>Cancelación de viaje</Text>
                  <Text style={styles.coverageValue}>{plan.tripCancellation}</Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              {/* Baggage protection */}
              <View style={styles.coverageItem}>
                <View style={styles.coverageIconContainer}>
                  <MaterialCommunityIcons 
                    name="bag-suitcase" 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.coverageInfo}>
                  <Text style={styles.coverageTitle}>Protección de equipaje</Text>
                  <Text style={styles.coverageValue}>${plan.baggageProtection}</Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              {/* Emergency evacuation */}
              <View style={styles.coverageItem}>
                <View style={styles.coverageIconContainer}>
                  <MaterialCommunityIcons 
                    name="helicopter" 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.coverageInfo}>
                  <Text style={styles.coverageTitle}>Evacuación de emergencia</Text>
                  <Text style={styles.coverageValue}>
                    {plan.emergencyEvacuation 
                      ? formatCoverage(plan.emergencyEvacuation) 
                      : 'No incluido'}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              {/* Adventure activities */}
              <View style={styles.coverageItem}>
                <View style={styles.coverageIconContainer}>
                  <MaterialCommunityIcons 
                    name="hiking" 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.coverageInfo}>
                  <Text style={styles.coverageTitle}>Actividades de aventura</Text>
                  <Text style={styles.coverageValue}>
                    {plan.adventureActivities ? 'Incluido' : 'No incluido'}
                  </Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              {/* Rental car */}
              <View style={styles.coverageItem}>
                <View style={styles.coverageIconContainer}>
                  <MaterialCommunityIcons 
                    name="car" 
                    size={24} 
                    color={COLORS.primary} 
                  />
                </View>
                <View style={styles.coverageInfo}>
                  <Text style={styles.coverageTitle}>Cobertura para auto rentado</Text>
                  <Text style={styles.coverageValue}>
                    {plan.rentalCarCoverage 
                      ? `$${plan.rentalCarCoverage}` 
                      : 'No incluido'}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
        
        <Animated.View style={[styles.section, featureItemStyle]}>
          <Text style={styles.sectionTitle}>Características Incluidas</Text>
          
          <Card style={styles.featuresCard}>
            <Card.Content>
              {plan.features.map((feature, index) => (
                <View key={`feature-${index}`} style={styles.featureItem}>
                  <Ionicons 
                    name="checkmark-circle" 
                    size={20} 
                    color={COLORS.success} 
                    style={styles.featureIcon}
                  />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </Animated.View>
        
        <Animated.View style={[styles.section, featureItemStyle]}>
          <Text style={styles.sectionTitle}>Restricciones y Exclusiones</Text>
          
          <Card style={styles.restrictionsCard}>
            <Card.Content>
              {plan.restrictions.map((restriction, index) => (
                <View key={`restriction-${index}`} style={styles.restrictionItem}>
                  <Ionicons 
                    name="alert-circle" 
                    size={20} 
                    color={COLORS.warning} 
                    style={styles.restrictionIcon}
                  />
                  <Text style={styles.restrictionText}>{restriction}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </Animated.View>
        
        <View style={styles.footer}>
          <Button 
            mode="contained"
            style={styles.footerButton}
            onPress={() => navigation.navigate('Checkout', { planId: plan.id })}
          >
            Contratar {plan.name}
          </Button>
          
          <TouchableOpacity 
            style={styles.compareLink}
            onPress={() => navigation.navigate('ComparePlans')}
          >
            <Text style={styles.compareLinkText}>Comparar con otros planes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
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
  scrollView: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  providerLogo: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  planDescription: {
    padding: 20,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    marginLeft: 4,
  },
  priceCard: {
    borderRadius: 12,
    elevation: 4,
    backgroundColor: COLORS.primary,
  },
  priceTitle: {
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  priceNote: {
    fontSize: 14,
    color: COLORS.white + 'CC',
    marginBottom: 16,
  },
  contractButton: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
  },
  coverageCard: {
    borderRadius: 12,
    elevation: 2,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  coverageIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coverageInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coverageTitle: {
    fontSize: 16,
    color: COLORS.text,
  },
  coverageValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
  },
  divider: {
    backgroundColor: COLORS.border,
  },
  featuresCard: {
    borderRadius: 12,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  restrictionsCard: {
    borderRadius: 12,
    elevation: 2,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restrictionIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  restrictionText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  footer: {
    padding: 16,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  footerButton: {
    borderRadius: 30,
    paddingVertical: 6,
  },
  compareLink: {
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
  },
  compareLinkText: {
    fontSize: 16,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});

export default PlanDetailsScreen;