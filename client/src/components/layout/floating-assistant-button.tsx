import React from 'react';
import { useLocation } from 'wouter';
import { AIAssistantButton } from './ai-assistant-button';

/**
 * Floating AI assistant button that appears in the corner of every page
 * but excludes itself from certain pages where it would be redundant
 */
export function FloatingAssistantButton() {
  const [location] = useLocation();
  
  // Don't show the floating button on these pages
  const excludedPaths = [
    '/ai-assistant', // AI demo page already has assistant components
  ];
  
  if (excludedPaths.some(path => location.startsWith(path))) {
    return null;
  }
  
  return <AIAssistantButton displayVariant="fab" />;
}