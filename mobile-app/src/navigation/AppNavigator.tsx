import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';

// Screens - will be created next
import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import TripInfoScreen from '../screens/TripInfoScreen';
import InsurancePlansScreen from '../screens/InsurancePlansScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import WeatherRiskScreen from '../screens/WeatherRiskScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Tab Icons
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../utils/theme';

// Define param lists for type safety
export type AuthStackParamList = {
  Auth: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  TripInfo: undefined;
  InsurancePlans: undefined;
  Checkout: { planId: number };
  WeatherRisk: undefined;
  Profile: undefined;
};

export type TabNavigatorParamList = {
  HomeTab: undefined;
  InsuranceTab: undefined;
  WeatherTab: undefined;
  ProfileTab: undefined;
};

// Create navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<TabNavigatorParamList>();

// Auth navigation when user is not logged in
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Auth" component={AuthScreen} />
    </AuthStack.Navigator>
  );
};

// Tab navigator for main app functionality
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'InsuranceTab') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'WeatherTab') {
            iconName = focused ? 'cloud' : 'cloud-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen 
        name="InsuranceTab" 
        component={InsurancePlansScreen} 
        options={{ title: 'Seguros' }}
      />
      <Tab.Screen 
        name="WeatherTab" 
        component={WeatherRiskScreen} 
        options={{ title: 'Clima' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

// Main stack navigator for all main screens
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerTintColor: COLORS.white,
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
      }}
    >
      <MainStack.Screen 
        name="Home" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen 
        name="TripInfo" 
        component={TripInfoScreen}
        options={{ title: 'Información del Viaje' }}
      />
      <MainStack.Screen 
        name="InsurancePlans" 
        component={InsurancePlansScreen}
        options={{ title: 'Planes de Seguro' }}
      />
      <MainStack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ title: 'Pago' }}
      />
      <MainStack.Screen 
        name="WeatherRisk" 
        component={WeatherRiskScreen}
        options={{ title: 'Riesgos Climáticos' }}
      />
      <MainStack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Mi Perfil' }}
      />
    </MainStack.Navigator>
  );
};

// Root navigator that handles auth state
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // TODO: Return a loading screen component
    return null;
  }

  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;