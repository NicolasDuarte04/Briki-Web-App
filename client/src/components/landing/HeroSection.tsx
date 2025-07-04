import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { useLanguage } from '../language-selector';
import { useAuth } from '../../hooks/use-auth';

export const HeroSection: React.FC = () => {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden py-20">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto space-y-12"
        >
          {/* Beta badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-full border border-blue-200 dark:border-blue-800"
          >
            <Star className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {t('hero.badge')}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
          >
            {t('hero.title1')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              {t('hero.title2')}
            </span>
            {t('hero.title3') && ` ${t('hero.title3')}`}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => {
                console.log('[HeroSection] Navigating to /ask-briki-ai');
                navigate('/ask-briki-ai');
              }}
              className="h-16 px-10 text-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 hover:shadow-xl hover:shadow-blue-500/25 font-semibold group"
            >
              {t('hero.ctaAI')}
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            {user ? (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/profile')}
                className="h-16 px-10 text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
              >
                {t('hero.ctaProfile')?.trim() || 'Ver mi perfil'}
              </Button>
            ) : (
            <Button 
              size="lg" 
              variant="outline"
                onClick={() => navigate('/auth')}
              className="h-16 px-10 text-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
            >
                {t('hero.ctaGetStarted') || 'Comenzar'}
            </Button>
            )}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 text-gray-600 dark:text-gray-400 pt-8"
          >
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-green-500" />
              <span className="text-base font-medium">{t('hero.secure')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="text-base font-medium">{t('hero.users')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-base font-medium">{t('hero.rating')}</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-purple-500" />
              <span className="text-base font-medium">{t('hero.instant')}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 