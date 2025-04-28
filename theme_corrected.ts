// Common theme colors and styles for consistent UI across the app
import { DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#1E88E5', // Main brand color
  primaryDark: '#1565C0', // Darker variant
  primaryLight: '#BBDEFB', // Lighter variant
  secondary: '#FF5722', // Secondary action color
  secondaryDark: '#E64A19',
  secondaryLight: '#FFCCBC',
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
  gray: '#9E9E9E',         // Default gray for neutral risk
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
    accent: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    text: COLORS.text,
    error: COLORS.error,
  },
  fonts: {
    regular: FONTS.regular,
    medium: FONTS.medium,
    light: FONTS.light,
    thin: FONTS.light,
  },
};