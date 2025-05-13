import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { FloatingAssistantButton } from './floating-assistant-button';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that shows AI assistant only for authenticated users
 * and only on appropriate pages (not countdown or login)
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  
  // List of paths where AI Assistant should NOT be shown
  const excludedPaths = ['/', '/auth', '/countdown', '/terms', '/learn-more'];
  // Check if current path exactly matches or starts with any excluded path
  const isExcludedPath = excludedPaths.some(path => 
    location === path || location.startsWith(`${path}/`)
  );
  
  // Only show assistant if user is logged in AND not on an excluded path
  const showAssistant = !!user && !isExcludedPath;
  
  // Debug logging
  console.log("AI Assistant visibility:", { 
    location, 
    isLoggedIn: !!user, 
    isExcludedPath, 
    showAssistant 
  });
  
  return (
    <>
      {children}
      {showAssistant && <FloatingAssistantButton />}
    </>
  );
}