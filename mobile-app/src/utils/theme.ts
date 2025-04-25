import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  primary: '#0056b3',
  primaryLight: '#4d8cce',
  primaryDark: '#003876',
  secondary: '#ff9800',
  secondaryLight: '#ffc947',
  secondaryDark: '#c66900',
  accent: '#4caf50',
  background: '#f8f9fa',
  surface: '#ffffff',
  error: '#d32f2f',
  text: '#212121',
  textSecondary: '#757575',
  disabled: '#bdbdbd',
  border: '#e0e0e0',
  notification: '#ff9800',
  card: '#ffffff',
  black: '#000000',
  white: '#ffffff',
  gray: '#9e9e9e',
  grayLight: '#e0e0e0',
  grayDark: '#616161',
  transparent: 'transparent',
  
  // Risk levels
  riskLow: '#4caf50',
  riskModerate: '#ffeb3b',
  riskHigh: '#ff9800',
  riskExtreme: '#f44336',
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    primaryContainer: COLORS.primaryLight,
    secondary: COLORS.secondary,
    secondaryContainer: COLORS.secondaryLight,
    surface: COLORS.surface,
    background: COLORS.background,
    error: COLORS.error,
    onSurface: COLORS.text,
    onBackground: COLORS.text,
    backdrop: COLORS.black + '80',  // Black with 50% opacity
  },
};