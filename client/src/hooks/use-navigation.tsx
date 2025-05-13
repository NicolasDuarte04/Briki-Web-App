import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

/**
 * Custom hook to provide enhanced navigation functionality
 * Handles proper back navigation for authenticated users
 */
export function useNavigation() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();

  // Track navigation history in session storage
  useEffect(() => {
    try {
      // Don't track authentication page or countdown page in history
      if (location !== '/auth' && location !== '/') {
        const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
        
        // Don't add duplicate entries consecutively
        if (history.length === 0 || history[history.length - 1] !== location) {
          history.push(location);
          sessionStorage.setItem('navigationHistory', JSON.stringify(history));
        }
      }
    } catch (error) {
      console.error('Error updating navigation history:', error);
    }
  }, [location]);

  /**
   * Navigate back in history or to home page if no history exists
   */
  const goBack = useCallback(() => {
    try {
      const history = JSON.parse(sessionStorage.getItem('navigationHistory') || '[]');
      
      // Remove current page from history
      if (history.length > 0 && history[history.length - 1] === location) {
        history.pop();
      }
      
      // If we have previous pages in history, go back to the most recent one
      if (history.length > 0) {
        const previousPage = history.pop();
        sessionStorage.setItem('navigationHistory', JSON.stringify(history));
        navigate(previousPage);
      } else {
        // If authenticated, go to home page, otherwise to countdown
        navigate(user ? '/home' : '/');
      }
    } catch (error) {
      console.error('Error navigating back:', error);
      // Fallback to home page on error
      navigate(user ? '/home' : '/');
    }
  }, [location, navigate, user]);

  /**
   * Navigate to a specific path
   */
  const goTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return {
    currentLocation: location,
    navigate: goTo,
    goBack
  };
}