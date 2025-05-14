import React from 'react';
import { useLocation } from 'wouter';
import { FloatingAssistantButton } from './floating-assistant-button';
import NavbarNew from '@/components/navbar-new';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps the app content and includes the AI Assistant button and Navbar
 * Note: The FloatingAssistantButton handles its own visibility logic
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [location] = useLocation();
  
  return (
    <>
      {/* Don't show navbar on auth page */}
      {location !== '/auth' && <NavbarNew />}
      {children}
      <FloatingAssistantButton />
    </>
  );
}