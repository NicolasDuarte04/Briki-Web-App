import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#4B76E5',
  primaryLight: '#8BB2FE',
  primaryDark: '#1E4AAD',
  secondary: '#FF8A47',
  accent: '#01B574',
  background: '#F7F9FC',
  surface: '#FFFFFF',
  text: '#2D3748',
  textSecondary: '#718096',
  border: '#E2E8F0',
  divider: '#EDF2F7',
  error: '#E53E3E',
  success: '#01B574',
  warning: '#ED8936',
  info: '#4299E1',
  
  // Risk colors
  riskLow: '#01B574',
  riskModerate: '#F6AD55',
  riskHigh: '#F56565',
  riskExtreme: '#9F1E1E',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#718096',
  grayLight: '#A0AEC0',
  grayDark: '#4A5568',
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
    text: COLORS.text,
    onSurface: COLORS.text,
    outline: COLORS.border,
  },
  roundness: 10,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryDark,
    secondary: COLORS.secondary,
    background: '#1A202C',
    surface: '#2D3748',
    error: COLORS.error,
    text: '#FFFFFF',
    onSurface: '#FFFFFF',
    outline: '#4A5568',
  },
  roundness: 10,
};