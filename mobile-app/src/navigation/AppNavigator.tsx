import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import TripInfoScreen from '../screens/TripInfoScreen';
import InsurancePlansScreen from '../screens/InsurancePlansScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import WeatherRiskScreen from '../screens/WeatherRiskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../utils/theme';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// Define the main stack navigator param list
export type MainStackParamList = {
  Auth: undefined;
  Main: undefined;
  TripInfo: undefined;
  InsurancePlans: { tripId?: number; filter?: string };
  WeatherRisk: { destination?: string };
  Checkout: { planId: number };
  Profile: undefined;
  Settings: undefined;
};

// Create the navigators
const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

// Main tab navigator (after authentication)
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Plans" 
        component={InsurancePlansScreen} 
        options={{
          tabBarLabel: 'Seguros',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="shield-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Weather" 
        component={WeatherRiskScreen} 
        options={{
          tabBarLabel: 'Clima',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <MaterialCommunityIcons name="weather-partly-cloudy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  const { user, isLoading } = useAuth();

  // Show loading screen while checking auth status
  if (isLoading) {
    return null; // In a real app, you would show a splash screen here
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="TripInfo" 
            component={TripInfoScreen}
            options={{
              headerShown: true,
              title: 'Información del Viaje',
              headerTintColor: COLORS.white,
              headerStyle: { backgroundColor: COLORS.primary }
            }}
          />
          <Stack.Screen 
            name="InsurancePlans" 
            component={InsurancePlansScreen}
            options={{
              headerShown: true,
              title: 'Planes de Seguro',
              headerTintColor: COLORS.white,
              headerStyle: { backgroundColor: COLORS.primary }
            }}
          />
          <Stack.Screen 
            name="WeatherRisk" 
            component={WeatherRiskScreen}
            options={{
              headerShown: true,
              title: 'Riesgos Climáticos',
              headerTintColor: COLORS.white,
              headerStyle: { backgroundColor: COLORS.primary }
            }}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen}
            options={{
              headerShown: true,
              title: 'Finalizar Compra',
              headerTintColor: COLORS.white,
              headerStyle: { backgroundColor: COLORS.primary }
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Configuración',
              headerTintColor: COLORS.white,
              headerStyle: { backgroundColor: COLORS.primary }
            }}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tabBarLabel: {
    fontSize: 12,
  },
});

export default AppNavigator;