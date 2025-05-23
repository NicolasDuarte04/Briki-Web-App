import { useContext } from 'react';
import { AnonymousUserContext, AnonymousUserContextType } from '@/contexts/anonymous-user-context';

/**
 * Custom hook to access anonymous user context
 * Provides convenient access to anonymous user state management
 */
export function useAnonymousUser(): AnonymousUserContextType {
  const context = useContext(AnonymousUserContext);
  
  if (!context) {
    throw new Error('useAnonymousUser must be used within an AnonymousUserProvider');
  }
  
  return context;
}