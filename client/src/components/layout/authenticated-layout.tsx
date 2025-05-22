import React from 'react';
import { useLocation } from 'wouter';
import { FloatingAssistantButton } from './floating-assistant-button';
import Navbar from "@/components/navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that wraps authenticated B2C pages.
 * Includes the new universal Navbar and AI Assistant button.
 */
export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Show navbar on all pages except the auth screen */}
      {location !== '/auth' && <Navbar />}
      {children}
      <FloatingAssistantButton />
    </>
  );
}