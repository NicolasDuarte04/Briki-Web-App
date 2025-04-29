/**
 * Storage utility for Briki Travel Insurance app
 * 
 * This provides a unified storage interface that works across platforms:
 * - Uses AsyncStorage on React Native
 * - Falls back to localStorage on web
 */

// Interface for our storage operations
export interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Web storage implementation
class WebStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

// Create a class to handle AsyncStorage availability
class UniversalStorage implements StorageInterface {
  private storage: StorageInterface;

  constructor() {
    // Determine if we're in a web environment
    const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    
    if (isWeb) {
      this.storage = new WebStorage();
    } else {
      // Try to load AsyncStorage (this would be for React Native)
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        this.storage = AsyncStorage;
      } catch (error) {
        console.warn('AsyncStorage not available, falling back to in-memory storage');
        // Fallback to memory storage
        this.storage = new WebStorage();
      }
    }
  }

  async getItem(key: string): Promise<string | null> {
    return this.storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    return this.storage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    return this.storage.removeItem(key);
  }
}

// Export a singleton instance
export const storage = new UniversalStorage();