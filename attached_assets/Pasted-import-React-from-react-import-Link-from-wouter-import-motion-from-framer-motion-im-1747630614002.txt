import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/language-selector';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import GradientButton from '@/components/gradient-button';
import { useNavigation } from '@/lib/navigation';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const { navigate } = useNavigation();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Public Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow transition border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <motion.h1
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="text-2xl md:text-3xl font-bold tracking-tighter bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent drop-shadow-md"
                >
                  briki
                </motion.h1>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:items-center space-x-1">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/ask-briki" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                Ask Briki
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                Blog
              </Link>
              <Link href="/forum" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                Forum
              </Link>
              <Link href="/careers" className="text-gray-600 hover:text-blue-600 px-3 py-2.5 text-sm font-medium transition-colors">
                Careers
              </Link>
            </div>
            
            {/* User actions area */}
            {isLoading ? (
              <div className="flex items-center">
                {/* Loading spinner would go here */}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="ghost" 
                      onClick={() => navigate("/auth")}
                      className="text-foreground/60 hover:text-primary"
                    >
                      {t('signIn')}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <GradientButton 
                      onClick={() => navigate("/auth")}
                      className="ml-2 shadow-md"
                    >
                      {t('signUp')}
                    </GradientButton>
                  </motion.div>
                </div>
              </div>
            )}
            
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#4C6EFF] to-[#5F9FFF] bg-clip-text text-transparent">briki</h2>
              <p className="text-sm text-gray-500">Insurance simplified.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">Terms</Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600">Privacy</Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-blue-600">Contact</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-400 text-center">© {new Date().getFullYear()} Briki. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}