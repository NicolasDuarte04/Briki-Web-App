import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { AIAssistantButton } from './ai-assistant-button';

/**
 * Floating AI assistant button that appears in the corner of every page
 * but excludes itself from certain pages where it would be redundant
 * and only shows when user is authenticated
 */
export function FloatingAssistantButton() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  // Don't show the floating button on these pages
  const excludedPaths = [
    '/ai-assistant', // AI demo page already has assistant components
    '/', // Countdown page 
    '/auth', // Login/Register page
    '/countdown', // Alternate countdown page path
    '/login', // Alternate login path
    '/register', // Alternate register path
    '/terms', // Terms page
    '/learn-more', // Learn more page
  ];
  
  // Don't show the button if:
  // 1. User is not authenticated OR
  // 2. Current path is in the excluded list
  if (!user || excludedPaths.some(path => location.startsWith(path))) {
    console.log("Hiding AI Assistant Button:", { 
      path: location, 
      isAuthenticated: !!user,
      isExcludedPath: excludedPaths.some(path => location.startsWith(path))
    });
    return null;
  }
  
  console.log("Showing AI Assistant Button:", { path: location, isAuthenticated: !!user });
  return <AIAssistantButton displayVariant="fab" />;
}