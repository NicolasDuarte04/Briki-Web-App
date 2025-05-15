import { useCallback } from 'react';
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
  const { isAuthenticated } = useAuth();

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

  const navigateBack = useCallback(() => {
    window.history.back();
  }, []);

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