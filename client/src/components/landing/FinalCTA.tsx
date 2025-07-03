import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '../ui/button';
import { useLanguage } from '../language-selector';

export const FinalCTA: React.FC = () => {
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" />
      {/* Additional decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto space-y-12"
        >
          {/* Main CTA */}
          <div className="space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl font-bold text-white leading-tight"
            >
              {t('cta.title')}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              {t('cta.subtitle')}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/ask-briki-ai')}
                className="h-14 px-8 text-base bg-white text-blue-600 hover:bg-gray-50 hover:shadow-xl hover:shadow-white/20 font-semibold group"
              >
                {t('hero.ctaAI')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/home')}
                className="h-14 px-8 text-base bg-transparent text-white border-2 border-white/50 hover:bg-white/10 hover:border-white font-medium"
              >
                {t('hero.ctaBrowse')}
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12 text-white/90"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-sm md:text-base font-medium">{t('hero.secure')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-sm md:text-base font-medium">{t('hero.users')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                <Star className="h-5 w-5" />
              </div>
              <span className="text-sm md:text-base font-medium">{t('hero.rating')}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <span className="text-sm md:text-base font-medium">{t('hero.instant')}</span>
            </div>
          </motion.div>

          {/* Additional value props */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8"
          >
            <div className="grid md:grid-cols-3 gap-6 text-white">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-90">Free to Use</div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">2 min</div>
                <div className="text-sm opacity-90">Quick Setup</div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-90">AI Support</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}; 