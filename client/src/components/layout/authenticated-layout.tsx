import React from 'react';
import { useLocation } from 'wouter';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [location] = useLocation();

  // Skip layout wrapper for auth pages to allow full-screen auth forms
  if (location === '/auth') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar will be handled by parent layout or navigation system */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}