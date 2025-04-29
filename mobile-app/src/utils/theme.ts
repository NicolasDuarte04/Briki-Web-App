/**
 * Briki Travel Insurance App Theme
 * 
 * This file defines the app color palette, typography, and spacing
 */

// Brand colors
export const COLORS = {
  // Primary colors
  primary: '#4B76E5', // Briki Blue
  primaryLight: '#6B9CF5',
  primaryDark: '#2A55CC',
  
  // Secondary colors
  secondary: '#F8B400', // Briki Yellow
  secondaryLight: '#FFC933',
  secondaryDark: '#E59A00',
  
  // Text colors
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  
  // UI colors
  background: '#FFFFFF',
  backgroundLight: '#F9FAFC',
  card: '#FFFFFF',
  border: '#E0E0E0',
  
  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
  
  // Risk level colors
  riskVeryLow: '#4CAF50',  // Green
  riskLow: '#8BC34A',      // Light Green
  riskModerate: '#FFC107', // Amber
  riskHigh: '#FF9800',     // Orange
  riskVeryHigh: '#F44336', // Red
  
  // Other
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent'
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System'
};

// Font sizes
export const FONT_SIZES = {
  xs: 10,
  small: 12,
  medium: 14,
  large: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  headline: 32
};

// Spacing
export const SPACING = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// Shadows (platform agnostic)
export const SHADOWS = {
  small: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  }
};

// Combined theme
export const theme = {
  colors: COLORS,
  fonts: FONTS,
  fontSizes: FONT_SIZES,
  spacing: SPACING,
  shadows: SHADOWS,
  // Web-specific overrides
  web: {
    fontFamily: {
      regular: 'Inter, system-ui, sans-serif',
      medium: 'Inter, system-ui, sans-serif',
      bold: 'Inter, system-ui, sans-serif',
      light: 'Inter, system-ui, sans-serif'
    }
  }
};