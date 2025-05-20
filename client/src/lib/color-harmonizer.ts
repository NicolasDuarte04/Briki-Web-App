import { useState, useEffect } from 'react';

// Base color palette
export type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  muted: string;
};

// Insurance categories with their associated color schemes
export type InsuranceCategory = 'travel' | 'auto' | 'pet' | 'health' | 'home' | 'default';

export const categoryPalettes: Record<InsuranceCategory, ColorPalette> = {
  travel: {
    primary: '#2563eb', // Blue
    secondary: '#3b82f6',
    accent: '#60a5fa',
    background: '#f0f9ff',
    text: '#1e3a8a',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    muted: '#94a3b8',
  },
  auto: {
    primary: '#16a34a', // Green
    secondary: '#22c55e',
    accent: '#4ade80',
    background: '#f0fdf4',
    text: '#14532d',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6', 
    muted: '#94a3b8',
  },
  pet: {
    primary: '#7c3aed', // Purple
    secondary: '#8b5cf6',
    accent: '#a78bfa',
    background: '#f5f3ff',
    text: '#5b21b6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    muted: '#94a3b8',
  },
  health: {
    primary: '#dc2626', // Red
    secondary: '#ef4444',
    accent: '#f87171',
    background: '#fef2f2',
    text: '#991b1b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    muted: '#94a3b8',
  },
  home: {
    primary: '#d97706', // Amber
    secondary: '#f59e0b',
    accent: '#fbbf24',
    background: '#fffbeb',
    text: '#92400e',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    muted: '#94a3b8',
  },
  default: {
    primary: '#2563eb', // Blue
    secondary: '#3b82f6',
    accent: '#60a5fa',
    background: '#f9fafb',
    text: '#1e293b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    muted: '#94a3b8',
  },
};

// Function to generate harmonious color variants
export function generateHarmoniousVariants(baseColor: string, count: number = 3): string[] {
  // This is a simplified implementation that adjusts lightness/darkness
  // In a production app, you might use a more sophisticated algorithm
  
  // Convert hex to HSL for easier manipulation
  const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
    // Remove the hash if it exists
    hex = hex.replace(/^#/, '');
    
    // Parse the hex values
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b);
    let cmax = Math.max(r, g, b);
    let delta = cmax - cmin;
    let h = 0;
    let s = 0;
    let l = 0;
    
    // Calculate hue
    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    // Calculate lightness
    l = (cmax + cmin) / 2;
    
    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    // Convert to percentage
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    
    return { h, s, l };
  };
  
  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    // Convert to hex string
    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
    
    return `#${rHex}${gHex}${bHex}`;
  };
  
  const hsl = hexToHSL(baseColor);
  const variants: string[] = [];
  
  // Generate variants by adjusting lightness
  const step = 12; // How much to adjust lightness by
  const middleIndex = Math.floor(count / 2);
  
  for (let i = 0; i < count; i++) {
    const newL = Math.max(0, Math.min(100, hsl.l + (i - middleIndex) * step));
    variants.push(hslToHex(hsl.h, hsl.s, newL));
  }
  
  return variants;
}

// Function to adjust palette for accessibility
export function adjustForAccessibility(palette: ColorPalette, preference: 'default' | 'high-contrast' | 'color-blind'): ColorPalette {
  // Create a copy of the palette to avoid mutation
  const adjustedPalette = { ...palette };
  
  switch (preference) {
    case 'high-contrast':
      // Increase contrast by darkening text and lightening background
      adjustedPalette.text = '#000000';
      adjustedPalette.background = '#ffffff';
      adjustedPalette.muted = '#6b7280';
      break;
      
    case 'color-blind':
      // Use color-blind friendly palette (focus on blue/yellow contrast rather than red/green)
      adjustedPalette.primary = '#0077c2';
      adjustedPalette.secondary = '#004c8c';
      adjustedPalette.success = '#006b76';
      adjustedPalette.warning = '#ffbb00';
      adjustedPalette.error = '#c70000';
      adjustedPalette.info = '#0077c2';
      break;
      
    case 'default':
    default:
      // No changes
      break;
  }
  
  return adjustedPalette;
}

// Custom hook to use the color palette
export function useColorPalette(
  category: InsuranceCategory = 'default',
  accessibility: 'default' | 'high-contrast' | 'color-blind' = 'default'
): ColorPalette {
  const [palette, setPalette] = useState<ColorPalette>(categoryPalettes[category]);
  
  useEffect(() => {
    // Get the base palette for the category
    let basePalette = categoryPalettes[category];
    
    // Adjust for accessibility if needed
    if (accessibility !== 'default') {
      basePalette = adjustForAccessibility(basePalette, accessibility);
    }
    
    setPalette(basePalette);
  }, [category, accessibility]);
  
  return palette;
}

// Function to generate a CSS variables string from a palette
export function generateCSSVariables(palette: ColorPalette): string {
  return `
    --color-primary: ${palette.primary};
    --color-secondary: ${palette.secondary};
    --color-accent: ${palette.accent};
    --color-background: ${palette.background};
    --color-text: ${palette.text};
    --color-success: ${palette.success};
    --color-warning: ${palette.warning};
    --color-error: ${palette.error};
    --color-info: ${palette.info};
    --color-muted: ${palette.muted};
  `;
}

// Function to apply palette to DOM
export function applyPaletteToDOM(palette: ColorPalette): void {
  const root = document.documentElement;
  const cssVars = generateCSSVariables(palette);
  
  // Remove whitespace and apply each line as a style
  cssVars.split(';')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .forEach(line => {
      const [property, value] = line.split(':').map(part => part.trim());
      root.style.setProperty(property, value);
    });
}