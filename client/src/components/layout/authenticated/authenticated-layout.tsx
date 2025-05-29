import React from 'react';
import Navbar from '@/components/navbar';
import { useNavigation } from '@/lib/navigation';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { location } = useNavigation();

  return (
    <>
      {location !== '/auth' && <Navbar />}
      {children}
    </>
  );
}