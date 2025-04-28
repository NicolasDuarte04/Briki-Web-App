import React, { useEffect, useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  StatusBar,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useQuery } from 'react-query';
import { Card, Button, ActivityIndicator, Surface } from 'react-native-paper';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { MainStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Trip } from '../types/insurance';
import { COLORS } from '../utils/theme';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<MainStackParamList>;

const HomeScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [refreshing, setRefreshing] = useState(false);
  
  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: 'clamp'
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp'
  });
  
  const headerTitleSize = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [28, 22],
    extrapolate: 'clamp'
  });
  
  const [animatedCards] = useState(() => 
    [...Array(3)].map(() => new Animated.Value(0))
  );
  
  // Animations for cards
  useEffect(() => {
    const animations = animatedCards.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 100 + (index * 100),
        useNativeDriver: true
      });
    });
    
    Animated.stagger(150, animations).start();
  }, []);

  // Fetch user's trips
  const { 
    data: trips, 
    isLoading, 
    isError, 
    refetch: refetchTrips 
  } = useQuery<Trip[]>(
    ['trips'], 
    async () => {
      const response = await api.get('/api/trips');
      return response.data;
    },
    {
      enabled: !!user,
    }
  );

  // Handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchTrips();
    setRefreshing(false);
  };

  const navigateToNewTrip = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('TripInfo');
  };

  const navigateToPlansList = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('InsurancePlans');
  };

  const navigateToWeatherRisk = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('WeatherRisk');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            height: headerHeight, 
            opacity: 1 
          }
        ]}
      >
        <Animated.View style={{ opacity: headerOpacity }}>
          <Text style={[styles.welcomeSmallText, { fontSize: 16 }]}>¡Bienvenido a</Text>
          <Text style={styles.headerBrandText}>Briki Travel</Text>
        </Animated.View>
        
        <Animated.Text style={[styles.welcomeText, { fontSize: headerTitleSize }]}>
          Hola, {user?.username || 'Viajero'}
        </Animated.Text>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Spacer to account for header */}
        <View style={{ height: 140 }} />
        
        {/* Action Cards Container */}
        <Surface style={styles.actionsContainer}>
          {/* Action Card 1 */}
          <Animated.View style={{
            transform: [
              { scale: animatedCards[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
              }) },
              { translateY: animatedCards[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
              }) }
            ],
            opacity: animatedCards[0].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
          }}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.primaryLight }]}
              onPress={navigateToNewTrip}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <FontAwesome5 name="plane-departure" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Nuevo Viaje</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Action Card 2 */}
          <Animated.View style={{
            transform: [
              { scale: animatedCards[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
              }) },
              { translateY: animatedCards[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
              }) }
            ],
            opacity: animatedCards[1].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
          }}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.secondary }]}
              onPress={navigateToPlansList}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="shield-check" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Ver Seguros</Text>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Action Card 3 */}
          <Animated.View style={{
            transform: [
              { scale: animatedCards[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
              }) },
              { translateY: animatedCards[2].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
              }) }
            ],
            opacity: animatedCards[2].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1]
            }),
          }}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: COLORS.accent }]}
              onPress={navigateToWeatherRisk}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <MaterialCommunityIcons name="weather-partly-cloudy" size={24} color={COLORS.white} />
              </View>
              <Text style={styles.actionText}>Riesgos Climáticos</Text>
            </TouchableOpacity>
          </Animated.View>
        </Surface>
        
        {/* My Trips Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mis Viajes</Text>
          <TouchableOpacity onPress={navigateToNewTrip}>
            <Text style={styles.seeAllText}>+ Nuevo</Text>
          </TouchableOpacity>
        </View>
        
        {isLoading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : isError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No se pudieron cargar tus viajes</Text>
            <Button mode="contained" onPress={onRefresh} style={styles.retryButton}>
              Reintentar
            </Button>
          </View>
        ) : trips && trips.length > 0 ? (
          trips.map((trip) => (
            <Card key={trip.id} style={styles.tripCard}>
              <Card.Content>
                <View style={styles.tripHeader}>
                  <View style={styles.tripDestination}>
                    <Text style={styles.originText}>{trip.origin}</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.primary} />
                    <Text style={styles.destinationText}>{trip.destination}</Text>
                  </View>
                  <Text style={styles.dateText}>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.tripDetails}>
                  <View style={styles.tripDetail}>
                    <MaterialCommunityIcons name="account-group" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>{trip.travelers} viajeros</Text>
                  </View>
                  
                  <View style={styles.tripDetail}>
                    <MaterialCommunityIcons name="calendar-range" size={18} color={COLORS.textSecondary} />
                    <Text style={styles.detailText}>
                      {Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24))} días
                    </Text>
                  </View>
                </View>
              </Card.Content>
              
              <Card.Actions style={styles.tripActions}>
                <Button mode="outlined" onPress={() => navigation.navigate('InsurancePlans')}>
                  Ver Seguros
                </Button>
              </Card.Actions>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="airplane" size={50} color={COLORS.grayLight} />
            <Text style={styles.emptyText}>Aún no tienes viajes planeados</Text>
            <Button mode="contained" onPress={navigateToNewTrip} style={styles.createButton}>
              Planear un Viaje
            </Button>
          </View>
        )}
        
        {/* Weather Risk Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Riesgos Climáticos</Text>
          <TouchableOpacity onPress={navigateToWeatherRisk}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        <Card style={styles.weatherCard}>
          <Card.Content>
            <Text style={styles.weatherCardTitle}>
              Comprueba los riesgos climáticos de tu destino
            </Text>
            <Text style={styles.weatherCardDescription}>
              Conoce los posibles riesgos climáticos de tu destino y recibe recomendaciones para tu seguro de viaje.
            </Text>
          </Card.Content>
          
          <Card.Actions style={styles.weatherCardActions}>
            <Button mode="contained" onPress={navigateToWeatherRisk}>
              Ver Riesgos
            </Button>
          </Card.Actions>
        </Card>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerBrandText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 10,
  },
  welcomeSmallText: {
    fontSize: 16,
    color: COLORS.white + 'DD',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  actionCard: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: width * 0.25,
  },
  actionIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    color: COLORS.white,
    marginTop: 8,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
  },
  tripCard: {
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
  },
  tripHeader: {
    marginBottom: 10,
  },
  tripDestination: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  originText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  destinationText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tripDetails: {
    flexDirection: 'row',
    marginTop: 10,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  tripActions: {
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: COLORS.white,
    elevation: 2,
  },
  weatherCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: COLORS.text,
  },
  weatherCardDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  weatherCardActions: {
    justifyContent: 'flex-end',
  },
});

export default HomeScreen;