// Common theme colors and styles for consistent UI across the app
import { DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#4B76E5', // Briki Blue - Main brand color
  primaryDark: '#3A5FC8', // Darker variant
  primaryLight: '#C7D3F7', // Lighter variant
  secondary: '#F8B400', // Secondary brand color
  secondaryDark: '#E59E00',
  secondaryLight: '#FFE9B3',
  accent: '#FF9800', // Highlighting accent
  success: '#4CAF50', // Success state
  warning: '#FFC107', // Warning state
  error: '#F44336', // Error state
  info: '#2196F3', // Information state
  
  // Neutral colors
  background: '#F5F7FA', // App background
  surface: '#FFFFFF', // Card or surface background
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',      // Default gray for neutral risk
  grayLight: '#F0F0F0', // Light gray for backgrounds
  
  // Text colors
  text: '#212121', // Primary text
  textSecondary: '#757575', // Secondary text
  textDisabled: '#9E9E9E', // Disabled text
  
  // Border and dividers
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Overlay and shadows
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.12)',
  
  // Risk levels for weather risk indicators
  riskLow: '#4CAF50',      // Green - Low risk
  riskModerate: '#FF9800', // Orange - Moderate risk
  riskHigh: '#F44336',     // Red - High risk
  riskExtreme: '#B71C1C',  // Dark red - Extreme risk
};

export const FONTS = {
  regular: 'System',
  medium: 'System-Medium',
  bold: 'System-Bold',
  light: 'System-Light',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
};

// Create a theme object for React Native Paper
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    accent: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    error: COLORS.error,
    onSurface: COLORS.text,
    notification: COLORS.accent,
  },
  fonts: {
    regular: {
      fontFamily: FONTS.regular,
    },
    medium: {
      fontFamily: FONTS.medium,
    },
    light: {
      fontFamily: FONTS.light,
    },
    thin: {
      fontFamily: FONTS.light,
    },
  },
  roundness: 8,
};