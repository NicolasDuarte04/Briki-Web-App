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
  
  // List of public pages where we don't want to show the authenticated navbar
  const publicPages = ['/', '/features', '/pricing', '/ask-briki', '/blog', '/forum', '/careers', '/auth'];
  const isPublicPage = publicPages.some(path => location === path || location.startsWith(`${path}/`));
  
  return (
    <>
      {/* Don't show navbar on public pages (they use PublicLayout) */}
      {!isPublicPage && <NavbarNew />}
      {children}
      <FloatingAssistantButton />
    </>
  );
}