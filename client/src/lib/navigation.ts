import { useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

/**
 * Get the appropriate insurance path based on authentication status
 * @param category - Insurance category (travel, auto, pet, health)
 * @returns Path to either the authenticated or public version of the page
 */
export function getInsurancePath(category: string, isAuthenticated: boolean): string {
  return isAuthenticated ? `/insurance/${category}` : `/explore/${category}`;
}

/**
 * Hook that provides navigation utilities with authentication awareness
 */
export function useNavigation() {
  const [location, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  // Track navigation history in session storage for smart back navigation
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

  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const navigateToAuth = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const navigateToInsuranceCategory = useCallback((category: string) => {
    const path = getInsurancePath(category, isAuthenticated);
    navigate(path);
  }, [navigate, isAuthenticated]);

  const navigateToProfile = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/profile');
  }, [navigate, isAuthenticated]);

  const navigateToSettings = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate('/settings');
  }, [navigate, isAuthenticated]);

  const navigateToCheckout = useCallback((planId: string) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate(`/checkout/${planId}`);
  }, [navigate, isAuthenticated]);

  const navigateToQuote = useCallback((category: string) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    navigate(`/insurance/${category}/quote`);
  }, [navigate, isAuthenticated]);

  /**
   * Smart back navigation that uses history or falls back to home page
   */
  const navigateBack = useCallback(() => {
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
        // Fallback to appropriate home page
        navigate(user ? '/home' : '/');
      }
    } catch (error) {
      console.error('Error navigating back:', error);
      // Fallback to browser history API
      window.history.back();
    }
  }, [location, navigate, user]);

  // Generate paths for main navigation items based on auth state
  const navPaths = [
    '/', // Home
    getInsurancePath('travel', isAuthenticated),
    getInsurancePath('auto', isAuthenticated),
    getInsurancePath('pet', isAuthenticated),
    getInsurancePath('health', isAuthenticated),
  ];

  return {
    location,
    navigate,
    navigateToHome,
    navigateToAuth,
    navigateToInsuranceCategory,
    navigateToProfile,
    navigateToSettings,
    navigateToCheckout,
    navigateToQuote,
    navigateBack,
    navPaths,
    isCurrentPath: (path: string) => location === path,
    isActivePath: (path: string) => location === path || (path !== '/' && location.startsWith(path)),
  };
}