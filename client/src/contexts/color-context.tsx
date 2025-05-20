import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ColorPalette, 
  InsuranceCategory,
  categoryPalettes, 
  applyPaletteToDOM,
  adjustForAccessibility
} from '@/lib/color-harmonizer';

interface ColorContextType {
  currentPalette: ColorPalette;
  currentCategory: InsuranceCategory;
  accessibilityMode: 'default' | 'high-contrast' | 'color-blind';
  setCategory: (category: InsuranceCategory) => void;
  setAccessibilityMode: (mode: 'default' | 'high-contrast' | 'color-blind') => void;
  getCategoryColor: (category: InsuranceCategory) => string;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCategory, setCurrentCategory] = useState<InsuranceCategory>('default');
  const [accessibilityMode, setAccessibilityMode] = useState<'default' | 'high-contrast' | 'color-blind'>('default');
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(categoryPalettes.default);

  // Update palette when category or accessibility mode changes
  useEffect(() => {
    let basePalette = categoryPalettes[currentCategory];
    let adjustedPalette = adjustForAccessibility(basePalette, accessibilityMode);
    
    setCurrentPalette(adjustedPalette);
    applyPaletteToDOM(adjustedPalette);
    
    // Store preferences in localStorage for persistence
    localStorage.setItem('briki-color-category', currentCategory);
    localStorage.setItem('briki-accessibility-mode', accessibilityMode);
  }, [currentCategory, accessibilityMode]);

  // Load saved preferences on initial render
  useEffect(() => {
    const savedCategory = localStorage.getItem('briki-color-category') as InsuranceCategory | null;
    const savedAccessibility = localStorage.getItem('briki-accessibility-mode') as 'default' | 'high-contrast' | 'color-blind' | null;
    
    if (savedCategory && Object.keys(categoryPalettes).includes(savedCategory)) {
      setCurrentCategory(savedCategory);
    }
    
    if (savedAccessibility && ['default', 'high-contrast', 'color-blind'].includes(savedAccessibility)) {
      setAccessibilityMode(savedAccessibility as 'default' | 'high-contrast' | 'color-blind');
    }
  }, []);

  // Helper to get the primary color for any category
  const getCategoryColor = (category: InsuranceCategory): string => {
    return categoryPalettes[category].primary;
  };

  const value = {
    currentPalette,
    currentCategory,
    accessibilityMode,
    setCategory: setCurrentCategory,
    setAccessibilityMode,
    getCategoryColor
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = (): ColorContextType => {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColorContext must be used within a ColorProvider');
  }
  return context;
};