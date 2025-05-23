import { ReactNode, createContext, useEffect, useState } from 'react';

// Define the anonymous user data structure
export interface AnonymousUserData {
  anonymousId: string;
  tempQuoteData?: {
    tripInfo?: any;
    insuranceType?: string;
    quoteParams?: any;
    selectedPlans?: string[];
    viewedPlans?: string[];
  };
  preferences?: {
    language?: string;
    currency?: string;
    recentSearches?: string[];
  };
  createdAt: number;
  lastActive: number;
}

// Context type definition
export interface AnonymousUserContextType {
  anonymousId: string;
  isAnonymous: boolean;
  tempUserData: AnonymousUserData;
  updateTempData: (newData: Partial<AnonymousUserData['tempQuoteData']>) => void;
  updatePreferences: (newPrefs: Partial<AnonymousUserData['preferences']>) => void;
  clearTempData: () => void;
  getStorageKey: (key: string) => string;
}

// Create the context with default values
export const AnonymousUserContext = createContext<AnonymousUserContextType>({
  anonymousId: '',
  isAnonymous: false,
  tempUserData: { anonymousId: '', createdAt: 0, lastActive: 0 },
  updateTempData: () => {},
  updatePreferences: () => {},
  clearTempData: () => {},
  getStorageKey: () => '',
});

export interface AnonymousUserProviderProps {
  children: ReactNode;
}

// Storage keys
const ANONYMOUS_ID_KEY = 'briki-anonymous-id';
const ANONYMOUS_DATA_KEY = 'briki-anonymous-data';
const SESSION_EXPIRY_DAYS = 30;

/**
 * Provider component that manages anonymous user session data
 */
export function AnonymousUserProvider({ children }: AnonymousUserProviderProps) {
  // Generate or retrieve anonymous ID
  const [anonymousId, setAnonymousId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    
    const storedId = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (storedId) return storedId;
    
    // Generate new anonymous ID with timestamp prefix for uniqueness
    const newId = `anon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(ANONYMOUS_ID_KEY, newId);
    return newId;
  });
  
  // Initialize with stored data or defaults
  const [tempUserData, setTempUserData] = useState<AnonymousUserData>(() => {
    if (typeof window === 'undefined') {
      return { 
        anonymousId, 
        createdAt: Date.now(),
        lastActive: Date.now()
      };
    }
    
    try {
      const storedData = localStorage.getItem(ANONYMOUS_DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as AnonymousUserData;
        
        // Check if data is expired (older than SESSION_EXPIRY_DAYS)
        const dataAge = Date.now() - parsedData.createdAt;
        const isExpired = dataAge > (SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        
        if (isExpired) {
          // Clear expired data
          localStorage.removeItem(ANONYMOUS_DATA_KEY);
          return { 
            anonymousId, 
            createdAt: Date.now(),
            lastActive: Date.now()
          };
        }
        
        // Return valid stored data
        return {
          ...parsedData,
          anonymousId, // Ensure ID matches if it was regenerated
          lastActive: Date.now()
        };
      }
    } catch (error) {
      console.error('Error parsing anonymous user data:', error);
    }
    
    // Default fresh data
    return { 
      anonymousId, 
      createdAt: Date.now(),
      lastActive: Date.now()
    };
  });
  
  // Flag for anonymous state (always true in this context)
  const isAnonymous = true;
  
  // Update localStorage when data changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(ANONYMOUS_DATA_KEY, JSON.stringify({
      ...tempUserData,
      lastActive: Date.now()
    }));
  }, [tempUserData]);
  
  // Update temp quote data
  const updateTempData = (newData: Partial<AnonymousUserData['tempQuoteData']>) => {
    setTempUserData(prev => ({
      ...prev,
      tempQuoteData: {
        ...prev.tempQuoteData,
        ...newData
      },
      lastActive: Date.now()
    }));
  };
  
  // Update user preferences
  const updatePreferences = (newPrefs: Partial<AnonymousUserData['preferences']>) => {
    setTempUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...newPrefs
      },
      lastActive: Date.now()
    }));
  };
  
  // Clear temporary data (keep the ID)
  const clearTempData = () => {
    setTempUserData({
      anonymousId,
      createdAt: tempUserData.createdAt,
      lastActive: Date.now()
    });
  };
  
  // Helper to generate consistent localStorage keys for additional data
  const getStorageKey = (key: string) => `briki-anon-${anonymousId}-${key}`;
  
  // Provide context value
  const value: AnonymousUserContextType = {
    anonymousId,
    isAnonymous,
    tempUserData,
    updateTempData,
    updatePreferences,
    clearTempData,
    getStorageKey
  };
  
  return (
    <AnonymousUserContext.Provider value={value}>
      {children}
    </AnonymousUserContext.Provider>
  );
}