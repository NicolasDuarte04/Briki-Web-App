import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Platform, 
  TouchableOpacity, 
  Dimensions, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedText } from '../components/ThemedText';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  useAnimatedScrollHandler, 
  FadeIn, 
  FadeInDown, 
  SlideInRight, 
  Layout 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { usePlanRemovalAnimation } from '../hooks/usePlanRemovalAnimation';

import { insurancePlans } from '../data/insurance-plans';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = width < 375 ? width * 0.6 : width < 390 ? width * 0.65 : Math.min(280, width * 0.7);
const SPACING = width < 375 ? 12 : 16;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ComparePlansScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { fromCountry = 'Origin', toCountry = 'Destination', tripDuration = '7' } = params;

  const scrollX = useSharedValue(0);
  const scrollViewRef = useRef(null);
  const mainScrollViewRef = useRef(null);
  const tabScrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [removingPlanId, setRemovingPlanId] = useState(null);
  const autoScrollIntervalRef = useRef(null);

  const planIdsString = params.planIds?.toString() || '';
  const [selectedPlanIds, setSelectedPlanIds] = useState(planIdsString ? planIdsString.split(',') : []);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Safely find the corresponding insurance plans
  const selectedPlans = selectedPlanIds
    .map(id => insurancePlans.find(p => p.id === id))
    .filter(Boolean);
  
  const opacity = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      opacity.value = withTiming(1, { duration: 500 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll through plans every 3 seconds when there are 3 or more plans
  useEffect(() => {
    // Clear any existing interval when plans change
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Only auto-scroll if there are 3+ plans and auto-scroll is enabled
    if (selectedPlans.length > 2 && autoScrollEnabled && scrollViewRef.current) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (scrollViewRef.current) {
          // Calculate next plan index (loop back to beginning if at the end)
          const nextIndex = (activeTabIndex + 1) % selectedPlans.length;
          
          // Calculate position to scroll to
          const xPosition = nextIndex * (COLUMN_WIDTH + SPACING);
          
          // Scroll with animation
          scrollViewRef.current.scrollTo({ 
            x: xPosition, 
            animated: true 
          });
          
          // Update active tab index
          setActiveTabIndex(nextIndex);
        }
      }, 3000); // Auto-scroll every 3 seconds
    }

    // Cleanup interval on unmount
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [selectedPlans.length, activeTabIndex, autoScrollEnabled, COLUMN_WIDTH, SPACING]);

  // Function to scroll the tab into view when active tab changes
  useEffect(() => {
    if (tabScrollRef.current && selectedPlans.length > 4) {
      // Calculate the position to scroll to
      const tabWidth = 96; // Approximate width of each tab
      const scrollPosition = Math.max(0, (activeTabIndex * tabWidth) - width / 4);

      // Scroll the tab view to center the active tab
      tabScrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  }, [activeTabIndex, selectedPlans.length]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  // Calculate best value and best coverage plans
  const bestValue = selectedPlans.length > 0 
    ? selectedPlans.reduce((prev, curr) => prev.price < curr.price ? prev : curr, selectedPlans[0])
    : null;

  const bestCoverage = selectedPlans.length > 0
    ? selectedPlans.reduce((prev, curr) => {
        try {
          const prevTotal = Object.values(prev.coverage).reduce((a, b) => 
            a + (typeof b === 'number' ? b : 0), 0);
          const currTotal = Object.values(curr.coverage).reduce((a, b) => 
            a + (typeof b === 'number' ? b : 0), 0);
          return prevTotal > currTotal ? prev : curr;
        } catch (err) {
          console.error('Error calculating coverage total:', err);
          return prev;
        }
      }, selectedPlans[0])
    : null;

  // Single dot animations outside of the render loop
  const paginationDotAnimations = selectedPlans.map((_, index) => {
    return useAnimatedStyle(() => {
      const isActive = Math.round(scrollX.value / (COLUMN_WIDTH + SPACING)) === index;
      return {
        width: withTiming(isActive ? 16 : 8, { duration: 250 }),
        opacity: withTiming(isActive ? 1 : 0.5, { duration: 250 }),
        backgroundColor: isActive ? '#4B76E5' : '#BCC5DC',
      };
    });
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      // Update active tab based on scroll position
      const newIndex = Math.round(event.contentOffset.x / (COLUMN_WIDTH + SPACING));
      if (newIndex >= 0 && newIndex < selectedPlans.length) {
        setActiveTabIndex(newIndex);
      }
    },
    onBeginDrag: () => {
      // Temporarily disable auto-scroll when user manually scrolls
      setAutoScrollEnabled(false);
    },
    onEndDrag: () => {
      // Re-enable auto-scroll after manual scrolling stops
      setTimeout(() => setAutoScrollEnabled(true), 5000);
    }
  });

  const handleBackPress = useCallback(() => router.back(), []);

  const formatCurrency = useCallback((value) => typeof value === 'number' 
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") 
    : value, []);

  // Handle tab selection
  const handleTabPress = useCallback((index) => {
    if (scrollViewRef.current) {
      try {
        // Provide haptic feedback
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Calculate the x position to scroll to
        const xPosition = index * (COLUMN_WIDTH + SPACING);
        scrollViewRef.current.scrollTo({ x: xPosition, animated: true });
        setActiveTabIndex(index);
      } catch (error) {
        console.error('Error scrolling to plan:', error);
      }
    }
  }, [COLUMN_WIDTH, SPACING]);

  // Enhanced plan removal with better animation
  const handleRemovePlan = useCallback(async (planId, index) => {
    try {
      // Provide haptic feedback
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Show confirmation alert
      Alert.alert(
        "Remove Plan",
        "Are you sure you want to remove this plan from comparison?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Remove", 
            style: "destructive",
            onPress: () => {
              // Set the removing plan ID for animation
              setRemovingPlanId(planId);
              
              // Smooth animation before actual removal
              setTimeout(() => {
                // Remove the plan ID from selectedPlanIds
                const newSelectedPlanIds = selectedPlanIds.filter(id => id !== planId);

                // Update state
                setSelectedPlanIds(newSelectedPlanIds);
                setRemovingPlanId(null);

                // If removing the active tab, adjust the active tab index
                if (activeTabIndex >= index) {
                  const newActiveIndex = Math.max(0, activeTabIndex - 1);
                  setActiveTabIndex(newActiveIndex);

                  // Scroll to the new active tab if there are still plans left
                  if (newSelectedPlanIds.length > 0 && scrollViewRef.current) {
                    const xPosition = newActiveIndex * (COLUMN_WIDTH + SPACING);
                    scrollViewRef.current.scrollTo({ x: xPosition, animated: true });
                  }
                }
              }, 300); // Short delay for nice transition
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error removing plan:', error);
    }
  }, [activeTabIndex, selectedPlanIds, COLUMN_WIDTH, SPACING]);

  // Handle navigation to checkout
  const handleSelectPlan = useCallback((plan) => {
    router.push({
      pathname: '/checkout',
      params: { 
        plan: JSON.stringify(plan),
        fromCountry,
        toCountry,
        tripDuration
      }
    });
  }, [fromCountry, toCountry, tripDuration]);

  // Render coverage item component
  const renderCoverageItem = useCallback(({plan, keyName, value, index}) => {
    const isHighestValue = typeof value === 'number' && 
      selectedPlans.every(p => 
        typeof p.coverage[keyName] === 'number' ? p.coverage[keyName] <= value : true
      );

    return (
      <View 
        key={`${plan.id}-${keyName}`} 
        style={[
          styles.coverageItem,
          index % 2 === 0 && styles.coverageItemAlternate
        ]}
      >
        <View style={styles.coverageValueContainer}>
          {typeof value === 'number' ? (
            <ThemedText style={[
              styles.coverageValue,
              isHighestValue && styles.highestCoverageValue
            ]}>
              ${formatCurrency(value)}
            </ThemedText>
          ) : (
            <View style={styles.coverageTextContainer}>
              <Ionicons 
                name={value === "Included" ? "checkmark-circle" : "close-circle"} 
                size={18} 
                color={value === "Included" ? "#34C759" : "#FF3B30"} 
              />
              <ThemedText style={[
                styles.coverageTextValue,
                value !== "Included" && styles.coverageNotIncluded
              ]}>
                {value}
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    );
  }, [selectedPlans, formatCurrency]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4B76E5" />
          <ThemedText style={styles.loadingText}>Preparing plan comparison...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <StatusBar style="dark" />
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back to available plans"
          >
            <Ionicons name="chevron-back" size={24} color="#4B76E5" />
          </TouchableOpacity>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Compare Plans</ThemedText>
          </View>
        </View>

        <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.noPlansContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" style={styles.noPlansIcon} />
          <ThemedText style={styles.noPlansText}>{error}</ThemedText>
          <TouchableOpacity 
            style={styles.backToPlansButton}
            onPress={handleBackPress}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#4B76E5', '#3D68D8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <ThemedText style={styles.backToPlansButtonText}>
                Back to Available Plans
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  if (!selectedPlans || selectedPlans.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        <StatusBar style="dark" />
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back to available plans"
          >
            <Ionicons name="chevron-back" size={24} color="#4B76E5" />
          </TouchableOpacity>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Compare Plans</ThemedText>
          </View>
        </View>

        <Animated.View entering={FadeIn.delay(200).duration(500)} style={styles.noPlansContainer}>
          <Ionicons name="information-circle-outline" size={60} color="#4B76E5" style={styles.noPlansIcon} />
          <ThemedText style={styles.noPlansText}>
            No plans available to compare. Please go back and select some plans.
          </ThemedText>
          <TouchableOpacity 
            style={styles.backToPlansButton}
            onPress={handleBackPress}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#4B76E5', '#3D68D8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <ThemedText style={styles.backToPlansButtonText}>
                Back to Available Plans
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Now we're sure we have valid plans to display
  const firstPlan = selectedPlans[0];
  const coverageCategories = Object.keys(firstPlan.coverage || {});

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
      <StatusBar style="dark" />

      {/* Header background gradient */}
      <View style={styles.headerBackground}>
        <LinearGradient
          colors={['rgba(75, 118, 229, 0.08)', 'rgba(255, 255, 255, 0)']}
          style={styles.headerGradient}
        />
      </View>

      <ScrollView
        ref={mainScrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainScrollContent}
        bounces={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back to available plans"
          >
            <Ionicons name="chevron-back" size={24} color="#4B76E5" />
          </TouchableOpacity>
          <Animated.View 
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.header}>
            <ThemedText style={styles.title}>Compare Plans</ThemedText>
            <ThemedText style={styles.subtitle}>
              {fromCountry} to {toCountry} • {tripDuration} days
            </ThemedText>
          </Animated.View>
        </View>
        
        {/* Message for single plan */}
        {selectedPlans.length === 1 && (
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={styles.singlePlanMessage}
          >
            <Ionicons name="information-circle" size={20} color="#FF9500" />
            <ThemedText style={styles.singlePlanText}>
              You need 2+ plans to compare. Add more from available plans.
            </ThemedText>
          </Animated.View>
        )}
        
        {/* Tab Bar Selector - with horizontal scroll if many plans */}
        <ScrollView 
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContainer}
        >
          <Animated.View 
            entering={FadeInDown.delay(150).duration(400)}
            style={styles.tabBarContainer}
          >
            {selectedPlans.map((plan, index) => (
              <TouchableOpacity
                key={`tab-${plan.id}`}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTabIndex === index }}
                accessibilityLabel={`${plan.provider} tab`}
                style={[
                  styles.tab,
                  activeTabIndex === index && styles.activeTab
                ]}
                onPress={() => handleTabPress(index)}
                activeOpacity={0.7}
              >
                <ThemedText 
                  style={[
                    styles.tabText,
                    activeTabIndex === index && styles.activeTabText
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {plan.provider}
                </ThemedText>
                {activeTabIndex === index && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>

        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.instructionsContainer}
        >
          <Ionicons name="swap-horizontal" size={18} color="#4B76E5" />
          <ThemedText style={styles.instructions}>
            Swipe horizontally to compare all {selectedPlans.length} plans
          </ThemedText>
        </Animated.View>

        <Animated.ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.horizontalScrollContent,
            { gap: SPACING } // Use responsive spacing
          ]}
          decelerationRate="fast"
          snapToInterval={COLUMN_WIDTH + SPACING}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          <View style={styles.compareGrid}>
            {/* First column: Category labels */}
            <Animated.View 
              entering={SlideInRight.delay(200).springify()}
              style={[styles.labelsColumn, { marginRight: SPACING / 2 }]}
            >
              <View style={styles.labelHeaderPlaceholder} />
              <View style={styles.coverageLabelsContainer}>
                {coverageCategories.map((key) => (
                  <View key={`label-${key}`} style={styles.coverageLabelRow}>
                    <ThemedText style={styles.coverageCategoryLabel}>
                      {key}
                    </ThemedText>
                  </View>
                ))}

                {/* Added region and description labels */}
                <View style={styles.extraInfoRow}>
                  <ThemedText style={styles.coverageCategoryLabel}>
                    Region
                  </ThemedText>
                </View>
                <View style={styles.extraInfoRow}>
                  <ThemedText style={styles.coverageCategoryLabel}>
                    Description
                  </ThemedText>
                </View>
              </View>
            </Animated.View>

            {/* Plan columns */}
            {selectedPlans.map((plan, planIndex) => {
              const isPlanBestValue = bestValue && plan.id === bestValue.id;
              const isPlanBestCoverage = bestCoverage && plan.id === bestCoverage.id;
              
              // Get removal animation style for this specific plan OUTSIDE the JSX
              const removalStyle = usePlanRemovalAnimation(plan.id, removingPlanId);
              
              return (
                <Animated.View 
                  key={plan.id} 
                  entering={SlideInRight.delay(300 + planIndex * 100).springify()}
                  layout={Layout.springify()}
                  style={[
                    styles.planColumn, 
                    animatedStyle,
                    removalStyle, // Using the pre-computed style for this plan
                    { width: COLUMN_WIDTH } // Responsive width
                  ]}
                >
                  <View style={[
                    styles.planHeader,
                    isPlanBestValue && styles.bestValueHeader,
                    isPlanBestCoverage && styles.bestCoverageHeader
                  ]}>
                    {/* Close Button */}
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemovePlan(plan.id, planIndex)}
                      accessibilityLabel={`Remove ${plan.provider} plan`}
                      accessibilityRole="button"
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      <Ionicons name="close" size={18} color="#666666" />
                    </TouchableOpacity>
                    
                    <View style={styles.planHeaderContent}>
                      <ThemedText style={styles.providerName} numberOfLines={1} ellipsizeMode="tail">
                        {plan.provider}
                      </ThemedText>
                      <View style={styles.priceContainer}>
                        <ThemedText style={styles.price}>${formatCurrency(plan.price)}</ThemedText>
                        <ThemedText style={styles.perPerson}>per person</ThemedText>
                      </View>
                      {plan.rating && (
                        <View style={styles.ratingContainer}>
                          <Ionicons name="star" size={16} color="#F8B400" />
                          <ThemedText style={styles.ratingText}>
                            {typeof plan.rating === 'number' ? plan.rating.toFixed(1) : plan.rating}
                          </ThemedText>
                        </View>
                      )}
                    </View>

                    <View style={styles.badgeContainer}>
                      {isPlanBestValue && (
                        <View style={[styles.badge, styles.bestValueBadge]}>
                          <Ionicons name="cash-outline" size={12} color="#FFFFFF" style={styles.badgeIcon} />
                          <ThemedText style={styles.badgeText}>Best Value</ThemedText>
                        </View>
                      )}
                      {isPlanBestCoverage && (
                        <View style={[styles.badge, styles.bestCoverageBadge]}>
                          <Ionicons name="shield-checkmark-outline" size={12} color="#FFFFFF" style={styles.badgeIcon} />
                          <ThemedText style={styles.badgeText}>Best Coverage</ThemedText>
                        </View>
                      )}
                      {plan.tag && (
                        <View style={[styles.badge, styles.planTagBadge]}>
                          <ThemedText style={styles.badgeText}>{plan.tag}</ThemedText>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.coverageList}>
                    {Object.entries(plan.coverage).map(([key, value], index) => (
                      renderCoverageItem({plan, keyName: key, value, index})
                    ))}

                    {/* Added region display */}
                    <View style={[styles.coverageItem, styles.coverageItemAlternate]}>
                      <View style={styles.coverageValueContainer}>
                        <ThemedText style={styles.coverageText}>
                          {plan.region || 'Global'}
                        </ThemedText>
                      </View>
                    </View>

                    {/* Added description display */}
                    <View style={styles.coverageItem}>
                      <View style={styles.coverageValueContainer}>
                        <ThemedText 
                          style={styles.coverageDescription} 
                          numberOfLines={3} 
                          ellipsizeMode="tail"
                        >
                          {plan.description || 'No description available'}
                        </ThemedText>
                      </View>
                    </View>
                  </View>

                  <AnimatedTouchable 
                    style={styles.selectButton}
                    onPress={() => handleSelectPlan(plan)}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${plan.provider} plan`}
                  >
                    <LinearGradient
                      colors={['#4B76E5', '#3D68D8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <ThemedText style={styles.selectButtonText}>Select Plan</ThemedText>
                      <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                    </LinearGradient>
                  </AnimatedTouchable>
                </Animated.View>
              );
            })}
          </View>
        </Animated.ScrollView>

        {/* Pagination dots - shown only when we have multiple plans */}
        {selectedPlans.length > 1 && (
          <View style={styles.paginationContainer}>
            {paginationDotAnimations.map((dotStyle, index) => (
              <Animated.View
                key={`dot-${index}`}
                style={[styles.paginationDot, dotStyle]}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainScrollContent: {
    flexGrow: 1,
  },
  headerBackground: {
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(75, 118, 229, 0.1)',
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  noPlansContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 60,
  },
  noPlansIcon: {
    marginBottom: 16,
  },
  noPlansText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToPlansButton: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToPlansButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  singlePlanMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  singlePlanText: {
    fontSize: 14,
    color: '#4B3600',
    marginLeft: 8,
    flex: 1,
  },
  tabScrollContainer: {
    paddingHorizontal: 12,
  },
  tabBarContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(75, 118, 229, 0.08)',
    marginHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    backgroundColor: 'rgba(75, 118, 229, 0.2)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B76E5',
    maxWidth: 120,
  },
  activeTabText: {
    fontWeight: '600',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: '#4B76E5',
    borderRadius: 1.5,
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: '#4B76E5',
    marginLeft: 6,
    fontWeight: '500',
  },
  horizontalScrollContent: {
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  compareGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  labelsColumn: {
    width: 130,
  },
  labelHeaderPlaceholder: {
    height: 130, // Match planHeader height
  },
  coverageLabelsContainer: {
    marginTop: 16,
  },
  coverageLabelRow: {
    height: 44,
    justifyContent: 'center',
    paddingLeft: 12,
    marginBottom: 2,
  },
  coverageCategoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  extraInfoRow: {
    height: 70, // Taller rows for region and description
    justifyContent: 'center',
    paddingLeft: 12,
    marginBottom: 2,
  },
  planColumn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  planHeader: {
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  bestValueHeader: {
    backgroundColor: 'rgba(52, 199, 89, 0.08)',
    borderColor: 'rgba(52, 199, 89, 0.3)',
  },
  bestCoverageHeader: {
    backgroundColor: 'rgba(75, 118, 229, 0.08)',
    borderColor: 'rgba(75, 118, 229, 0.3)',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  planHeaderContent: {
    alignItems: 'center',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4B76E5',
  },
  perPerson: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(248, 180, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F8B400',
    marginLeft: 4,
  },
  badgeContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueBadge: {
    backgroundColor: '#34C759',
  },
  bestCoverageBadge: {
    backgroundColor: '#4B76E5',
  },
  planTagBadge: {
    backgroundColor: '#FF9500',
  },
  badgeIcon: {
    marginRight: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  coverageList: {
    marginTop: 16,
  },
  coverageItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 2,
  },
  coverageItemAlternate: {
    backgroundColor: 'rgba(75, 118, 229, 0.05)',
  },
  coverageValueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  highestCoverageValue: {
    color: '#34C759',
    fontWeight: '700',
  },
  coverageTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverageTextValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#34C759',
    marginLeft: 4,
  },
  coverageNotIncluded: {
    color: '#FF3B30',
  },
  coverageText: {
    fontSize: 13,
    color: '#4B4B4B',
    fontWeight: '500',
    textAlign: 'center',
  },
  coverageDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 4,
    lineHeight: 16,
  },
  selectButton: {
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    // Background color and width are animated
  },
});