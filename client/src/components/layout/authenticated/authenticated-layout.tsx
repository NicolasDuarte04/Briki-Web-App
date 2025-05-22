import React from 'react';
import { FloatingAssistantButton } from '../floating-assistant-button';
import Navbar from '@/components/navbar';
import { useNavigation } from '@/lib/navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps the app content and includes the AI Assistant button and Navbar
 * Note: The FloatingAssistantButton handles its own visibility logic
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { location } = useNavigation();
  
  return (
    <>
      {/* Don't show navbar on auth page */}
      {location !== '/auth' && <Navbar />}
      <FloatingAssistantButton />
      {children}
    </>
  );
}