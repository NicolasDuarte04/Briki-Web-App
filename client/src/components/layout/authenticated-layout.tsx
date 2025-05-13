import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { FloatingAssistantButton } from './floating-assistant-button';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that shows AI assistant only for authenticated users
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user } = useAuth();
  
  return (
    <>
      {children}
      {user && <FloatingAssistantButton />}
    </>
  );
}