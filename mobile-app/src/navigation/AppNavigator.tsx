import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

// Import screens
// You'll need to create these screens
import HomeScreen from '../screens/HomeScreen';
import InsurancePlansScreen from '../screens/InsurancePlansScreen';
import WeatherRiskScreen from '../screens/WeatherRiskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PlanDetailsScreen from '../screens/PlanDetailsScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CompareScreen from '../screens/CompareScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

import { COLORS } from '../utils/theme';
import { useAuth } from '../contexts/AuthContext';

// Define the param list for the stack navigator
export type MainStackParamList = {
  Home: undefined;
  InsurancePlans: undefined;
  WeatherRisk: undefined;
  Profile: undefined;
  PlanDetails: { planId: number };
  Compare: { planIds: number[] };
  Checkout: { planId: number };
  Login: undefined;
  Register: undefined;
};

// Create the navigators
const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

// Main tab navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          height: 60,
          paddingVertical: 5,
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="InsurancePlans"
        component={InsurancePlansScreen}
        options={{
          tabBarLabel: 'Seguros',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="shield-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="WeatherRisk"
        component={WeatherRiskScreen}
        options={{
          tabBarLabel: 'Riesgos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-cloudy-alert" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main stack navigator
const AppNavigator = () => {
  const { user } = useAuth();
  
  return (
    <Stack.Navigator 
      initialRouteName={user ? "Home" : "Login"}
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {user ? (
        // Authenticated user routes
        <>
          <Stack.Screen 
            name="Home" 
            component={TabNavigator} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="PlanDetails" 
            component={PlanDetailsScreen} 
            options={{ title: 'Detalles del Plan' }} 
          />
          <Stack.Screen 
            name="Compare" 
            component={CompareScreen} 
            options={{ title: 'Comparar Planes' }} 
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{ title: 'Checkout' }} 
          />
        </>
      ) : (
        // Authentication routes
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;