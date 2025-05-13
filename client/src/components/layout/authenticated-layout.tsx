import React from 'react';
import { FloatingAssistantButton } from './floating-assistant-button';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps the app content and includes the AI Assistant button
 * Note: The FloatingAssistantButton handles its own visibility logic
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <>
      {children}
      <FloatingAssistantButton />
    </>
  );
}