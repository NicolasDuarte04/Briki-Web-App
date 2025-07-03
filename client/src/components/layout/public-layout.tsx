import React from 'react';
import { useNavigation } from '../../lib/navigation';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import Navbar from './navbar';
import { useLanguage } from '../language-selector';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { location } = useNavigation();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Add the new navbar */}
      {location !== '/auth' && <Navbar />}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Standardized Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <motion.h2 
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent"
              >
                briki
              </motion.h2>
              <p className="text-sm text-gray-500">{t('footer.tagline')}</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">{t('footer.terms')}</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">{t('footer.privacy')}</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600">{t('footer.contact')}</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-400 text-center">© {new Date().getFullYear()} Briki. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}