import React from 'react';
// Removed the FloatingAssistantButton import to avoid duplicate buttons

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps the app content
 * Note: The AI Assistant button is now handled at the App level
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <>
      {children}
      {/* Removed FloatingAssistantButton to prevent duplicate buttons */}
    </>
  );
}