import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInUp,
  FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeContext } from '../context/ThemeContext';
import { useThemeColor } from '../hooks/useThemeColor';

const { width } = Dimensions.get('window');
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Sample data for active plans 
// In a real app, this would come from an API or local storage
const activePlansSampleData = [
  {
    id: 'plan1',
    provider: 'Allianz Travel',
    tag: 'Popular',
    travelerName: 'Maria Rodriguez',
    startDate: '2025-05-15',
    endDate: '2025-05-22',
    destination: 'Mexico City, Mexico',
    travelers: 2,
    purchaseDate: '2025-04-30',
    totalPaid: 142.50,
    policyNumber: 'ALZ-45872-MX',
    coverageLevel: 'Comprehensive'
  },
  {
    id: 'plan2',
    provider: 'World Nomads',
    tag: 'Best Value',
    travelerName: 'Maria Rodriguez',
    startDate: '2025-07-10',
    endDate: '2025-07-24',
    destination: 'Cartagena, Colombia',
    travelers: 1,
    purchaseDate: '2025-05-01',
    totalPaid: 89.99,
    policyNumber: 'WN-78125-CO',
    coverageLevel: 'Standard'
  },
  {
    id: 'plan3',
    provider: 'AXA Assistance',
    tag: 'Premium',
    travelerName: 'Maria Rodriguez',
    startDate: '2025-08-05',
    endDate: '2025-08-12',
    destination: 'Bogotá, Colombia',
    travelers: 4,
    purchaseDate: '2025-05-02',
    totalPaid: 378.25,
    policyNumber: 'AXA-12453-CO',
    coverageLevel: 'Platinum'
  }
];

export default function ActivePlansScreen() {
  const insets = useSafeAreaInsets();
  const [activePlans, setActivePlans] = useState(activePlansSampleData);
  const [isLoading, setIsLoading] = useState(true);

  // Theme context
  const { theme } = useThemeContext();
  const isDarkMode = theme === 'dark';
  
  // Themed colors
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');
  const warningColor = isDarkMode ? '#FFB800' : '#F8B400'; // Star color
  const successColor = isDarkMode ? '#34C759' : '#34C759'; // Keep success green consistent

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const calculateTripDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleViewDetails = async (planId) => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      
      // Navigate to plan details
      // For now, this is a placeholder route
      router.push({
        pathname: '/plan-details',
        params: { planId }
      });
    } catch (error) {
      console.error('Error navigating to plan details:', error);
    }
  };

  const handleBrowsePlans = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      
      router.push('/available-plans');
    } catch (error) {
      console.error('Error navigating to available plans:', error);
    }
  };

  const renderPlanCard = ({ item, index }) => {
    const tagStyles = getTagStyles(item.tag);
    const tripDuration = calculateTripDuration(item.startDate, item.endDate);
    
    return (
      <Animated.View
        entering={FadeInUp.delay(100 + index * 100).springify()}
        style={[styles.planCard, { backgroundColor: cardColor, borderColor: borderColor }]}
      >
        <View style={styles.planHeader}>
          <View style={styles.providerContainer}>
            <ThemedText style={styles.providerName}>{item.provider}</ThemedText>
            <View style={styles.tagBadgeContainer}>
              <View style={[styles.tagBadge, tagStyles.container]}>
                <ThemedText style={[styles.tagText, tagStyles.text]}>{item.tag}</ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.policyNumberContainer}>
            <ThemedText style={[styles.policyLabel, { color: secondaryTextColor }]}>Policy #:</ThemedText>
            <ThemedText style={styles.policyNumber}>{item.policyNumber}</ThemedText>
          </View>
        </View>
        
        <View style={[styles.divider, { backgroundColor: borderColor }]} />
        
        <View style={styles.planDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={16} color={secondaryTextColor} />
            <ThemedText style={[styles.detailText, { color: textColor }]}>
              {item.travelerName} {item.travelers > 1 ? `+ ${item.travelers - 1} others` : ''}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={secondaryTextColor} />
            <ThemedText style={[styles.detailText, { color: textColor }]}>
              {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={secondaryTextColor} />
            <ThemedText style={[styles.detailText, { color: textColor }]}>
              {item.destination}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="timer-outline" size={16} color={secondaryTextColor} />
            <ThemedText style={[styles.detailText, { color: textColor }]}>
              {tripDuration} days · {item.travelers} {item.travelers === 1 ? 'traveler' : 'travelers'}
            </ThemedText>
          </View>
        </View>
        
        <View style={styles.planFooter}>
          <View style={styles.purchaseInfo}>
            <ThemedText style={[styles.purchaseDate, { color: secondaryTextColor }]}>
              Purchased {formatDate(item.purchaseDate)}
            </ThemedText>
            <ThemedText style={[styles.totalPaid, { color: primaryColor }]}>
              ${formatCurrency(item.totalPaid)}
            </ThemedText>
          </View>
          
          <TouchableOpacity 
            style={[
              styles.viewDetailsButton, 
              { borderColor: primaryColor, backgroundColor: isDarkMode ? 'rgba(75, 118, 229, 0.1)' : 'rgba(75, 118, 229, 0.05)' }
            ]}
            onPress={() => handleViewDetails(item.id)}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.viewDetailsText, { color: primaryColor }]}>
              View Details
            </ThemedText>
            <Ionicons name="chevron-forward" size={16} color={primaryColor} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const getTagStyles = (tag) => {
    switch(tag) {
      case 'Best Value':
        return {
          container: { backgroundColor: isDarkMode ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.1)' },
          text: { color: successColor }
        };
      case 'Popular':
        return {
          container: { backgroundColor: isDarkMode ? 'rgba(75, 118, 229, 0.15)' : 'rgba(75, 118, 229, 0.1)' },
          text: { color: primaryColor }
        };
      case 'Premium':
        return {
          container: { backgroundColor: isDarkMode ? 'rgba(248, 180, 0, 0.15)' : 'rgba(248, 180, 0, 0.1)' },
          text: { color: warningColor }
        };
      default:
        return {
          container: { backgroundColor: isDarkMode ? 'rgba(75, 118, 229, 0.15)' : 'rgba(75, 118, 229, 0.1)' },
          text: { color: primaryColor }
        };
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor, paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={styles.headerContainer}>
          <ThemedText style={styles.headerTitle}>My Active Plans</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <Animated.View entering={FadeIn.duration(800)}>
            <Ionicons name="hourglass-outline" size={48} color={primaryColor} />
          </Animated.View>
          <ThemedText style={[styles.loadingText, { color: secondaryTextColor }]}>
            Loading your active plans...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (activePlans.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor, paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <StatusBar style={isDarkMode ? "light" : "dark"} />
        <View style={styles.headerContainer}>
          <ThemedText style={styles.headerTitle}>My Active Plans</ThemedText>
        </View>
        <Animated.View 
          entering={FadeIn.duration(800)}
          style={styles.emptyStateContainer}
        >
          <Ionicons name="document-text-outline" size={64} color={secondaryTextColor} />
          <ThemedText style={styles.emptyStateTitle}>No Active Plans</ThemedText>
          <ThemedText style={[styles.emptyStateText, { color: secondaryTextColor }]}>
            You don't have any active insurance plans. Browse and purchase plans to protect your next adventure.
          </ThemedText>
          <TouchableOpacity
            style={styles.browsePlansButton}
            onPress={handleBrowsePlans}
          >
            <LinearGradient
              colors={['#4B76E5', '#3D68D8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.browsePlansGradient}
            >
              <ThemedText style={[styles.browsePlansText, { color: buttonTextColor }]}>
                Browse Plans
              </ThemedText>
              <Ionicons name="arrow-forward" size={18} color={buttonTextColor} style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor, paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Header background gradient */}
      <View style={styles.headerBackgroundContainer}>
        <LinearGradient
          colors={isDarkMode 
            ? ['rgba(75, 118, 229, 0.12)', 'rgba(0, 0, 0, 0)']
            : ['rgba(75, 118, 229, 0.08)', 'rgba(255, 255, 255, 0)']}
          style={styles.headerGradient}
        />
      </View>
      
      <View style={styles.headerContainer}>
        <ThemedText style={styles.headerTitle}>My Active Plans</ThemedText>
      </View>
      
      <AnimatedFlatList
        data={activePlans}
        renderItem={renderPlanCard}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.listContent, 
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        entering={FadeIn.delay(200).duration(400)}
      />
      
      <TouchableOpacity
        style={[
          styles.addPlanButton, 
          { backgroundColor: primaryColor, bottom: insets.bottom + 20 }
        ]}
        activeOpacity={0.8}
        onPress={handleBrowsePlans}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    zIndex: -1,
  },
  headerGradient: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    padding: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 16,
  },
  planCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  planHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  providerContainer: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tagBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  policyNumberContainer: {
    alignItems: 'flex-end',
  },
  policyLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  policyNumber: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  planDetails: {
    padding: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  planFooter: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  totalPaid: {
    fontSize: 18,
    fontWeight: '700',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  addPlanButton: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: -40,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  browsePlansButton: {
    width: '100%',
    maxWidth: 250,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4B76E5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  browsePlansGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  browsePlansText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});